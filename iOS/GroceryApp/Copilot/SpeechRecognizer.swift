import Foundation
import Speech
import AVFoundation

/// On-device speech-to-text for copilot queries.
///
/// Speech and typing resolve to the *same* search path: audio is transcribed to text here,
/// and that text is embedded with the same MiniLM model a typed query would use. There is
/// no audio embedding and no per-modality product vector.
///
/// `requiresOnDeviceRecognition = true` is the load-bearing line. `SFSpeechRecognizer` is
/// cloud-backed by default, so without it the demo's "nothing leaves the device" claim
/// would be false precisely when a presenter is on stage saying it out loud.
@MainActor
final class SpeechRecognizer: ObservableObject {

    enum State: Equatable {
        case idle
        case listening
        case unavailable(String)
    }

    @Published private(set) var state: State = .idle
    @Published private(set) var transcript = ""
    /// True when the recognizer confirmed it is running without a network round-trip.
    @Published private(set) var isOnDevice = false

    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private let audioEngine = AVAudioEngine()
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?

    var isListening: Bool { state == .listening }

    /// Requests microphone and speech permissions. Returns the reason on failure.
    func requestAuthorization() async -> String? {
        guard let recognizer, recognizer.isAvailable else {
            return "Speech recognition is not available on this device."
        }

        let speechStatus = await withCheckedContinuation { continuation in
            SFSpeechRecognizer.requestAuthorization { continuation.resume(returning: $0) }
        }
        guard speechStatus == .authorized else {
            return "Speech recognition permission was denied. Enable it in Settings to use voice search."
        }

        let micGranted = await withCheckedContinuation { continuation in
            AVAudioApplication.requestRecordPermission { continuation.resume(returning: $0) }
        }
        guard micGranted else {
            return "Microphone permission was denied. Enable it in Settings to use voice search."
        }

        if !recognizer.supportsOnDeviceRecognition {
            // Better to say so than to silently stream a shopper's question to a server
            // during a demo about on-device privacy.
            return "This device cannot do on-device speech recognition, so voice input is "
                 + "disabled to keep the query on the device. Type the query instead."
        }
        return nil
    }

    /// Starts listening. `onFinal` fires once with the completed transcript.
    func start(onFinal: @escaping (String) -> Void) async {
        if let reason = await requestAuthorization() {
            state = .unavailable(reason)
            return
        }
        guard let recognizer else {
            state = .unavailable("Speech recognition is not available.")
            return
        }

        stop()
        transcript = ""

        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.record, mode: .measurement, options: .duckOthers)
            try session.setActive(true, options: .notifyOthersOnDeactivation)

            let request = SFSpeechAudioBufferRecognitionRequest()
            request.shouldReportPartialResults = true
            request.requiresOnDeviceRecognition = true
            // Nudges the recognizer toward retail vocabulary and the invented brand
            // names in the demo catalogue, which a general model otherwise mangles.
            var vocabulary = [
                "GreenLeaf", "BluePeak", "PrimeChoice", "FarmFresh", "BudgetBest",
                "GoLocal", "SilverValley", "dairy-free", "high-protein", "low-sugar",
                "electrolyte", "planogram", "aisle", "shelf", "facings",
            ]
            if AppConfig.footwearNarrativeEnabled {
                vocabulary.append(contentsOf: ["AeroStride", "StrideLab", "Trailblaze"])
            }
            request.contextualStrings = vocabulary
            self.request = request
            isOnDevice = true

            let node = audioEngine.inputNode
            let format = node.outputFormat(forBus: 0)
            node.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in
                request.append(buffer)
            }
            audioEngine.prepare()
            try audioEngine.start()
            state = .listening

            task = recognizer.recognitionTask(with: request) { [weak self] result, error in
                guard let self else { return }
                Task { @MainActor in
                    if let result {
                        self.transcript = result.bestTranscription.formattedString
                        if result.isFinal {
                            self.stop()
                            onFinal(self.transcript)
                        }
                    }
                    if error != nil {
                        // A recognition error after some speech still has a usable
                        // partial transcript; only report failure when there is nothing.
                        let captured = self.transcript
                        self.stop()
                        if captured.isEmpty {
                            self.state = .unavailable("Could not hear that — try again.")
                        } else {
                            onFinal(captured)
                        }
                    }
                }
            }
        } catch {
            state = .unavailable("Could not start the microphone: \(error.localizedDescription)")
            stop()
        }
    }

    /// Ends the current recognition and finalises whatever was heard.
    func stop() {
        if audioEngine.isRunning {
            audioEngine.stop()
            audioEngine.inputNode.removeTap(onBus: 0)
        }
        request?.endAudio()
        task?.cancel()
        request = nil
        task = nil
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        if state == .listening { state = .idle }
    }

    /// Stops listening and hands back the transcript captured so far.
    func finish(onFinal: @escaping (String) -> Void) {
        let captured = transcript
        stop()
        if !captured.isEmpty { onFinal(captured) }
    }

    func clearError() {
        if case .unavailable = state { state = .idle }
    }
}

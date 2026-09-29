package com.example.groceryapplication.copilot

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

/**
 * On-device speech-to-text for the copilot, the Android counterpart of iOS `SpeechRecognizer`.
 *
 * The important detail is that Android's default recogniser is **cloud-backed**. Calling
 * `SpeechRecognizer.createSpeechRecognizer` and asking for results will happily ship the audio to
 * Google and hand back a transcript, which would quietly break the claim this whole feature is
 * here to make. Two things guard against that:
 *
 *  - On API 33+ we use [SpeechRecognizer.createOnDeviceSpeechRecognizer], which cannot fall back
 *    to the network.
 *  - Below 33 there is no such API, so we set `EXTRA_PREFER_OFFLINE` and — because "prefer" is
 *    only a hint — report [isOnDevice] as false. The UI shows what actually happened rather than
 *    what we asked for.
 *
 * An on-device recogniser also needs its language model present. When it is missing the framework
 * reports `ERROR_LANGUAGE_UNAVAILABLE`, so that case is named explicitly instead of surfacing as
 * a generic failure.
 */
class SpeechInput(private val context: Context) {

    var isListening by mutableStateOf(false)
        private set
    var transcript by mutableStateOf("")
        private set
    /** True only when recognition is genuinely running on-device. */
    var isOnDevice by mutableStateOf(false)
        private set
    var errorMessage by mutableStateOf<String?>(null)
        private set

    private var recognizer: SpeechRecognizer? = null
    private var onFinal: ((String) -> Unit)? = null

    companion object {
        private const val TAG = "SpeechInput"

        /**
         * Whether voice input can work at all here. Checked before the mic is drawn, so the
         * button is never offered on a device that cannot honour it.
         */
        fun isSupported(context: Context): Boolean =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                SpeechRecognizer.isOnDeviceRecognitionAvailable(context) ||
                    SpeechRecognizer.isRecognitionAvailable(context)
            } else {
                SpeechRecognizer.isRecognitionAvailable(context)
            }
    }

    /** Must be called on the main thread — `SpeechRecognizer` requires it. */
    fun start(onFinal: (String) -> Unit) {
        if (isListening) return
        this.onFinal = onFinal
        transcript = ""
        errorMessage = null

        val onDeviceAvailable = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            SpeechRecognizer.isOnDeviceRecognitionAvailable(context)

        recognizer = try {
            if (onDeviceAvailable) {
                SpeechRecognizer.createOnDeviceSpeechRecognizer(context)
            } else {
                SpeechRecognizer.createSpeechRecognizer(context)
            }
        } catch (e: Exception) {
            errorMessage = "Speech recognition is unavailable on this device."
            Log.e(TAG, "❌ could not create recognizer", e)
            return
        }
        isOnDevice = onDeviceAvailable

        recognizer?.setRecognitionListener(object : RecognitionListener {
            override fun onPartialResults(partialResults: Bundle?) {
                firstResult(partialResults)?.let { transcript = it }
            }

            override fun onResults(results: Bundle?) {
                firstResult(results)?.let { transcript = it }
                isListening = false
                val captured = transcript
                if (captured.isNotBlank()) this@SpeechInput.onFinal?.invoke(captured)
                release()
            }

            override fun onError(error: Int) {
                // A partial transcript is still useful, so a late error after the associate has
                // already been understood should not throw the words away.
                val captured = transcript
                isListening = false
                if (captured.isNotBlank()) {
                    this@SpeechInput.onFinal?.invoke(captured)
                } else {
                    errorMessage = describe(error)
                    Log.w(TAG, "speech error $error: ${errorMessage}")
                }
                release()
            }

            override fun onReadyForSpeech(params: Bundle?) {}
            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {}
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US")
            // Partials are what let the words appear in the field as they are spoken, matching
            // iOS. Without this the field stays empty until the associate stops talking.
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            // Only a hint, and ignored by the on-device recogniser, which is already offline.
            // Set anyway so the pre-33 path at least asks.
            putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
        }

        return try {
            recognizer?.startListening(intent)
            isListening = true
        } catch (e: Exception) {
            errorMessage = "Could not start listening: ${e.message}"
            release()
        }
    }

    /** Stops listening and delivers whatever was captured. */
    fun stop() {
        if (!isListening) return
        // stopListening lets the recogniser finalise, which usually produces a better transcript
        // than the last partial. onResults/onError then completes the flow.
        try {
            recognizer?.stopListening()
        } catch (e: Exception) {
            Log.w(TAG, "stopListening threw", e)
            isListening = false
            release()
        }
    }

    fun clearError() { errorMessage = null }

    private fun release() {
        try {
            recognizer?.destroy()
        } catch (_: Exception) {
        }
        recognizer = null
    }

    private fun firstResult(bundle: Bundle?): String? =
        bundle?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
            ?.firstOrNull()
            ?.takeIf { it.isNotBlank() }

    private fun describe(error: Int): String = when (error) {
        SpeechRecognizer.ERROR_AUDIO -> "Microphone problem — could not record audio."
        SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS ->
            "Microphone permission is required for voice search."
        SpeechRecognizer.ERROR_NETWORK, SpeechRecognizer.ERROR_NETWORK_TIMEOUT ->
            "This device fell back to network recognition and it failed. " +
                "On-device speech needs the offline language model installed."
        SpeechRecognizer.ERROR_NO_MATCH -> "Didn't catch that — try again."
        SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "Didn't hear anything."
        SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "The recogniser is busy; try again."
        SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE, SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED ->
            "The on-device English model isn't installed. Add it in " +
                "Settings > System > Languages > Voice input."
        else -> "Speech recognition failed (code $error)."
    }
}

import AVFoundation
import UIKit

class CameraManager: NSObject, ObservableObject {
    let session = AVCaptureSession()
    private var photoOutput = AVCapturePhotoOutput()
    private var videoDeviceInput: AVCaptureDeviceInput?
    
    @Published var isSessionRunning = false
    @Published var hasPermission = false
    @Published var showAlert = false
    
    private var photoCompletionHandler: ((UIImage?) -> Void)?
    
    override init() {
        super.init()
        checkCameraPermissions()
    }
    
    func checkCameraPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            hasPermission = true
            setupSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    self?.hasPermission = granted
                    if granted {
                        self?.setupSession()
                    } else {
                        self?.showAlert = true
                    }
                }
            }
        case .denied, .restricted:
            showAlert = true
            hasPermission = false
        @unknown default:
            showAlert = true
            hasPermission = false
        }
    }
    

    
    private func setupSession() {
        // Prevent multiple setups
        guard videoDeviceInput == nil else {
            print("📷 Camera session already configured, skipping setup")
            return
        }
        
        session.beginConfiguration()
        
        session.sessionPreset = .photo
        
        // Configure video input
        guard let videoDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else {
            print("❌ Failed to get back camera")
            session.commitConfiguration()
            return
        }
        
        do {
            let videoDeviceInput = try AVCaptureDeviceInput(device: videoDevice)
            
            if session.canAddInput(videoDeviceInput) {
                session.addInput(videoDeviceInput)
                self.videoDeviceInput = videoDeviceInput
                print("✅ Added video input to session")
            } else {
                print("❌ Could not add video device input to the session")
                session.commitConfiguration()
                return
            }
        } catch {
            print("❌ Could not create video device input: \(error)")
            session.commitConfiguration()
            return
        }
        
        // Configure photo output
        if session.canAddOutput(photoOutput) {
            session.addOutput(photoOutput)
            
            // Use modern API for high resolution capture
            if #available(iOS 16.0, *) {
                // maxPhotoDimensions will be set per photo settings
            } else {
                photoOutput.isHighResolutionCaptureEnabled = true
            }
            print("✅ Added photo output to session")
        } else {
            print("❌ Could not add photo output to the session")
            session.commitConfiguration()
            return
        }
        
        session.commitConfiguration()
        print("✅ Camera session configuration completed")
        
        // Auto-start session after setup
        startSession()
    }
    
    func startSession() {
        guard hasPermission else { 
            print("❌ Cannot start session: No camera permission")
            return 
        }
        
        DispatchQueue.global(qos: .userInitiated).async {
            if !self.session.isRunning {
                print("🚀 Starting camera session...")
                self.session.startRunning()
                DispatchQueue.main.async {
                    self.isSessionRunning = self.session.isRunning
                    print("✅ Camera session running: \(self.isSessionRunning)")
                }
            } else {
                print("ℹ️ Camera session already running")
                DispatchQueue.main.async {
                    self.isSessionRunning = true
                }
            }
        }
    }
    
    func stopSession() {
        DispatchQueue.global(qos: .userInitiated).async {
            if self.session.isRunning {
                self.session.stopRunning()
                DispatchQueue.main.async {
                    self.isSessionRunning = self.session.isRunning
                }
            }
        }
    }
    
    func capturePhoto(completion: @escaping (UIImage?) -> Void) {
        guard hasPermission && isSessionRunning else {
            completion(nil)
            return
        }
        
        photoCompletionHandler = completion
        
        var settings = AVCapturePhotoSettings()
        
        // Configure settings for high quality
        if photoOutput.availablePhotoCodecTypes.contains(.hevc) {
            settings = AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.hevc])
        }
        
        // Use modern API for high resolution photos
        if #available(iOS 16.0, *) {
            settings.maxPhotoDimensions = photoOutput.maxPhotoDimensions
        } else {
            settings.isHighResolutionPhotoEnabled = true
        }
        
        // Enable flash if available
        if let videoDeviceInput = videoDeviceInput,
           videoDeviceInput.device.isFlashAvailable {
            settings.flashMode = .auto
        }
        
        photoOutput.capturePhoto(with: settings, delegate: self)
    }
}

// MARK: - AVCapturePhotoCaptureDelegate

extension CameraManager: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error = error {
            print("Photo capture error: \(error.localizedDescription)")
            photoCompletionHandler?(nil)
            return
        }
        
        guard let photoData = photo.fileDataRepresentation(),
              let image = UIImage(data: photoData) else {
            print("Failed to convert photo data to UIImage")
            photoCompletionHandler?(nil)
            return
        }
        
        // Process and optimize the image
        let processedImage = processImage(image)
        photoCompletionHandler?(processedImage)
        photoCompletionHandler = nil
    }
    
    private func processImage(_ image: UIImage) -> UIImage {
        // Resize image for processing efficiency
        let targetSize = CGSize(width: 1024, height: 1024)
        let resizedImage = image.resized(to: targetSize)
        
        return resizedImage
    }
}

// MARK: - UIImage Extension

extension UIImage {
    func resized(to size: CGSize) -> UIImage {
        let renderer = UIGraphicsImageRenderer(size: size)
        return renderer.image { _ in
            self.draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
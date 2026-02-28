import SwiftUI
import AVFoundation

/// Camera preview view for displaying AVCaptureSession
struct CameraPreviewView: UIViewRepresentable {
    let session: AVCaptureSession
    
    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: UIScreen.main.bounds)
        view.backgroundColor = UIColor.black
        
        let previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer.frame = view.bounds
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        
        // Debug info
        print("📺 Created preview layer with session: \(session)")
        print("📺 Session inputs: \(session.inputs.count), outputs: \(session.outputs.count)")
        print("📺 Session running: \(session.isRunning)")
        
        return view
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {
        DispatchQueue.main.async {
            if let previewLayer = uiView.layer.sublayers?.first as? AVCaptureVideoPreviewLayer {
                previewLayer.frame = uiView.bounds
                
                // Ensure the layer is connected to our session
                if previewLayer.session !== session {
                    print("🔄 Reconnecting preview layer to session")
                    previewLayer.session = session
                }
            }
        }
    }
}

/// Simplified merchandising view showing "Coming Soon" banner
struct SimpleMerchandisingView: View {
    @Environment(\.dismiss) private var dismiss
    // @StateObject private var cameraManager = CameraManager()
    // @State private var isProcessing = false
    // @State private var detectionResult: ProductDetectionResult?
    // @State private var capturedImage: UIImage?
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background color
                Color(hex: "FFF0DB")
                    .ignoresSafeArea()
                
                VStack(spacing: 40) {
                    Spacer()
                    
                    // Icon
                    Image(systemName: "camera.viewfinder")
                        .font(.system(size: 100))
                        .foregroundColor(Color(hex: "FC9C0C"))
                    
                    // Coming Soon Text
                    VStack(spacing: 16) {
                        Text("Scanner Feature")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.black)
                        
                        Text("Coming Soon")
                            .font(.title2)
                            .fontWeight(.medium)
                            .foregroundColor(Color(hex: "FC9C0C"))
                        
                        Text("This feature is currently under development.")
                            .font(.body)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                    }
                    
                    Spacer()
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
        /* COMMENTED OUT: Camera functionality for future implementation
        .onAppear {
            print("🎬 SimpleMerchandisingView appeared - checking camera status")
            print("📷 Camera permission: \(cameraManager.hasPermission)")
            print("🎥 Session running: \(cameraManager.isSessionRunning)")
            
            // Give it a moment then try to start session
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                cameraManager.startSession()
            }
        }
        .onDisappear {
            print("👋 SimpleMerchandisingView disappeared - stopping camera")
            cameraManager.stopSession()
        }
        */
    }
    
}

/// Simple result structure for product detection
struct ProductDetectionResult {
    let name: String
    let brand: String
    let packSize: String
    let confidence: Float
}

#Preview {
    SimpleMerchandisingView()
}

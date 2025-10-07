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

/// Simplified merchandising view focused on single beer detection (PlantPal style)
struct SimpleMerchandisingView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var cameraManager = CameraManager()
    @State private var isProcessing = false
    @State private var detectionResult: BeerDetectionResult?
    @State private var capturedImage: UIImage?
    
    var body: some View {
        NavigationView {
            ZStack {
                // Camera preview background
                Color.black.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Header
                    HStack {
                        Button("Cancel") {
                            dismiss()
                        }
                        .foregroundColor(.white)
                        .padding()
                        
                        Spacer()
                        
                        Text("Beer Scanner")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        Spacer()
                        
                        // Debug info
                        HStack {
                            Button("🔧") {
                                print("🔧 DEBUG INFO:")
                                print("📷 Has Permission: \(cameraManager.hasPermission)")
                                print("🎥 Session Running: \(cameraManager.isSessionRunning)")
                                print("📱 Session inputs: \(cameraManager.session.inputs.count)")
                                print("📱 Session outputs: \(cameraManager.session.outputs.count)")
                                
                                // Just restart the session, don't reconfigure
                                if !cameraManager.isSessionRunning {
                                    print("🔄 Restarting camera session...")
                                    cameraManager.startSession()
                                } else {
                                    print("✅ Camera session is already running properly")
                                }
                            }
                            .foregroundColor(.white)
                            
                            Button("🧠") {
                                print("🧠 Generating REAL embeddings from beer images...")
                                Task {
                                    await generateRealEmbeddingsAndPrint()
                                }
                            }
                            .foregroundColor(.white)
                        }
                        .padding()
                    }
                    .background(Color.black.opacity(0.7))
                    
                    // Camera preview
                    ZStack {
                        CameraPreviewView(session: cameraManager.session)
                            .ignoresSafeArea()
                        
                        // Viewfinder overlay
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(Color.white, lineWidth: 2)
                            .frame(width: 280, height: 200)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    
                    // Bottom section with results
                    VStack(spacing: 16) {
                        if isProcessing {
                            VStack {
                                ProgressView()
                                    .scaleEffect(1.5)
                                    .tint(.white)
                                Text("Analyzing beer...")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .multilineTextAlignment(.center)
                            }
                            .frame(height: 100)
                        } else if let result = detectionResult {
                            // PlantPal-style detection result
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Beer Identified:")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(result.name)
                                            .font(.title2)
                                            .fontWeight(.bold)
                                            .foregroundColor(.white)
                                        
                                        Text(result.brand)
                                            .font(.subheadline)
                                            .foregroundColor(.gray)
                                        
                                        Text("\(Int(result.confidence))% confidence")
                                            .font(.subheadline)
                                            .foregroundColor(.green)
                                    }
                                    
                                    Spacer()
                                    
                                    // Confidence indicator
                                    VStack {
                                        Circle()
                                            .fill(result.confidence > 80 ? Color.green : 
                                                  result.confidence > 60 ? Color.orange : Color.red)
                                            .frame(width: 24, height: 24)
                                        
                                        Text(result.packSize)
                                            .font(.caption)
                                            .foregroundColor(.gray)
                                    }
                                }
                                .padding()
                                .background(Color.black.opacity(0.4))
                                .cornerRadius(12)
                            }
                            .frame(height: 120)
                        } else {
                            VStack {
                                Text("Point camera at a beer pack")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .multilineTextAlignment(.center)
                            }
                            .frame(height: 60)
                        }
                        
                        // Capture button
                        Button(action: captureAndAnalyze) {
                            ZStack {
                                Circle()
                                    .fill(Color.white)
                                    .frame(width: 70, height: 70)
                                
                                Circle()
                                    .stroke(Color.white, lineWidth: 4)
                                    .frame(width: 80, height: 80)
                            }
                        }
                        .disabled(isProcessing)
                        .opacity(isProcessing ? 0.5 : 1.0)
                    }
                    .padding()
                    .background(Color.black.opacity(0.8))
                }
            }
        }
        .navigationBarHidden(true)
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
    }
    
    /// Capture image and perform single beer identification (PlantPal style)
    private func captureAndAnalyze() {
        isProcessing = true
        detectionResult = nil
        
        cameraManager.capturePhoto { image in
            guard let image = image else { 
                isProcessing = false
                return 
            }
            Task {
                if let result = await performSingleBeerDetection(image) {
                    await MainActor.run {
                        self.detectionResult = result
                        self.capturedImage = image
                        self.isProcessing = false
                    }
                } else {
                    await MainActor.run {
                        self.detectionResult = nil
                        self.isProcessing = false
                    }
                }
            }
        }
    }
    
    /// Perform single beer detection (PlantPal style)
    private func performSingleBeerDetection(_ image: UIImage) async -> BeerDetectionResult? {
        // Generate embedding for the captured image
        guard let capturedEmbedding = await EmbeddingManager.shared.generateEmbedding(from: image) else {
            print("❌ Failed to generate embedding for captured image")
            return nil
        }
        
        print("✅ Generated embedding for captured image (\(capturedEmbedding.count) dimensions)")
        
        // Search for similar beer photos using pre-computed embeddings (PlantPal style)
        print("🔍 Searching for beer matches with embedding...")
        let searchResults = await BeerPhotoDatabaseManager.shared.searchSimilarBeerPhotos(
            queryEmbedding: capturedEmbedding,
            limit: 5 // Get top 5 matches for debugging
        )
        
        print("🔍 Search returned \(searchResults.count) results:")
        for (index, result) in searchResults.enumerated() {
            print("  \(index + 1). \(result.0.name) - \(String(format: "%.1f", result.1 * 100))%")
        }
        
        // Return the best match if confidence is reasonable (very permissive)
        if let bestMatch = searchResults.first,
           bestMatch.1 > 0.2 { // Minimum 20% confidence (very low threshold)
            return BeerDetectionResult(
                name: bestMatch.0.name,
                brand: bestMatch.0.brand,
                packSize: bestMatch.0.packSize,
                confidence: bestMatch.1 * 100
            )
        }
        
        return nil
    }
    
    /// Generate real embeddings and print JSON to console for copying
    func generateRealEmbeddingsAndPrint() async {
        let beerImages = [
            ("black-horizon-ale.png", "Black Horizon Ale", "Black Horizon", "6-pack"),
            ("aether-brew.png", "Aether Brew", "Aether", "4-pack"),
            ("hop-haven.png", "Hop Haven", "Haven", "6-pack"),
            ("neon-peak-brew.png", "Neon Peak Brew", "Neon Peak", "6-pack")
        ]
        
        print("🔄 Generating REAL embeddings...")
        var realEmbeddings: [[String: Any]] = []
        
        for (index, beerData) in beerImages.enumerated() {
            guard let image = UIImage(named: beerData.0) else {
                print("❌ Failed to load: \(beerData.0)")
                continue
            }
            
            guard let embedding = await EmbeddingManager.shared.generateEmbedding(from: image) else {
                print("❌ Failed to generate embedding for: \(beerData.0)")
                continue
            }
            
            print("✅ Generated \(embedding.count)D embedding for \(beerData.1)")
            
            let embeddingEntry: [String: Any] = [
                "beerId": "beer:\(index + 1)",
                "filename": beerData.0,
                "name": beerData.1,
                "brand": beerData.2,
                "packSize": beerData.3,
                "embedding": embedding,
                "imageDigest": "real_\(beerData.0)"
            ]
            
            realEmbeddings.append(embeddingEntry)
        }
        
        // Convert to JSON and SAVE to Documents directory
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: realEmbeddings, options: .prettyPrinted)
            
            // Save to Documents directory (writable location)
            guard let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else {
                print("❌ Could not access Documents directory")
                return
            }
            
            let fileURL = documentsPath.appendingPathComponent("beer_embeddings.json")
            try jsonData.write(to: fileURL)
            print("✅ REAL embeddings saved to Documents: \(fileURL.path)")
            print("🔄 Reloading BuildTimeBeerEmbeddingLoader with new embeddings...")
            
            // Force reload the embeddings immediately
            await BuildTimeBeerEmbeddingLoader.shared.loadEmbeddings()
            print("🎉 New real \(realEmbeddings.count) embeddings loaded!")
            
            if let firstEmbedding = realEmbeddings.first,
               let embeddingArray = firstEmbedding["embedding"] as? [Float] {
                print("🔢 Embedding dimensions: \(embeddingArray.count)")
                print("✅ Ready for scanning! Try scanning a beer pack now!")
            }
            
        } catch {
            print("❌ Failed to save embeddings: \(error)")
        }
    }
}

/// Simple result structure for single beer detection
struct BeerDetectionResult {
    let name: String
    let brand: String
    let packSize: String
    let confidence: Float
}

#Preview {
    SimpleMerchandisingView()
}

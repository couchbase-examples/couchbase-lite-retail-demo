//
//  ImageDownloadService.swift
//  LiquorApp
//
//  Image downloading service with caching support
//

import Foundation
import UIKit
import Combine

/// Service to download and cache images asynchronously
actor ImageDownloadService {
    
    static let shared = ImageDownloadService()
    
    // MARK: - Cache
    
    private let memoryCache = NSCache<NSString, UIImage>()
    private let fileManager = FileManager.default
    private let cacheDirectory: URL
    
    // MARK: - Download Queue
    
    private var ongoingDownloads: [String: Task<UIImage?, Error>] = [:]
    
    // MARK: - Initialization
    
    private init() {
        // Configure memory cache
        memoryCache.countLimit = 100 // Max 100 images in memory
        memoryCache.totalCostLimit = 50 * 1024 * 1024 // 50 MB
        
        // Setup disk cache directory
        let cachesDirectory = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first!
        cacheDirectory = cachesDirectory.appendingPathComponent("ImageCache", isDirectory: true)
        
        // Create cache directory if it doesn't exist
        try? fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
        
        print("📷 ImageDownloadService initialized with cache at: \(cacheDirectory.path)")
    }
    
    // MARK: - Public API
    
    /// Download an image from URL with caching
    /// - Parameter urlString: The URL string of the image
    /// - Returns: UIImage if successful, nil otherwise
    func downloadImage(from urlString: String) async -> UIImage? {
        let cacheKey = NSString(string: urlString)
        
        // 1. Check memory cache
        if let cachedImage = memoryCache.object(forKey: cacheKey) {
            print("📷 [Cache Hit - Memory] \(urlString)")
            return cachedImage
        }
        
        // 2. Check disk cache
        if let diskImage = loadFromDisk(urlString: urlString) {
            print("📷 [Cache Hit - Disk] \(urlString)")
            // Store in memory cache for faster access next time
            memoryCache.setObject(diskImage, forKey: cacheKey)
            return diskImage
        }
        
        // 3. Check if download is already in progress
        if let ongoingTask = ongoingDownloads[urlString] {
            print("📷 [Download In Progress] \(urlString)")
            return try? await ongoingTask.value
        }
        
        // 4. Download image
        print("📷 [Downloading] \(urlString)")
        
        let downloadTask = Task<UIImage?, Error> {
            guard let url = URL(string: urlString) else {
                print("❌ Invalid URL: \(urlString)")
                return nil
            }
            
            do {
                let (data, response) = try await URLSession.shared.data(from: url)
                
                // Verify response
                guard let httpResponse = response as? HTTPURLResponse,
                      (200...299).contains(httpResponse.statusCode) else {
                    print("❌ Invalid response for: \(urlString)")
                    return nil
                }
                
                // Create image
                guard let image = UIImage(data: data) else {
                    print("❌ Failed to create image from data: \(urlString)")
                    return nil
                }
                
                print("✅ Downloaded: \(urlString)")
                
                // Save to caches
                await saveToCaches(image: image, urlString: urlString)
                
                return image
                
            } catch {
                print("❌ Download error for \(urlString): \(error.localizedDescription)")
                return nil
            }
        }
        
        // Store ongoing task
        ongoingDownloads[urlString] = downloadTask
        
        // Wait for download and cleanup
        let image = try? await downloadTask.value
        ongoingDownloads.removeValue(forKey: urlString)
        
        return image
    }
    
    /// Preload multiple images in background
    /// - Parameter urls: Array of image URL strings
    func preloadImages(urls: [String]) async {
        for urlString in urls {
            _ = await downloadImage(from: urlString)
        }
    }
    
    /// Clear all caches (memory and disk)
    func clearCache() {
        memoryCache.removeAllObjects()
        try? fileManager.removeItem(at: cacheDirectory)
        try? fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
        print("🧹 Image cache cleared")
    }
    
    /// Get cache size in bytes
    func getCacheSize() -> Int64 {
        guard let enumerator = fileManager.enumerator(at: cacheDirectory, includingPropertiesForKeys: [.fileSizeKey]) else {
            return 0
        }
        
        var totalSize: Int64 = 0
        for case let fileURL as URL in enumerator {
            if let fileSize = try? fileURL.resourceValues(forKeys: [.fileSizeKey]).fileSize {
                totalSize += Int64(fileSize)
            }
        }
        return totalSize
    }
    
    // MARK: - Private Helpers
    
    private func saveToCaches(image: UIImage, urlString: String) {
        let cacheKey = NSString(string: urlString)
        
        // Save to memory cache
        memoryCache.setObject(image, forKey: cacheKey)
        
        // Save to disk cache
        saveToDisk(image: image, urlString: urlString)
    }
    
    private func saveToDisk(image: UIImage, urlString: String) {
        guard let data = image.jpegData(compressionQuality: 0.8) else { return }
        
        let filename = urlString.data(using: .utf8)!.base64EncodedString()
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "+", with: "-")
        
        let fileURL = cacheDirectory.appendingPathComponent(filename)
        
        do {
            try data.write(to: fileURL)
        } catch {
            print("❌ Failed to save image to disk: \(error)")
        }
    }
    
    private func loadFromDisk(urlString: String) -> UIImage? {
        let filename = urlString.data(using: .utf8)!.base64EncodedString()
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "+", with: "-")
        
        let fileURL = cacheDirectory.appendingPathComponent(filename)
        
        guard let data = try? Data(contentsOf: fileURL),
              let image = UIImage(data: data) else {
            return nil
        }
        
        return image
    }
}

// MARK: - SwiftUI AsyncImage Alternative

import SwiftUI

/// Custom AsyncImage view that uses our caching service
struct CachedAsyncImage: View {
    let url: String
    let placeholder: Image
    
    @State private var image: UIImage?
    @State private var isLoading = true
    
    init(url: String, placeholder: Image = Image(systemName: "photo")) {
        self.url = url
        self.placeholder = placeholder
    }
    
    var body: some View {
        Group {
            if let image = image {
                Image(uiImage: image)
                    .resizable()
            } else if isLoading {
                ZStack {
                    placeholder
                        .resizable()
                        .foregroundColor(.gray.opacity(0.3))
                    ProgressView()
                }
            } else {
                placeholder
                    .resizable()
                    .foregroundColor(.gray.opacity(0.3))
            }
        }
        .task {
            await loadImage()
        }
    }
    
    private func loadImage() async {
        isLoading = true
        image = await ImageDownloadService.shared.downloadImage(from: url)
        isLoading = false
    }
}


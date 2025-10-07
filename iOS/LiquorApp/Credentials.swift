import Foundation

class LiquorSyncCredentials {
    static func async(_ completion: @escaping (SecIdentity?, SecCertificate?) -> Void) {
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                let (identity, ca) = try loadCredentials()
                completion(identity, ca)
            } catch {
                print("[LiquorSync] Could not load credentials: \(error)")
                completion(nil, nil)
            }
        }
    }
    
    private static func loadCredentials() throws -> (SecIdentity, SecCertificate) {
        // Try to load identity
        guard let identityURL = Bundle.main.url(forResource: "client_identity", withExtension: "p12") else {
            throw CredentialsError.missingFile("client_identity.p12")
        }
        
        guard let identityData = try? Data(contentsOf: identityURL) else {
            throw CredentialsError.readError("client_identity.p12")
        }
        
        var result: CFArray?
        let options: [String: Any] = [kSecImportExportPassphrase as String: ""]
        let status = SecPKCS12Import(identityData as CFData, options as NSDictionary, &result)
        
        guard status == errSecSuccess else {
            throw CredentialsError.importError("Failed to import client identity: \(status)")
        }
        
        guard let items = result as? [[String: Any]],
              let item = items.first,
              let identityRef = item[kSecImportItemIdentity as String] else {
            throw CredentialsError.extractError("Could not extract identity from client_identity.p12")
        }
        
        let identity = identityRef as! SecIdentity
        
        // Try to load CA certificate
        guard let caURL = Bundle.main.url(forResource: "ca_cert", withExtension: "der") else {
            throw CredentialsError.missingFile("ca_cert.der")
        }
        
        guard let caData = try? Data(contentsOf: caURL) else {
            throw CredentialsError.readError("ca_cert.der")
        }
        
        guard let ca = SecCertificateCreateWithData(nil, caData as CFData) else {
            throw CredentialsError.extractError("Could not create certificate from ca_cert.der")
        }
        
        return (identity, ca)
    }
    
    enum CredentialsError: Error {
        case missingFile(String)
        case readError(String) 
        case importError(String)
        case extractError(String)
    }
} 
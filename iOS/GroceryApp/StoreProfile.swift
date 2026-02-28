import Foundation

struct StoreProfile: Identifiable, Codable {
    let id: String
    let docType: String
    let storeId: String
    let name: String
    let contact: Contact
    let location: Location
    let manager: String?
    let openingHours: String?
    
    struct Contact: Codable {
        let email: String
        let phone: String
    }
    
    struct Location: Codable {
        let address1: String
        let address2: String?
        let locality: String
        let region: String
        let postalCode: String
        let country: String
        let coordinates: Coordinates?
    }
    
    struct Coordinates: Codable {
        let lat: Double
        let lon: Double
    }
}


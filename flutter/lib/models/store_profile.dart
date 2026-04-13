class Coordinates {
  final double lat;
  final double lon;
  Coordinates({required this.lat, required this.lon});
}

class Location {
  final String address1;
  final String? address2;
  final String locality;
  final String region;
  final String postalCode;
  final String country;
  final Coordinates? coordinates;

  Location({
    required this.address1,
    this.address2,
    required this.locality,
    required this.region,
    required this.postalCode,
    required this.country,
    this.coordinates,
  });
}

class Contact {
  final String email;
  final String phone;
  Contact({required this.email, required this.phone});
}

class StoreProfile {
  final String id;
  final String docType;
  final String storeId;
  final String name;
  final Contact contact;
  final Location location;
  final String? managerName;
  final String? managerEmail;
  final String? openingHours;
  final Map<String, dynamic>? hours;

  StoreProfile({
    required this.id,
    this.docType = 'StoreProfile',
    required this.storeId,
    required this.name,
    required this.contact,
    required this.location,
    this.managerName,
    this.managerEmail,
    this.openingHours,
    this.hours,
  });

  factory StoreProfile.fromDocument(Map<String, dynamic> map, String docId) {
    final contactMap = map['contact'] as Map<String, dynamic>? ?? {};
    final locationMap = map['location'] as Map<String, dynamic>? ?? {};
    final coordsMap = locationMap['coordinates'] as Map<String, dynamic>?;

    // Manager can be a String or a Map
    String? managerName;
    String? managerEmail;
    final managerRaw = map['manager'];
    if (managerRaw is String) {
      managerName = managerRaw;
    } else if (managerRaw is Map) {
      managerName = managerRaw['name']?.toString();
      managerEmail = managerRaw['email']?.toString();
    }

    // Hours can be a String or a Map
    String? openingHours;
    Map<String, dynamic>? hours;
    final hoursRaw = map['openingHours'] ?? map['hours'];
    if (hoursRaw is String) {
      openingHours = hoursRaw;
    } else if (hoursRaw is Map) {
      hours = hoursRaw.cast<String, dynamic>();
    }

    return StoreProfile(
      id: docId,
      docType: map['docType'] as String? ?? 'StoreProfile',
      storeId: map['storeId'] as String? ?? '',
      name: map['name'] as String? ?? '',
      contact: Contact(
        email: contactMap['email'] as String? ?? '',
        phone: contactMap['phone'] as String? ?? '',
      ),
      location: Location(
        address1: locationMap['address1'] as String? ?? '',
        address2: locationMap['address2'] as String?,
        locality: locationMap['locality'] as String? ?? '',
        region: locationMap['region'] as String? ?? '',
        postalCode: locationMap['postalCode'] as String? ?? '',
        country: locationMap['country'] as String? ?? '',
        coordinates: coordsMap != null
            ? Coordinates(
                lat: (coordsMap['lat'] as num?)?.toDouble() ?? 0.0,
                lon: (coordsMap['lon'] as num?)?.toDouble() ?? 0.0,
              )
            : null,
      ),
      managerName: managerName,
      managerEmail: managerEmail,
      openingHours: openingHours,
      hours: hours,
    );
  }
}

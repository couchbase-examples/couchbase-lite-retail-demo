export interface StoreProfileCoordinates {
    lat: number;
    lon: number;
}

export interface StoreProfileLocation {
    address1: string;
    address2?: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    coordinates?: StoreProfileCoordinates;
}

export interface StoreProfileContact {
    email: string;
    phone?: string;
    name?: string;
    employeeId?: string;
}

export interface StoreProfile {
    id: string;
    docType: string;
    storeId: string;
    name: string;
    contact: StoreProfileContact;
    location: StoreProfileLocation;
    manager?: string;
    openingHours?: string;
}

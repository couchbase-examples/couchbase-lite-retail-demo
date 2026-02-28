package com.example.groceryapplication

data class StoreProfile(
    val id: String,
    val docType: String = "StoreProfile",
    val storeId: String,
    val name: String,
    val contact: Contact,
    val location: Location,
    val manager: String? = null,
    val openingHours: String? = null
) {
    data class Contact(
        val email: String,
        val phone: String
    )
    
    data class Location(
        val address1: String,
        val address2: String? = null,
        val locality: String,
        val region: String,
        val postalCode: String,
        val country: String,
        val coordinates: Coordinates? = null
    )
    
    data class Coordinates(
        val lat: Double,
        val lon: Double
    )
}


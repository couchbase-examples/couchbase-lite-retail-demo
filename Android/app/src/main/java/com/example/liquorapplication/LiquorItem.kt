package com.example.liquorapplication

data class LiquorItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val name: String,
    val type: String,
    val price: Double,
    val imageURL: String,
    var quantity: Int = 0
) 
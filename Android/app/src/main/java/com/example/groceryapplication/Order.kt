package com.example.groceryapplication

data class Order(
    val id: String,
    val docType: String = "Order",
    val orderId: Int,
    val storeId: String,
    val orderDate: Long,
    val orderStatus: String, // "In Review", "Approved", "Submitted" (legacy)
    val productId: Int,
    val sku: String,
    val unit: String,
    val orderQty: Int
)


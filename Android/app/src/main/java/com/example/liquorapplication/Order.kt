package com.example.liquorapplication

data class Order(
    val id: String,
    val docType: String = "Order",
    val orderId: Int,
    val storeId: String,
    val orderDate: Long,
    val orderStatus: String, // "Submitted", "Received"
    val productId: Int,
    val sku: String,
    val unit: String,
    val orderQty: Int
)


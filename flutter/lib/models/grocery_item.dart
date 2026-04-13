class GroceryItem {
  final String id;
  final String name;
  final String category; // stored as "category" in Capella
  final double price;
  final String imageURL;
  int quantity; // stored as "stockQty" in Capella
  final int? productId;
  final String? sku;
  final String? unit;

  GroceryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.imageURL,
    this.quantity = 0,
    this.productId,
    this.sku,
    this.unit,
  });

  static int _safeInt(dynamic value) {
    if (value is int) return value;
    if (value is num) return value.toInt();
    if (value is String) return int.tryParse(value) ?? 0;
    return 0;
  }

  factory GroceryItem.fromDocument(Map<String, dynamic> map, String docId) {
    // Handle quantity: try stockQty first, then CRDT quantity.value, then plain quantity
    int qty = 0;
    final stockQty = map['stockQty'];
    final quantityRaw = map['quantity'];
    if (stockQty != null) {
      qty = _safeInt(stockQty);
    } else if (quantityRaw is Map) {
      qty = _safeInt(quantityRaw['value']);
    } else if (quantityRaw != null) {
      qty = _safeInt(quantityRaw);
    }

    return GroceryItem(
      id: docId,
      name: map['name']?.toString() ?? '',
      category: map['category']?.toString() ?? '',
      price: (map['price'] is num) ? (map['price'] as num).toDouble() : 0.0,
      imageURL: map['imageURL']?.toString() ?? '',
      quantity: qty,
      productId: map['productId'] is num ? (map['productId'] as num).toInt() : null,
      sku: map['sku']?.toString(),
      unit: map['unit']?.toString(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'category': category,
      'price': price,
      'imageURL': imageURL,
      'stockQty': quantity,
      if (productId != null) 'productId': productId,
      if (sku != null) 'sku': sku,
      if (unit != null) 'unit': unit,
    };
  }
}

class Order {
  final String id;
  final String docType;
  final int orderId;
  final String storeId;
  final int orderDate; // timestamp millis
  final String orderStatus;
  final int productId;
  final String sku;
  final String unit;
  final int orderQty;

  Order({
    required this.id,
    this.docType = 'Order',
    required this.orderId,
    required this.storeId,
    required this.orderDate,
    required this.orderStatus,
    required this.productId,
    required this.sku,
    required this.unit,
    required this.orderQty,
  });

  static int _toInt(dynamic value) {
    if (value is int) return value;
    if (value is num) return value.toInt();
    if (value is String) return int.tryParse(value) ?? 0;
    return 0;
  }

  factory Order.fromDocument(Map<String, dynamic> map, String docId) {
    return Order(
      id: docId,
      docType: map['docType']?.toString() ?? 'Order',
      orderId: _toInt(map['orderId']),
      storeId: map['storeId']?.toString() ?? '',
      orderDate: _toInt(map['orderDate']),
      orderStatus: map['orderStatus']?.toString() ?? 'In Review',
      productId: _toInt(map['productId']),
      sku: map['sku']?.toString() ?? '',
      unit: map['unit']?.toString() ?? '',
      orderQty: _toInt(map['orderQty']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'docType': docType,
      'orderId': orderId,
      'storeId': storeId,
      'orderDate': orderDate,
      'orderStatus': orderStatus,
      'productId': productId,
      'sku': sku,
      'unit': unit,
      'orderQty': orderQty,
    };
  }
}

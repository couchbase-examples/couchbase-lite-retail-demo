import 'package:flutter/material.dart';
import '../config/app_config.dart';
import '../models/grocery_item.dart';
import '../services/database_manager.dart';
import '../theme/app_theme.dart';

class OrderFormDialog extends StatefulWidget {
  final GroceryItem item;

  const OrderFormDialog({super.key, required this.item});

  @override
  State<OrderFormDialog> createState() => _OrderFormDialogState();
}

class _OrderFormDialogState extends State<OrderFormDialog> {
  final _quantityController = TextEditingController(text: '100');
  bool _isCreating = false;

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  Future<void> _createOrder() async {
    final qty = int.tryParse(_quantityController.text);
    if (qty == null || qty <= 0) return;

    setState(() => _isCreating = true);

    await DatabaseManager().createOrder(widget.item, qty);

    if (mounted) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Order created successfully'),
          backgroundColor: AppTheme.successGreen,
        ),
      );
    }
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(label,
                style: const TextStyle(
                    color: AppTheme.textSecondary, fontSize: 14)),
          ),
          Expanded(
            child: Text(value,
                style: const TextStyle(
                    fontWeight: FontWeight.w500, fontSize: 14)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Create Order'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _infoRow('Product', widget.item.name),
            _infoRow('Product ID', '${widget.item.productId ?? "N/A"}'),
            _infoRow('SKU', widget.item.sku ?? 'N/A'),
            _infoRow('Store ID', AppConfig.storeId),
            _infoRow('Unit', widget.item.unit ?? 'each'),
            _infoRow('Status', 'In Review'),
            const SizedBox(height: 16),
            TextField(
              controller: _quantityController,
              decoration: InputDecoration(
                labelText: 'Order Quantity',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _isCreating ? null : _createOrder,
          child: _isCreating
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Create Order'),
        ),
      ],
    );
  }
}

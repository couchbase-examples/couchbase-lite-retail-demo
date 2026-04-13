import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../models/grocery_item.dart';
import '../theme/app_theme.dart';
import 'order_form_dialog.dart';

class GroceryItemCard extends StatelessWidget {
  final GroceryItem item;
  final Function(int) onQuantityChanged;

  const GroceryItemCard({
    super.key,
    required this.item,
    required this.onQuantityChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Product Image
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 4),
            child: SizedBox(
              height: 100,
              width: double.infinity,
              child: item.imageURL.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: item.imageURL,
                      fit: BoxFit.contain,
                      placeholder: (_, __) => const Center(
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppTheme.primaryOrange,
                        ),
                      ),
                      errorWidget: (_, __, ___) => Icon(
                        Icons.image_not_supported_outlined,
                        size: 40,
                        color: Colors.grey[300],
                      ),
                    )
                  : Icon(Icons.shopping_bag_outlined, size: 40, color: Colors.grey[300]),
            ),
          ),
          // Product info
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Column(
                children: [
                  // Name
                  Text(
                    item.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: AppTheme.textPrimary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 2),
                  // Price
                  Text(
                    'Price: \$${item.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 6),
                  // Inventory Count label
                  const Text(
                    'Inventory Count',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  // Large green quantity number
                  Text(
                    '${item.quantity}',
                    style: const TextStyle(
                      fontSize: 42,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.inventoryGreen,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 4),
                  // +/- buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _CircleIconButton(
                        icon: Icons.remove,
                        onPressed: item.quantity > 0
                            ? () => onQuantityChanged(item.quantity - 1)
                            : null,
                      ),
                      const SizedBox(width: 20),
                      _CircleIconButton(
                        icon: Icons.add,
                        onPressed: () => onQuantityChanged(item.quantity + 1),
                      ),
                    ],
                  ),
                  const Spacer(),
                  // Re-order button
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: SizedBox(
                      width: double.infinity,
                      height: 36,
                      child: ElevatedButton(
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (_) => OrderFormDialog(item: item),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryOrange,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          padding: EdgeInsets.zero,
                        ),
                        child: const Text(
                          'Re-order now',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CircleIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;

  const _CircleIconButton({required this.icon, this.onPressed});

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null;
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: enabled ? Colors.grey.shade400 : Colors.grey.shade300,
            width: 1.5,
          ),
        ),
        child: Icon(
          icon,
          size: 18,
          color: enabled ? Colors.grey.shade500 : Colors.grey.shade300,
        ),
      ),
    );
  }
}

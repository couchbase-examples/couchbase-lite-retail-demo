import 'package:flutter_test/flutter_test.dart';
import 'package:grocery_app/main.dart';

void main() {
  testWidgets('App starts with splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const GroceryApp());
    expect(find.byType(GroceryApp), findsOneWidget);
  });
}

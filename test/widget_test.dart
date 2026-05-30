import 'package:flutter_test/flutter_test.dart';
import 'package:tarteb/app.dart';

void main() {
  testWidgets('App shows Tarteb branding', (WidgetTester tester) async {
    await tester.pumpWidget(const TartebApp());
    await tester.pump();
    expect(find.text('Tarteb'), findsWidgets);
  });
}

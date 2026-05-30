import 'package:fake_async/fake_async.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/app.dart';
import 'package:tarteb/core/constants/app_constants.dart';

void main() {
  setUpAll(() async {
    TestWidgetsFlutterBinding.ensureInitialized();
    SharedPreferences.setMockInitialValues({});
    await Supabase.initialize(
      url: 'https://example.supabase.co',
      anonKey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.test',
      authOptions: const FlutterAuthClientOptions(
        localStorage: EmptyLocalStorage(),
      ),
    );
  });

  testWidgets('splash screen navigates after delay', (WidgetTester tester) async {
    await tester.pumpWidget(const TartebApp());
    await tester.pump();
    expect(find.text('Tarteb'), findsWidgets);

    fakeAsync((async) {
      async.elapse(const Duration(seconds: 3));
    });
    await tester.pump(
      AppConstants.splashDuration + const Duration(seconds: 1),
    );
    await tester.pump();

    expect(find.text('Welcome to Tarteb'), findsOneWidget);
  });
}

import 'package:flutter/material.dart';
import 'package:tarteb/app.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/network/connectivity_service.dart';
import 'package:tarteb/core/notifications/notification_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/core/theme/theme_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await LocaleService.instance.init();
  await ThemeService.instance.init();
  await NotificationService.instance.init();
  await ConnectivityService.instance.init();
  await TartebSupabase.initialize();
  runApp(const TartebApp());
}

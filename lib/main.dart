import 'package:flutter/material.dart';
import 'package:tarteb/app.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/network/connectivity_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await LocaleService.instance.init();
  await ConnectivityService.instance.init();
  await TartebSupabase.initialize();
  runApp(const TartebApp());
}

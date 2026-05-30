import 'package:flutter/material.dart';
import 'package:tarteb/app.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await TartebSupabase.initialize();
  runApp(const TartebApp());
}

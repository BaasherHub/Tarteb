import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_theme.dart';
import 'package:tarteb/features/auth/screens/splash_screen.dart';
import 'package:tarteb/features/shared/widgets/connectivity_banner.dart';

class TartebApp extends StatelessWidget {
  const TartebApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        final locale = LocaleService.instance.locale;
        return MaterialApp(
          title: AppStrings.appName,
          debugShowCheckedModeBanner: false,
          locale: locale,
          supportedLocales: const [
            Locale('en'),
            Locale('ar'),
          ],
          localizationsDelegates: const [
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          theme: AppTheme.light(),
          builder: (context, child) {
            final textDirection = LocaleService.instance.isArabic
                ? TextDirection.rtl
                : TextDirection.ltr;
            return Directionality(
              textDirection: textDirection,
              child: ConnectivityBanner(
                child: child ?? const SizedBox.shrink(),
              ),
            );
          },
          home: const SplashScreen(),
        );
      },
    );
  }
}

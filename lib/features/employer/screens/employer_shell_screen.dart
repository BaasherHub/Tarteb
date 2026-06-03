import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/features/employer/screens/browse_screen.dart';
import 'package:tarteb/features/employer/screens/favorites_screen.dart';
import 'package:tarteb/features/employer/screens/my_unlocks_screen.dart';
import 'package:tarteb/features/employer/services/favorites_service.dart';

class EmployerShellScreen extends StatefulWidget {
  const EmployerShellScreen({super.key});

  @override
  State<EmployerShellScreen> createState() => _EmployerShellScreenState();
}

class _EmployerShellScreenState extends State<EmployerShellScreen> {
  int _tabIndex = 0;
  final _browseKey = GlobalKey<BrowseScreenState>();

  @override
  void initState() {
    super.initState();
    // Load favorites cache on init
    FavoritesService.instance.ensureLoaded();
  }

  void _goToBrowse() => setState(() => _tabIndex = 0);

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          body: IndexedStack(
            index: _tabIndex,
            children: [
              BrowseScreen(key: _browseKey),
              FavoritesScreen(onBrowseTap: _goToBrowse),
              MyUnlocksScreen(onBrowseTap: _goToBrowse),
            ],
          ),
          bottomNavigationBar: NavigationBar(
            selectedIndex: _tabIndex,
            onDestinationSelected: (index) => setState(() => _tabIndex = index),
            destinations: [
              NavigationDestination(
                icon: const Icon(Icons.search),
                label: AppStrings.browse,
              ),
              NavigationDestination(
                icon: const Icon(Icons.favorite_border),
                selectedIcon: const Icon(Icons.favorite),
                label: AppStrings.favorites,
              ),
              NavigationDestination(
                icon: const Icon(Icons.bookmark_outline),
                selectedIcon: const Icon(Icons.bookmark),
                label: AppStrings.myUnlocks,
              ),
            ],
          ),
        );
      },
    );
  }
}

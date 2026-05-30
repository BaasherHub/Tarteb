import 'package:flutter/material.dart';
import 'package:tarteb/features/employer/screens/browse_screen.dart';
import 'package:tarteb/features/employer/screens/my_unlocks_screen.dart';

/// Employer home with bottom navigation: Browse + My Unlocks.
class EmployerShellScreen extends StatefulWidget {
  const EmployerShellScreen({super.key});

  @override
  State<EmployerShellScreen> createState() => _EmployerShellScreenState();
}

class _EmployerShellScreenState extends State<EmployerShellScreen> {
  int _tabIndex = 0;
  final _browseKey = GlobalKey<BrowseScreenState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _tabIndex,
        children: [
          BrowseScreen(key: _browseKey),
          const MyUnlocksScreen(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tabIndex,
        onDestinationSelected: (index) => setState(() => _tabIndex = index),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.search),
            label: 'Browse',
          ),
          NavigationDestination(
            icon: Icon(Icons.bookmark_outline),
            selectedIcon: Icon(Icons.bookmark),
            label: 'My Unlocks',
          ),
        ],
      ),
    );
  }
}

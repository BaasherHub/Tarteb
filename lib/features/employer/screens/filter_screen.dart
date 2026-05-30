import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';

class FilterScreen extends StatefulWidget {
  const FilterScreen({
    super.key,
    this.initialRole,
    this.initialLocation,
  });

  final String? initialRole;
  final String? initialLocation;

  @override
  State<FilterScreen> createState() => _FilterScreenState();
}

class _FilterScreenState extends State<FilterScreen> {
  String? _role;
  String? _location;

  @override
  void initState() {
    super.initState();
    _role = widget.initialRole;
    _location = widget.initialLocation;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Filters'),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _role = null;
                _location = null;
              });
            },
            child: const Text('Clear'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Job role', style: TextStyle(fontWeight: FontWeight.w600)),
          ...AppStrings.candidateRoles.map(
            (r) => RadioListTile<String>(
              title: Text(r),
              value: r,
              groupValue: _role,
              onChanged: (v) => setState(() => _role = v),
            ),
          ),
          const Divider(),
          const Text('Location', style: TextStyle(fontWeight: FontWeight.w600)),
          ...AppStrings.locations.map(
            (l) => RadioListTile<String>(
              title: Text(l),
              value: l,
              groupValue: _location,
              onChanged: (v) => setState(() => _location = v),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: FilledButton(
            onPressed: () {
              Navigator.of(context).pop({
                'role': _role,
                'location': _location,
              });
            },
            child: const Text('Apply filters'),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/employer/screens/browse_screen.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class EmployerOnboardingScreen extends StatefulWidget {
  const EmployerOnboardingScreen({super.key});

  @override
  State<EmployerOnboardingScreen> createState() =>
      _EmployerOnboardingScreenState();
}

class _EmployerOnboardingScreenState extends State<EmployerOnboardingScreen> {
  final _companyController = TextEditingController();
  final _contactController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  String? _location;
  bool _loading = false;

  @override
  void dispose() {
    _companyController.dispose();
    _contactController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      final userId = TartebSupabase.auth.currentUser!.id;
      await TartebSupabase.client.from('employers').upsert({
        'user_id': userId,
        'company_name': _companyController.text.trim(),
        'contact_name': _contactController.text.trim(),
        'phone': _phoneController.text.trim(),
        'email': _emailController.text.trim(),
        'location': _location!,
      });

      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(builder: (_) => const BrowseScreen()),
        (_) => false,
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: LoadingWidget());

    return Scaffold(
      appBar: AppBar(title: const Text('Company details')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          TextField(
            controller: _companyController,
            decoration: const InputDecoration(labelText: 'Company name'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _contactController,
            decoration: const InputDecoration(labelText: 'Contact name'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _phoneController,
            decoration: const InputDecoration(labelText: 'Phone'),
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _emailController,
            decoration: const InputDecoration(labelText: 'Email'),
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 16),
          const Text('Location'),
          ...AppStrings.locations.map(
            (loc) => RadioListTile<String>(
              title: Text(loc),
              value: loc,
              groupValue: _location,
              onChanged: (v) => setState(() => _location = v),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: _location == null ||
                    _companyController.text.trim().isEmpty
                ? null
                : _submit,
            child: const Text('Start browsing'),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/candidate/screens/candidate_dashboard_screen.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class Step5AvailabilityScreen extends StatefulWidget {
  const Step5AvailabilityScreen({
    super.key,
    required this.jobRole,
    required this.visaStatus,
    required this.nationality,
    required this.salaryExpectation,
    required this.location,
  });

  final String jobRole;
  final String visaStatus;
  final String nationality;
  final int salaryExpectation;
  final String location;

  @override
  State<Step5AvailabilityScreen> createState() => _Step5AvailabilityScreenState();
}

class _Step5AvailabilityScreenState extends State<Step5AvailabilityScreen> {
  DateTime? _availableFrom;
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _whatsappController = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _whatsappController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      final userId = TartebSupabase.auth.currentUser!.id;
      await TartebSupabase.client.from('candidates').upsert({
        'user_id': userId,
        'name': _nameController.text.trim(),
        'role': widget.jobRole,
        'visa_status': widget.visaStatus,
        'nationality': widget.nationality,
        'salary_expectation': widget.salaryExpectation,
        'available_from': _availableFrom!.toIso8601String().split('T').first,
        'location': widget.location,
        'phone': _phoneController.text.trim(),
        'whatsapp': _whatsappController.text.trim(),
        'is_active': true,
      });

      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(builder: (_) => const CandidateDashboardScreen()),
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
      appBar: AppBar(title: const Text('Step 5 of 5 — Availability')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Full name'),
            ),
            const SizedBox(height: 12),
            ListTile(
              title: Text(
                _availableFrom == null
                    ? 'Available from'
                    : 'Available from: ${_availableFrom!.toLocal().toString().split(' ').first}',
              ),
              trailing: const Icon(Icons.calendar_today),
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 365)),
                  initialDate: DateTime.now(),
                );
                if (date != null) setState(() => _availableFrom = date);
              },
            ),
            TextField(
              controller: _phoneController,
              decoration: const InputDecoration(labelText: 'Phone'),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _whatsappController,
              decoration: const InputDecoration(labelText: 'WhatsApp'),
              keyboardType: TextInputType.phone,
            ),
            const Spacer(),
            FilledButton(
              onPressed: _availableFrom == null ||
                      _nameController.text.trim().isEmpty
                  ? null
                  : _submit,
              child: const Text('Complete profile'),
            ),
          ],
        ),
      ),
    );
  }
}

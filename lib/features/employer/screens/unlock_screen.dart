import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class UnlockScreen extends StatefulWidget {
  const UnlockScreen({super.key, required this.candidate});

  final Map<String, dynamic> candidate;

  @override
  State<UnlockScreen> createState() => _UnlockScreenState();
}

class _UnlockScreenState extends State<UnlockScreen> {
  bool _loading = false;
  Map<String, dynamic>? _unlocked;

  bool get _alreadyUnlocked => widget.candidate['phone'] != null;

  Future<void> _unlock() async {
    setState(() => _loading = true);
    try {
      final result = await TartebSupabase.client.rpc(
        'unlock_candidate',
        params: {'p_candidate_id': widget.candidate['id']},
      );
      final candidateId = widget.candidate['id'] as String;
      final detail = await TartebSupabase.client
          .from('candidate_browse')
          .select()
          .eq('id', candidateId)
          .single();
      setState(() {
        _unlocked = detail;
      });
      if (result != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Contact unlocked')),
        );
      }
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
    final c = _unlocked ?? widget.candidate;
    final phone = c['phone'] as String?;
    final whatsapp = c['whatsapp'] as String?;

    if (_loading) return const Scaffold(body: LoadingWidget());

    return Scaffold(
      appBar: AppBar(title: Text(c['name'] as String? ?? 'Candidate')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('${c['role']} · ${c['location']}'),
            Text('AED ${c['salary_expectation']} / month'),
            const SizedBox(height: 24),
            if (phone != null || _alreadyUnlocked) ...[
              ListTile(
                leading: const Icon(Icons.phone),
                title: Text(phone ?? '—'),
              ),
              ListTile(
                leading: const Icon(Icons.chat),
                title: Text(whatsapp ?? '—'),
              ),
            ] else ...[
              Text(
                'Unlock contact details for AED ${AppStrings.unlockCostAed}. '
                'Uses 1 credit from your balance.',
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: _unlock,
                child: const Text('Unlock (1 credit)'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

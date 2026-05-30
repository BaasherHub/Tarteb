import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/employer/services/unlock_flow_service.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';
import 'package:url_launcher/url_launcher.dart';

/// Full-screen candidate detail; unlock uses [UnlockFlowService] bottom sheets.
class UnlockScreen extends StatefulWidget {
  const UnlockScreen({
    super.key,
    required this.candidate,
    this.onUnlocked,
    this.onCreditsChanged,
  });

  final Map<String, dynamic> candidate;
  final VoidCallback? onUnlocked;
  final VoidCallback? onCreditsChanged;

  @override
  State<UnlockScreen> createState() => _UnlockScreenState();
}

class _UnlockScreenState extends State<UnlockScreen> {
  late Map<String, dynamic> _candidate;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _candidate = Map<String, dynamic>.from(widget.candidate);
  }

  bool get _isUnlocked => _candidate['phone'] != null;

  Future<void> _refreshCandidate() async {
    final id = _candidate['id'] as String;
    final detail = await TartebSupabase.client
        .from('candidate_browse')
        .select()
        .eq('id', id)
        .single();
    setState(() => _candidate = detail);
  }

  Future<void> _unlock() async {
    setState(() => _loading = true);
    final ok = await UnlockFlowService.handleUnlockTap(
      context,
      candidate: _candidate,
      onUnlocked: () {
        widget.onUnlocked?.call();
        _refreshCandidate();
      },
      onCreditsChanged: () => widget.onCreditsChanged?.call(),
    );
    if (ok && mounted) {
      await _refreshCandidate();
      Navigator.of(context).pop(true);
    }
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _launchUri(String uri) async {
    final parsed = Uri.parse(uri);
    if (await canLaunchUrl(parsed)) {
      await launchUrl(parsed, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: LoadingWidget());

    final name = _candidate['name'] as String? ?? 'Candidate';
    final phone = _candidate['phone'] as String?;
    final whatsapp = _candidate['whatsapp'] as String?;

    return Scaffold(
      appBar: AppBar(title: Text(name)),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('${_candidate['role']} · ${_candidate['location']}'),
            Text('AED ${_candidate['salary_expectation']} / month'),
            const SizedBox(height: 24),
            if (_isUnlocked) ...[
              ListTile(
                leading: const Icon(Icons.phone),
                title: Text(phone ?? '—'),
                onTap: phone != null ? () => _launchUri('tel:$phone') : null,
              ),
              ListTile(
                leading: const Icon(Icons.chat),
                title: Text(whatsapp ?? '—'),
                onTap: whatsapp != null && whatsapp.isNotEmpty
                    ? () => _launchUri(
                          'https://wa.me/${whatsapp.replaceAll(RegExp(r'\D'), '')}',
                        )
                    : null,
              ),
            ] else ...[
              Text(
                'Unlock contact details for AED ${AppStrings.unlockCostAed}. '
                'Uses 1 credit from your balance.',
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: _unlock,
                child: const Text('Unlock for AED 50'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

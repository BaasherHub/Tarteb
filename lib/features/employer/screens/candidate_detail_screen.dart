import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/core/widgets/tarteb_primary_button.dart';
import 'package:tarteb/core/widgets/tarteb_snackbar.dart';
import 'package:tarteb/features/candidate/widgets/candidate_confidence_details.dart';
import 'package:tarteb/features/employer/screens/candidate_card_widget.dart';
import 'package:tarteb/features/employer/services/unlock_flow_service.dart';
import 'package:tarteb/features/employer/widgets/visa_badge.dart';
import 'package:url_launcher/url_launcher.dart';

class CandidateDetailScreen extends StatefulWidget {
  const CandidateDetailScreen({
    super.key,
    required this.candidate,
    this.onUnlocked,
    this.onCreditsChanged,
  });

  final Map<String, dynamic> candidate;
  final VoidCallback? onUnlocked;
  final VoidCallback? onCreditsChanged;

  @override
  State<CandidateDetailScreen> createState() => _CandidateDetailScreenState();
}

class _CandidateDetailScreenState extends State<CandidateDetailScreen> {
  late Map<String, dynamic> _candidate;

  @override
  void initState() {
    super.initState();
    _candidate = Map<String, dynamic>.from(widget.candidate);
  }

  bool get _isUnlocked => _candidate['phone'] != null;

  Future<void> _launchUri(String uri) async {
    final parsed = Uri.parse(uri);
    if (await canLaunchUrl(parsed)) {
      await launchUrl(parsed, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _unlock() async {
    final ok = await UnlockFlowService.handleUnlockTap(
      context,
      candidate: _candidate,
      onUnlocked: () {
        widget.onUnlocked?.call();
        if (mounted) {
          TartebSnackbar.showSuccess(context, AppStrings.contactUnlocked);
        }
      },
      onCreditsChanged: () => widget.onCreditsChanged?.call(),
    );
    if (ok && mounted) {
      setState(() {
        // Parent will refresh list; detail may need re-fetch — pop for refresh
      });
      Navigator.of(context).pop(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final name = _candidate['name'] as String? ?? '';
    final role = _candidate['role'] as String? ?? '';
    final visa = _candidate['visa_status'] as String? ?? '';
    final location = _candidate['location'] as String? ?? '';
    final nationality = _candidate['nationality'] as String? ?? '';
    final salary = _candidate['salary_expectation'];
    final photoUrl = _candidate['photo_url'] as String?;
    final phone = _candidate['phone'] as String?;
    final whatsapp = _candidate['whatsapp'] as String?;

    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: Text(CandidateCardWidget.firstName(name)),
          ),
          body: Column(
            children: [
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  children: [
                    Center(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: SizedBox(
                          width: 160,
                          height: 160,
                          child: photoUrl != null
                              ? Image.network(
                                  photoUrl,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, _, _) =>
                                      _photoPlaceholder(),
                                )
                              : _photoPlaceholder(),
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    Text(
                      name,
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      role,
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 12),
                    Center(child: VisaBadge(visaStatus: visa)),
                    const SizedBox(height: AppSpacing.lg),
                    _InfoRow(
                      icon: Icons.location_on_outlined,
                      label: AppStrings.location,
                      value: location,
                    ),
                    if (nationality.isNotEmpty)
                      _InfoRow(
                        icon: Icons.flag_outlined,
                        label: AppStrings.nationality,
                        value: nationality,
                      ),
                    if (salary != null)
                      _InfoRow(
                        icon: Icons.payments_outlined,
                        label: AppStrings.monthlySalaryAed,
                        value: 'AED $salary',
                      ),
                    _InfoRow(
                      icon: Icons.event_outlined,
                      label: AppStrings.availableFrom,
                      value: CandidateCardWidget.formatAvailableFrom(
                        _candidate['available_from'],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    CandidateConfidenceDetails(
                      candidate: _candidate,
                      compact: false,
                    ),
                  ],
                ),
              ),
              SafeArea(
                top: false,
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: _isUnlocked
                      ? Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: phone != null
                                    ? () => _launchUri('tel:$phone')
                                    : null,
                                icon: const Icon(Icons.phone),
                                label: const Text('Call'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: FilledButton.icon(
                                onPressed: whatsapp != null &&
                                        whatsapp.isNotEmpty
                                    ? () => _launchUri(
                                          'https://wa.me/${whatsapp.replaceAll(RegExp(r'\D'), '')}',
                                        )
                                    : null,
                                icon: const Icon(Icons.chat),
                                label: const Text('WhatsApp'),
                                style: FilledButton.styleFrom(
                                  backgroundColor: AppColors.secondary,
                                ),
                              ),
                            ),
                          ],
                        )
                      : TartebPrimaryButton(
                          label: AppStrings.unlockForAed50,
                          onPressed: _unlock,
                        ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _photoPlaceholder() {
    return ColoredBox(
      color: AppColors.primary.withValues(alpha: 0.08),
      child: const Icon(Icons.person, size: 80, color: AppColors.primary),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: AppColors.textSecondary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                ),
                Text(value, style: Theme.of(context).textTheme.bodyLarge),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

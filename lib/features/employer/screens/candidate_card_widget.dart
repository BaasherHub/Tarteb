import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/employer/services/unlock_flow_service.dart';
import 'package:tarteb/features/candidate/widgets/candidate_confidence_details.dart';
import 'package:tarteb/features/employer/widgets/visa_badge.dart';
import 'package:url_launcher/url_launcher.dart';

class CandidateCardWidget extends StatelessWidget {
  const CandidateCardWidget({
    super.key,
    required this.candidate,
    this.onUnlocked,
    this.onCreditsChanged,
  });

  final Map<String, dynamic> candidate;
  final VoidCallback? onUnlocked;
  final VoidCallback? onCreditsChanged;

  static String firstName(String? fullName) {
    if (fullName == null || fullName.isEmpty) return 'Unknown';
    final parts = fullName.trim().split(RegExp(r'\s+'));
    return parts.first;
  }

  static String formatAvailableFrom(dynamic value) {
    if (value == null) return '—';
    final str = value.toString();
    final date = DateTime.tryParse(str);
    if (date == null) return str;
    return '${date.day}/${date.month}/${date.year}';
  }

  Future<void> _openUnlock(BuildContext context) async {
    await UnlockFlowService.handleUnlockTap(
      context,
      candidate: candidate,
      onUnlocked: () => onUnlocked?.call(),
      onCreditsChanged: () => onCreditsChanged?.call(),
    );
  }

  Future<void> _launchUri(String uri) async {
    final parsed = Uri.parse(uri);
    if (await canLaunchUrl(parsed)) {
      await launchUrl(parsed);
    }
  }

  @override
  Widget build(BuildContext context) {
    final fullName = candidate['name'] as String?;
    final first = firstName(fullName);
    final role = candidate['role'] as String? ?? '';
    final visa = candidate['visa_status'] as String? ?? '';
    final location = candidate['location'] as String? ?? '';
    final salary = candidate['salary_expectation'];
    final photoUrl = candidate['photo_url'] as String?;
    final phone = candidate['phone'] as String?;
    final whatsapp = candidate['whatsapp'] as String?;
    final isUnlocked = phone != null;

    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AspectRatio(
            aspectRatio: 1,
            child: photoUrl != null
                ? Image.network(
                    photoUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => _photoPlaceholder(),
                  )
                : _photoPlaceholder(),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  first,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  role,
                  style: Theme.of(context).textTheme.bodyMedium,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                VisaBadge(visaStatus: visa),
                const SizedBox(height: 8),
                CandidateConfidenceDetails(
                  candidate: candidate,
                  compact: true,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 14),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        location,
                        style: Theme.of(context).textTheme.bodySmall,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                if (salary != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    'AED $salary/month',
                    style: const TextStyle(fontWeight: FontWeight.w500),
                  ),
                ],
                const SizedBox(height: 4),
                Text(
                  '${AppStrings.availableFrom} ${formatAvailableFrom(candidate['available_from'])}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 12),
                _ContactSection(
                  isUnlocked: isUnlocked,
                  phone: phone,
                  whatsapp: whatsapp,
                  onLaunch: _launchUri,
                ),
                if (!isUnlocked) ...[
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: () => _openUnlock(context),
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      child: Text(
                        AppStrings.unlockForAed50,
                        style: const TextStyle(fontSize: 13),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _photoPlaceholder() {
    return Container(
      color: AppColors.primary.withValues(alpha: 0.08),
      child: const Center(
        child: Icon(Icons.person, size: 64, color: AppColors.primary),
      ),
    );
  }
}

class _ContactSection extends StatelessWidget {
  const _ContactSection({
    required this.isUnlocked,
    required this.phone,
    required this.whatsapp,
    required this.onLaunch,
  });

  final bool isUnlocked;
  final String? phone;
  final String? whatsapp;
  final Future<void> Function(String uri) onLaunch;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
            child: isUnlocked
                ? Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: phone != null
                              ? () => onLaunch('tel:$phone')
                              : null,
                          icon: const Icon(Icons.phone, size: 18),
                          label: const Text('Call', style: TextStyle(fontSize: 12)),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: whatsapp != null && whatsapp!.isNotEmpty
                              ? () => onLaunch(
                                    'https://wa.me/${whatsapp!.replaceAll(RegExp(r'\D'), '')}',
                                  )
                              : null,
                          icon: const Icon(Icons.chat, size: 18),
                          label: const Text('WA', style: TextStyle(fontSize: 12)),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                          ),
                        ),
                      ),
                    ],
                  )
                : const SizedBox(
                    height: 40,
                    child: Center(
                      child: Text(
                        '+971 ••• ••• ••••',
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    ),
                  ),
          ),
          if (!isUnlocked)
            Positioned.fill(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 6, sigmaY: 6),
                child: Container(
                  color: Colors.white.withValues(alpha: 0.45),
                  alignment: Alignment.center,
                  child: const Icon(
                    Icons.lock_outline,
                    color: AppColors.textSecondary,
                    size: 28,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

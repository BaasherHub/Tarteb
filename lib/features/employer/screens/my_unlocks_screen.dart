import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/core/utils/error_message.dart';
import 'package:tarteb/features/employer/widgets/visa_badge.dart';
import 'package:tarteb/features/shared/widgets/empty_state_widget.dart';
import 'package:tarteb/features/shared/widgets/error_widget.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';
import 'package:url_launcher/url_launcher.dart';

class MyUnlocksScreen extends StatefulWidget {
  const MyUnlocksScreen({super.key, this.onBrowseTap});

  final VoidCallback? onBrowseTap;

  @override
  State<MyUnlocksScreen> createState() => _MyUnlocksScreenState();
}

class _MyUnlocksScreenState extends State<MyUnlocksScreen> {
  List<Map<String, dynamic>> _unlocks = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await TartebSupabase.client
          .from('unlocks')
          .select(
            'id, unlocked_at, amount_paid, '
            'candidates(id, name, role, visa_status, photo_url, phone, whatsapp)',
          )
          .order('unlocked_at', ascending: false);

      setState(() => _unlocks = List<Map<String, dynamic>>.from(data));
    } catch (e) {
      setState(() => _error = ErrorMessage.from(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _launchUri(String uri) async {
    final parsed = Uri.parse(uri);
    if (await canLaunchUrl(parsed)) {
      await launchUrl(parsed, mode: LaunchMode.externalApplication);
    }
  }

  static String _formatUnlockedDate(dynamic value) {
    if (value == null) return '—';
    final date = DateTime.tryParse(value.toString());
    if (date == null) return value.toString();
    return '${date.day}/${date.month}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.myUnlocks)),
          body: _buildBody(),
        );
      },
    );
  }

  Widget _buildBody() {
    if (_loading) return const LoadingWidget();
    if (_error != null) {
      return TartebErrorWidget(message: _error!, onRetry: _load);
    }
    if (_unlocks.isEmpty) {
      return EmptyStateWidget(
        icon: Icons.bookmark_border,
        title: AppStrings.noUnlockedYet,
        actionLabel: AppStrings.browseCandidates,
        onAction: widget.onBrowseTap,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _unlocks.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final unlock = _unlocks[index];
          final c = unlock['candidates'] as Map<String, dynamic>?;
          if (c == null) return const SizedBox.shrink();

          final name = c['name'] as String? ?? 'Unknown';
          final role = c['role'] as String? ?? '';
          final visa = c['visa_status'] as String? ?? '';
          final photoUrl = c['photo_url'] as String?;
          final phone = c['phone'] as String?;
          final whatsapp = c['whatsapp'] as String?;

          return Card(
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: AppColors.divider),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                    backgroundImage:
                        photoUrl != null ? NetworkImage(photoUrl) : null,
                    child: photoUrl == null
                        ? const Icon(Icons.person, color: AppColors.primary)
                        : null,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 4),
                        Text(role),
                        const SizedBox(height: 8),
                        VisaBadge(visaStatus: visa),
                        if (phone != null) ...[
                          const SizedBox(height: 12),
                          InkWell(
                            onTap: () => _launchUri('tel:$phone'),
                            child: Row(
                              children: [
                                const Icon(Icons.phone, size: 18),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    phone,
                                    style: const TextStyle(
                                      color: AppColors.primary,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                        if (whatsapp != null && whatsapp.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          InkWell(
                            onTap: () => _launchUri(
                              'https://wa.me/${whatsapp.replaceAll(RegExp(r'\D'), '')}',
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.chat, size: 18),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    whatsapp,
                                    style: const TextStyle(
                                      color: AppColors.secondary,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                        const SizedBox(height: 8),
                        Text(
                          AppStrings.unlockedOn(
                            _formatUnlockedDate(unlock['unlocked_at']),
                          ),
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

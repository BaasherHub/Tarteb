import 'package:flutter/material.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/shared/widgets/error_widget.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class CandidateProfileScreen extends StatefulWidget {
  const CandidateProfileScreen({super.key});

  @override
  State<CandidateProfileScreen> createState() => _CandidateProfileScreenState();
}

class _CandidateProfileScreenState extends State<CandidateProfileScreen> {
  Map<String, dynamic>? _candidate;
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
      final userId = TartebSupabase.auth.currentUser!.id;
      final data = await TartebSupabase.client
          .from('candidates')
          .select()
          .eq('user_id', userId)
          .maybeSingle();
      setState(() => _candidate = data);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My profile')),
      body: _loading
          ? const LoadingWidget()
          : _error != null
              ? TartebErrorWidget(message: _error!, onRetry: _load)
              : _candidate == null
                  ? const Center(child: Text('No profile found'))
                  : ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        ListTile(
                          title: const Text('Name'),
                          subtitle: Text('${_candidate!['name']}'),
                        ),
                        ListTile(
                          title: const Text('Role'),
                          subtitle: Text('${_candidate!['role']}'),
                        ),
                        ListTile(
                          title: const Text('Location'),
                          subtitle: Text('${_candidate!['location']}'),
                        ),
                        ListTile(
                          title: const Text('Salary (AED/month)'),
                          subtitle:
                              Text('${_candidate!['salary_expectation']}'),
                        ),
                        SwitchListTile(
                          title: const Text('Profile active'),
                          value: _candidate!['is_active'] as bool? ?? true,
                          onChanged: (v) async {
                            await TartebSupabase.client
                                .from('candidates')
                                .update({'is_active': v})
                                .eq('user_id', TartebSupabase.auth.currentUser!.id);
                            _load();
                          },
                        ),
                      ],
                    ),
    );
  }
}

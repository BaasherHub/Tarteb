import 'package:flutter/material.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/shared/widgets/error_widget.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class MyUnlocksScreen extends StatefulWidget {
  const MyUnlocksScreen({super.key});

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
          .select('*, candidates(name, role, location)')
          .order('unlocked_at', ascending: false);
      setState(() => _unlocks = List<Map<String, dynamic>>.from(data));
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My unlocks')),
      body: _loading
          ? const LoadingWidget()
          : _error != null
              ? TartebErrorWidget(message: _error!, onRetry: _load)
              : _unlocks.isEmpty
                  ? const Center(child: Text('No unlocks yet'))
                  : ListView.builder(
                      itemCount: _unlocks.length,
                      itemBuilder: (context, index) {
                        final u = _unlocks[index];
                        final c = u['candidates'] as Map<String, dynamic>?;
                        return ListTile(
                          title: Text(c?['name'] as String? ?? 'Candidate'),
                          subtitle: Text(
                            '${c?['role']} · ${c?['location']}',
                          ),
                          trailing: Text('AED ${u['amount_paid']}'),
                        );
                      },
                    ),
    );
  }
}

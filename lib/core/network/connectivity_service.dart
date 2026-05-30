import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';

class ConnectivityService extends ChangeNotifier {
  ConnectivityService._();
  static final ConnectivityService instance = ConnectivityService._();

  final _connectivity = Connectivity();
  bool _isOnline = true;

  bool get isOnline => _isOnline;

  Future<void> init() async {
    final result = await _connectivity.checkConnectivity();
    _update(result);
    _connectivity.onConnectivityChanged.listen(_update);
  }

  void _update(List<ConnectivityResult> results) {
    final online = results.any((r) => r != ConnectivityResult.none);
    if (_isOnline != online) {
      _isOnline = online;
      notifyListeners();
    }
  }
}

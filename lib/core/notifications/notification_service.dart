import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Push notification service infrastructure.
/// 
/// Setup instructions:
/// 1. Create a OneSignal account at https://onesignal.com
/// 2. Create a new app for iOS and Android
/// 3. Add OneSignal App ID to your environment:
///    - Add `ONESIGNAL_APP_ID` to your --dart-define
/// 4. Uncomment the OneSignal package in pubspec.yaml
/// 5. Call `NotificationService.instance.init()` in main.dart
/// 
/// This service provides:
/// - Push notification initialization
/// - User subscription management
/// - Notification preferences
/// - Player ID tracking for targeted notifications
class NotificationService extends ChangeNotifier {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  static const String _prefsKeyEnabled = 'notifications_enabled';
  static const String _prefsKeyProfileViews = 'notify_profile_views';
  static const String _prefsKeyNewMessages = 'notify_new_messages';
  static const String _prefsKeySubscription = 'notify_subscription';

  // OneSignal App ID - pass via --dart-define=ONESIGNAL_APP_ID=your_app_id
  static const String _oneSignalAppId = String.fromEnvironment('ONESIGNAL_APP_ID');

  bool _initialized = false;
  bool _enabled = true;
  bool _notifyProfileViews = true;
  bool _notifyNewMessages = true;
  bool _notifySubscription = true;
  String? _playerId;

  bool get initialized => _initialized;
  bool get enabled => _enabled;
  bool get notifyProfileViews => _notifyProfileViews;
  bool get notifyNewMessages => _notifyNewMessages;
  bool get notifySubscription => _notifySubscription;
  String? get playerId => _playerId;
  bool get isConfigured => _oneSignalAppId.isNotEmpty;

  /// Initialize the notification service.
  /// Call this in main.dart after other services are initialized.
  Future<void> init() async {
    if (_initialized) return;

    // Load preferences
    final prefs = await SharedPreferences.getInstance();
    _enabled = prefs.getBool(_prefsKeyEnabled) ?? true;
    _notifyProfileViews = prefs.getBool(_prefsKeyProfileViews) ?? true;
    _notifyNewMessages = prefs.getBool(_prefsKeyNewMessages) ?? true;
    _notifySubscription = prefs.getBool(_prefsKeySubscription) ?? true;

    // Initialize OneSignal if configured
    if (isConfigured) {
      await _initializeOneSignal();
    } else {
      debugPrint('[NotificationService] OneSignal not configured. '
          'Set ONESIGNAL_APP_ID via --dart-define to enable push notifications.');
    }

    _initialized = true;
    notifyListeners();
  }

  Future<void> _initializeOneSignal() async {
    // TODO: Uncomment when OneSignal is added to pubspec.yaml
    // 
    // OneSignal.initialize(_oneSignalAppId);
    // 
    // // Request notification permission
    // await OneSignal.Notifications.requestPermission(true);
    // 
    // // Listen for notification events
    // OneSignal.Notifications.addClickListener((event) {
    //   _handleNotificationClick(event);
    // });
    // 
    // // Get player ID for targeting
    // final deviceState = await OneSignal.User.getOnesignalId();
    // _playerId = deviceState;
    
    debugPrint('[NotificationService] OneSignal would be initialized here');
  }

  /// Set whether notifications are enabled globally.
  Future<void> setEnabled(bool value) async {
    _enabled = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefsKeyEnabled, value);
    
    // Update OneSignal subscription
    // TODO: Uncomment when OneSignal is added
    // if (isConfigured) {
    //   OneSignal.User.pushSubscription.optIn();
    //   or
    //   OneSignal.User.pushSubscription.optOut();
    // }
    
    notifyListeners();
  }

  /// Set notification preference for profile views.
  Future<void> setNotifyProfileViews(bool value) async {
    _notifyProfileViews = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefsKeyProfileViews, value);
    notifyListeners();
  }

  /// Set notification preference for new messages.
  Future<void> setNotifyNewMessages(bool value) async {
    _notifyNewMessages = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefsKeyNewMessages, value);
    notifyListeners();
  }

  /// Set notification preference for subscription updates.
  Future<void> setNotifySubscription(bool value) async {
    _notifySubscription = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefsKeySubscription, value);
    notifyListeners();
  }

  /// Associate the current user with their notification player.
  /// Call this after successful authentication.
  Future<void> setExternalUserId(String userId) async {
    if (!isConfigured) return;
    
    // TODO: Uncomment when OneSignal is added
    // OneSignal.login(userId);
    
    debugPrint('[NotificationService] Would set external user ID: $userId');
  }

  /// Remove user association on logout.
  Future<void> clearExternalUserId() async {
    if (!isConfigured) return;
    
    // TODO: Uncomment when OneSignal is added
    // OneSignal.logout();
    
    debugPrint('[NotificationService] Would clear external user ID');
  }

  /// Add tags for notification segmentation.
  Future<void> setUserTags(Map<String, String> tags) async {
    if (!isConfigured) return;
    
    // TODO: Uncomment when OneSignal is added
    // for (final entry in tags.entries) {
    //   OneSignal.User.addTagWithKey(entry.key, entry.value);
    // }
    
    debugPrint('[NotificationService] Would set user tags: $tags');
  }

  /// Remove tags.
  Future<void> removeUserTags(List<String> keys) async {
    if (!isConfigured) return;
    
    // TODO: Uncomment when OneSignal is added
    // OneSignal.User.removeTags(keys);
    
    debugPrint('[NotificationService] Would remove user tags: $keys');
  }
}

/// Notification types supported by the app.
enum NotificationType {
  profileView,
  newMessage,
  subscriptionExpiring,
  subscriptionExpired,
  newCandidateMatch,
}

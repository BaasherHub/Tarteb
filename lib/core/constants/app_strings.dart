import 'package:tarteb/core/l10n/locale_service.dart';

/// Bilingual UI strings (EN / AR). Listen to [LocaleService] for rebuilds.
abstract final class AppStrings {
  static bool get isArabic => LocaleService.instance.isArabic;

  static String _t(String en, String ar) =>
      LocaleService.instance.isArabic ? ar : en;

  // Brand
  static String get appName => 'Tarteb';
  static String get splashTaglineEn => 'Your next job, arranged';
  static String get splashTaglineAr => 'رتّب شغلك';
  static String get splashTaglineBilingual =>
      '$splashTaglineAr / $splashTaglineEn';

  // Auth
  static String get splashTagline => _t(splashTaglineEn, splashTaglineAr);
  static String get selectRole => _t('I am a...', 'أنا...');
  static String get roleCandidate => _t('Candidate', 'مرشح');
  static String get roleEmployer => _t('Employer', 'صاحب عمل');
  static String get enterPhone => _t('Enter your phone number', 'أدخل رقم هاتفك');
  static String get enterEmail => _t('Email address', 'البريد الإلكتروني');
  static String get verifyOtp => _t('Verify OTP', 'تحقق من الرمز');
  static String get signInWithEmail =>
      _t('Sign in with email', 'تسجيل الدخول بالبريد');
  static String get sendOtp => _t('Send OTP', 'إرسال الرمز');
  static String get otpCode => _t('OTP code', 'رمز التحقق');
  static String get verify => _t('Verify', 'تحقق');
  static String get roleCandidateSubtitle =>
      _t('List your profile for free', 'أضف ملفك مجاناً');
  static String get roleEmployerSubtitle =>
      _t('Browse and unlock candidates', 'تصفح وافتح بيانات المرشحين');

  // Navigation
  static String get browse => _t('Browse', 'تصفح');
  static String get browseCandidates =>
      _t('Browse candidates', 'تصفح المرشحين');
  static String get myUnlocks => _t('My Unlocks', 'المرشحون المفتوحون');
  static String get credits => _t('Credits', 'رصيد');
  static String creditsCount(int n) => _t('Credits: $n', 'رصيد: $n');

  // Unlock & pricing
  static const int unlockCostAed = 50;
  static const int creditPerUnlock = 1;
  static String get unlockForAed50 =>
      _t('Unlock for AED 50', 'افتح مقابل 50 درهم');
  static String get contactUnlocked =>
      _t('Contact unlocked! 🎉', 'تم فتح بيانات التواصل! 🎉');

  static const String supportWhatsApp = '971501551480';

  // Filters
  static String get filters => _t('Filters', 'الفلاتر');
  static String get apply => _t('Apply', 'تطبيق');
  static String get reset => _t('Reset', 'إعادة تعيين');
  static String get resetFilters => _t('Reset filters', 'إعادة تعيين الفلاتر');
  static String get filtered => _t('Filtered', 'مفلتر');
  static String get availableFrom => _t('Available from', 'متاح من');
  static String get availableNow => _t('Available now', 'متاح الآن');
  static String get nationality => _t('Nationality', 'الجنسية');
  static String get searchNationality =>
      _t('Search nationality...', 'ابحث عن الجنسية...');

  // Profile
  static String get editProfile => _t('Edit Profile', 'تعديل الملف');
  static String get active => _t('Active', 'نشط');
  static String get paused => _t('Paused', 'متوقف');
  static String get profileActive => _t('Profile active', 'الملف نشط');
  static String get visibleToEmployers =>
      _t('Visible to employers', 'ظاهر لأصحاب العمل');
  static String get profilePausedBanner => _t(
        'Your profile is paused — employers cannot see you',
        'ملفك متوقف — أصحاب العمل لا يمكنهم رؤيتك',
      );
  static String get resume => _t('Resume', 'استئناف');
  static String get profileViews => _t('Profile views', 'مشاهدات الملف');
  static String get profileViewsSubtitle => _t(
        'Times employers unlocked your contact',
        'مرات فتح أصحاب العمل لبيانات تواصلك',
      );
  static String get profileLiveMessage => _t(
        'Your profile is live — employers can find you',
        'ملفك نشط — أصحاب العمل يمكنهم العثور عليك',
      );
  static String get zeroProfileViews => profileLiveMessage;

  // Settings
  static String get settings => _t('Settings', 'الإعدادات');
  static String get language => _t('Language', 'اللغة');
  static String get english => _t('English', 'English');
  static String get arabic => _t('Arabic', 'العربية');
  static String get logout => _t('Logout', 'تسجيل الخروج');
  static String get contactSupport => _t('Contact support', 'تواصل مع الدعم');
  static String get contactUsOnWhatsApp =>
      _t('Contact us on WhatsApp', 'تواصل معنا على واتساب');
  static String get appVersion => _t('App version', 'إصدار التطبيق');
  static String versionLabel(String v) => _t('Version $v', 'الإصدار $v');

  // Buy credits
  static String get buyCredits => _t('Buy credits', 'شراء رصيد');
  static String get creditsAddedManually => _t(
        'Credits are added manually within 1 hour',
        'يُضاف الرصيد يدوياً خلال ساعة',
      );
  static String get purchaseCreditsWhatsApp => _t(
        'To purchase credits, contact us on WhatsApp',
        'لشراء الرصيد، تواصل معنا على واتساب',
      );
  static String get comingSoon => _t('Coming soon', 'قريباً');

  // Empty states
  static String get noCandidatesFound =>
      _t('No candidates found', 'لا يوجد مرشحون');
  static String get noCandidatesMatchFilters => _t(
        'No candidates match your filters',
        'لا يوجد مرشحون يطابقون الفلاتر',
      );
  static String get tryAdjustingFilters => _t(
        'Try adjusting your filters or check back later.',
        'جرّب تعديل الفلاتر أو عد لاحقاً.',
      );
  static String get noUnlockedYet => _t(
        "You haven't unlocked any candidates yet",
        'لم تفتح أي مرشح بعد',
      );
  static String get noUnlockedCandidatesYet => _t(
        'No unlocked candidates yet',
        'لا يوجد مرشحون مفتوحون بعد',
      );
  static String unlockedOn(String date) =>
      _t('Unlocked on $date', 'فُتح في $date');

  // Errors & connectivity
  static String get somethingWentWrong => _t(
        'Something went wrong. Pull to refresh.',
        'حدث خطأ. اسحب للتحديث.',
      );
  static String get noInternet =>
      _t('No internet connection', 'لا يوجد اتصال بالإنترنت');
  static String get tryAgain => _t('Try again', 'حاول مرة أخرى');

  // Onboarding
  static String get skipForNow => _t('Skip for now', 'تخطي الآن');
  static String get continueLabel => _t('Continue', 'متابعة');
  static String get yourPhoto => _t('Your photo', 'صورتك');
  static String get addClearPhoto => _t(
        'Add a clear photo of yourself',
        'أضف صورة واضحة لنفسك',
      );
  static String get camera => _t('Camera', 'الكاميرا');
  static String get gallery => _t('Gallery', 'المعرض');
  static String get requiredField => _t('Required', 'مطلوب');
  static String get companyDetails => _t('Company details', 'بيانات الشركة');
  static String get startBrowsing => _t('Start browsing', 'ابدأ التصفح');

  // Misc
  static String get confirm => _t('Confirm', 'تأكيد');
  static String get cancel => _t('Cancel', 'إلغاء');
  static String get perMonth => _t('/month', '/شهر');

  // Data enums (job roles stay English for DB)
  static const List<String> candidateRoles = [
    'Cashier', 'Storekeeper', 'Driver', 'Receptionist', 'Cleaner',
    'Waiter', 'Cook', 'Security Guard', 'Sales Assistant', 'Delivery',
    'Admin', 'Warehouse', 'Barista', 'Helper',
  ];
  static const List<String> visaStatuses = [
    'Employment Visa', 'Visit Visa', 'Own Visa', 'Cancelled Visa',
  ];
  static const List<String> locations = [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Other',
  ];
  static const List<String> profileRoles = ['candidate', 'employer'];
}

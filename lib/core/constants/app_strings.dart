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
  static String get welcomeToTarteb =>
      _t('Welcome to Tarteb', 'مرحباً بك في ترتّب');
  static String get otpHelper =>
      _t('We\'ll send a 6-digit code', 'سنرسل رمزاً من 6 أرقام');
  static String get phoneSavedNote => _t(
        'Your number is saved to your profile.',
        'رقمك محفوظ في ملفك.',
      );
  static String get country => _t('Country', 'الدولة');
  static String get changePhoneNumber =>
      _t('Change phone number', 'تغيير رقم الهاتف');
  static String get codeSentTo => _t('Code sent to', 'تم إرسال الرمز إلى');
  static String get splashTagline => _t(splashTaglineEn, splashTaglineAr);
  static String get selectRole => _t('I am a...', 'أنا...');
  static String get roleCandidate => _t('Candidate', 'مرشح');
  static String get roleEmployer => _t('Employer', 'صاحب عمل');
  static String get enterPhone => _t('Enter your phone number', 'أدخل رقم هاتفك');
  static String get enterEmail => _t('Email address', 'البريد الإلكتروني');
  static String get verifyOtp => _t('Verify OTP', 'تحقق من الرمز');
  static String get signInWithEmail =>
      _t('Sign in with email', 'تسجيل الدخول بالبريد');
  static String get signInWithEmailInstead => _t(
        'Sign in with email instead',
        'تسجيل الدخول بالبريد بدلاً من ذلك',
      );
  static String get sendOtp => _t('Send OTP', 'إرسال الرمز');
  static String get otpCode => _t('OTP code', 'رمز التحقق');
  static String get verify => _t('Verify', 'تحقق');
  static String get roleCandidateSubtitle =>
      _t('List your profile for free', 'أضف ملفك مجاناً');
  static String get roleEmployerSubtitle => _t(
        'Browse candidates with a monthly plan',
        'تصفح المرشحين بخطة شهرية',
      );

  // Navigation
  static String get browse => _t('Browse', 'تصفح');
  static String get browseCandidates =>
      _t('Browse candidates', 'تصفح المرشحين');
  static String get myUnlocks => _t('My Unlocks', 'المرشحون المفتوحون');
  static String get favorites => _t('Favorites', 'المفضلة');
  static String get credits => _t('Credits', 'رصيد');
  static String creditsCount(int n) => _t('Credits: $n', 'رصيد: $n');

  // Subscription & unlock
  static const double subscriptionMonthlyAed = 39.99;
  static String get subscriptionPriceLabel =>
      _t('AED 39.99 / month', '٣٩٫٩٩ درهم / شهر');
  static String get unlockContact =>
      _t('Unlock contact', 'افتح بيانات التواصل');
  static String get subscribe => _t('Subscribe', 'اشترك');
  static String get subscription => _t('Subscription', 'الاشتراك');
  static String get planActive => _t('Plan active', 'الخطة نشطة');
  static String get noActiveSubscription => _t(
        'No active subscription',
        'لا يوجد اشتراك نشط',
      );
  static String subscriptionValidUntil(String date) => _t(
        'Valid until $date',
        'ساري حتى $date',
      );
  static String confirmUnlockContact(String name) => _t(
        'Unlock contact for $name?',
        'فتح بيانات التواصل لـ $name؟',
      );
  static String get includedInYourPlan => _t(
        'Included in your monthly plan',
        'مشمول في خطتك الشهرية',
      );
  static String get contactUnlocked =>
      _t('Contact unlocked! 🎉', 'تم فتح بيانات التواصل! 🎉');

  /// Legacy per-CV pricing (deprecated — kept for admin tooling).
  @Deprecated('Use subscriptionMonthlyAed')
  static const int unlockCostAed = 50;

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
  static String get searchCandidates =>
      _t('Search candidates...', 'ابحث عن المرشحين...');
  static String get search => _t('Search', 'بحث');
  static String get clearSearch => _t('Clear search', 'مسح البحث');

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
        'Your profile is live — employers can find you 👋',
        'ملفك نشط — أصحاب العمل يمكنهم العثور عليك 👋',
      );
  static String get zeroProfileViews => profileLiveMessage;

  // Candidate profile (browse cards & onboarding)
  static String get noExperience => _t('No experience', 'بدون خبرة');
  static String get oneYear => _t('1 year', 'سنة واحدة');
  static String get twoThreeYears => _t('2-3 years', '٢-٣ سنوات');
  static String get fourFiveYears => _t('4-5 years', '٤-٥ سنوات');
  static String get fivePlusYears => _t('5+ years', '٥+ سنوات');
  static String get oneYearExperience =>
      _t('1 year experience', 'سنة واحدة خبرة');
  static String yearsExperience(int years) =>
      _t('$years years experience', '$years سنوات خبرة');
  static String get uaeExperienceBadge =>
      _t('UAE Experience ✓', 'خبرة في الإمارات ✓');
  static String previouslyAt(String company) =>
      _t('Previously at $company', 'سبق وعمل في $company');
  static String get languages => _t('Languages', 'اللغات');

  // Settings
  static String get settings => _t('Settings', 'الإعدادات');
  static String get language => _t('Language', 'اللغة');
  static String get english => _t('English', 'English');
  static String get arabic => _t('Arabic', 'العربية');
  static String get theme => _t('Theme', 'المظهر');
  static String get themeLight => _t('Light', 'فاتح');
  static String get themeDark => _t('Dark', 'داكن');
  static String get themeSystem => _t('System', 'تلقائي');
  static String get notifications => _t('Notifications', 'الإشعارات');
  static String get notificationsEnabled =>
      _t('Push notifications', 'الإشعارات الفورية');
  static String get notifyProfileViews =>
      _t('Profile views', 'مشاهدات الملف');
  static String get notifyProfileViewsDesc =>
      _t('When an employer views your profile', 'عندما يشاهد صاحب عمل ملفك');
  static String get notifyNewMessages =>
      _t('New messages', 'رسائل جديدة');
  static String get notifySubscription =>
      _t('Subscription updates', 'تحديثات الاشتراك');
  static String get notifySubscriptionDesc =>
      _t('Reminders before your plan expires', 'تذكيرات قبل انتهاء خطتك');
  static String get logout => _t('Logout', 'تسجيل الخروج');
  static String get contactSupport => _t('Contact support', 'تواصل مع الدعم');
  static String get contactUsOnWhatsApp =>
      _t('Contact us on WhatsApp', 'تواصل معنا على واتساب');
  static String get appVersion => _t('App version', 'إصدار التطبيق');
  static String versionLabel(String v) => _t('Version $v', 'الإصدار $v');

  // Subscription (manual WhatsApp until Stripe)
  static String get subscribeTitle => _t('Tarteb Employer Plan', 'خطة ترتّب لأصحاب العمل');
  static String get subscribeViaWhatsApp =>
      _t('Subscribe via WhatsApp', 'اشترك عبر واتساب');
  static String get subscribeSteps => _t(
        '1. Tap WhatsApp below\n'
        '2. Send payment (AED 39.99 / month)\n'
        '3. We activate your plan within 1 hour',
        '١. اضغط واتساب أدناه\n'
        '٢. أرسل الدفع (٣٩٫٩٩ درهم / شهر)\n'
        '٣. نفعّل خطتك خلال ساعة',
      );
  static String get subscriptionActivatedManually => _t(
        'Your plan is activated manually after payment confirmation',
        'تُفعَّل خطتك يدوياً بعد تأكيد الدفع',
      );
  static String get subscriptionBenefit => _t(
        'Unlimited contact unlocks while your plan is active',
        'فتح بيانات التواصل بدون حد أثناء نشاط خطتك',
      );
  static String get subscriptionRequired => _t(
        'Subscribe to unlock candidate contacts',
        'اشترك لفتح بيانات تواصل المرشحين',
      );
  static String get contactUsToSubscribe => _t(
        'Contact us on WhatsApp to subscribe',
        'تواصل معنا على واتساب للاشتراك',
      );

  /// Legacy credits UI (admin only).
  static String get buyCredits => subscription;
  static String get creditsAddedManually => subscriptionActivatedManually;
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
  
  // Favorites
  static String get noFavoritesYet => _t(
        'No favorites yet',
        'لا توجد مفضلات بعد',
      );
  static String get noFavoritesSubtitle => _t(
        'Tap the heart icon on any candidate to save them here.',
        'اضغط على أيقونة القلب على أي مرشح لحفظه هنا.',
      );
  static String get addToFavorites => _t('Add to favorites', 'أضف إلى المفضلة');
  static String get removeFromFavorites =>
      _t('Remove from favorites', 'إزالة من المفضلة');
  static String get addedToFavorites =>
      _t('Added to favorites', 'تمت الإضافة إلى المفضلة');
  static String get removedFromFavorites =>
      _t('Removed from favorites', 'تمت الإزالة من المفضلة');

  // Errors & connectivity
  static String get somethingWentWrong => _t(
        'Something went wrong. Pull to refresh.',
        'حدث خطأ. اسحب للتحديث.',
      );
  static String get noInternet =>
      _t('No internet connection', 'لا يوجد اتصال بالإنترنت');
  static String get tryAgain => _t('Try again', 'حاول مرة أخرى');

  // Onboarding
  static String stepOf(int current, int total) =>
      _t('Step $current of $total', 'الخطوة $current من $total');
  static String get visaStatus => _t('Visa status', 'حالة التأشيرة');
  static String get jobRole => _t('Job role', 'المهنة');
  static String get salaryAndContact =>
      _t('Salary & contact', 'الراتب والتواصل');
  static String get availability => _t('Availability', 'التوفر');
  static String get monthlySalaryAed =>
      _t('Monthly salary expectation (AED)', 'الراتب الشهري المتوقع (درهم)');
  static String get location => _t('Location', 'الموقع');
  static String get phoneNumber => _t('Phone number', 'رقم الهاتف');
  static String get whatsappOptional =>
      _t('WhatsApp (optional)', 'واتساب (اختياري)');
  static String get yearsExperienceLabel =>
      _t('Years of experience', 'سنوات الخبرة');
  static String get fullName => _t('Full name', 'الاسم الكامل');
  static String get uaeExperienceQuestion => _t(
        'Have you worked in UAE before?',
        'هل عملت في الإمارات من قبل؟',
      );
  static String get yes => _t('Yes', 'نعم');
  static String get no => _t('No', 'لا');
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

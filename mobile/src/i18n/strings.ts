export type Lang = 'en' | 'ar';

export interface Strings {
  appName: string;
  splashTagline: string;
  welcomeToTarteb: string;
  otpHelper: string;
  sendOtp: string;
  continueWithoutOtp: string;
  verify: string;
  otpCode: string;
  enterPhone: string;
  changePhone: string;
  codeSentTo: string;
  signInWithEmail: string;
  selectRole: string;
  selectRoleSubtitle: string;
  roleCandidate: string;
  roleEmployer: string;
  roleCandidateSubtitle: string;
  roleEmployerSubtitle: string;
  browse: string;
  myUnlocks: string;
  subscribe: string;
  planActive: string;
  subscription: string;
  subscriptionPrice: string;
  unlockContact: string;
  contactUnlocked: string;
  subscriptionRequired: string;
  subscribeViaWhatsApp: string;
  subscriptionBody: string;
  subscriptionBullet1: string;
  subscriptionBullet2: string;
  subscriptionBullet3: string;
  subscriptionValidUntil: (date: string) => string;
  settings: string;
  continue: string;
  cancel: string;
  confirm: string;
  loading: string;
  errorGeneric: string;
  noCandidates: string;
  noCandidatesHint: string;
  resetFilters: string;
  employerOnboarding: string;
  companyName: string;
  contactName: string;
  startBrowsing: string;
  stepOf: (c: number, t: number) => string;
  yourPhoto: string;
  camera: string;
  gallery: string;
  skipForNow: string;
  skipPhotoForNow: string;
  skipPhotoForNowHint: string;
  errPhotoRequired: string;
  jobRole: string;
  visaStatus: string;
  nationality: string;
  location: string;
  monthlySalary: string;
  phoneNumber: string;
  whatsappOptional: string;
  yearsExperience: string;
  languages: string;
  uaeExperience: string;
  yes: string;
  no: string;
  previousEmployer: string;
  fullName: string;
  availableFrom: string;
  submitProfile: string;
  saveProfile: string;
  required: string;
  profilePaused: string;
  profileViews: string;
  profileLive: string;
  profileActive: string;
  editProfile: string;
  filters: string;
  candidatePickRole: string;
  candidatePickRoleHint: string;
  roleSelected: string;
  browsePickRole: string;
  browsePickRoleHint: string;
  browseRefine: string;
  browseBackToRoles: string;
  candidatesForRole: (role: string) => string;
  filterOptionalHint: string;
  filterSalaryRange: string;
  filterExperience: string;
  browseFilterLanguages: string;
  filterUaeExp: string;
  filterAny: string;
  salaryMinLabel: string;
  salaryMaxLabel: string;
  salaryMinPlaceholder: string;
  salaryMaxPlaceholder: string;
  addEmirateOnly: (emirate: string) => string;
  otpPlaceholder: string;
  filterRoles: string;
  filterVisa: string;
  apply: string;
  reset: string;
  filtered: string;
  availableNow: string;
  enterEmail: string;
  email: string;
  searchPlaceholder: string;
  unlockedBadge: string;
  salaryPerMonth: (amount: string) => string;
  subscribeToUnlock: string;
  viewSubscription: string;
  call: string;
  whatsApp: string;
  noUnlocksYet: string;
  noUnlocksHint: string;
  devOtpBanner: string;
  selectLocation: string;
  supportWhatsApp: string;
  logout: string;
  english: string;
  arabic: string;
  nationalityLabel: string;
  experienceLabel: string;
  permissionRequired: string;
  emailPlaceholder: string;
  back: string;
  nationalityPlaceholder: string;
  nationalityHint: string;
  locationEmirate: string;
  locationArea: string;
  locationAreaHint: string;
  locationAreaPlaceholder: string;
  locationNoMatch: string;
  locationSelected: string;
  locationFilterHint: string;
  salaryPlaceholder: string;
  phonePlaceholder: string;
  whatsappPlaceholder: string;
  fullNamePlaceholder: string;
  companyPlaceholder: string;
  contactPlaceholder: string;
  datePlaceholder: string;
  availableFromHint: string;
  signInWithPhone: string;
  changeEmail: string;
  pickDate: string;
  photoHint: string;
  tapToAddPhoto: string;
  popularRoles: string;
  moreRoles: string;
  moreLanguages: string;
  home: string;
  roleConfirmTitle: string;
  roleConfirmMessage: string;
  roleConfirmAction: (role: string) => string;
  roleSelectDifferent: string;
  contactUnlocks: string;
  contactUnlocksHint: string;
  contactUnlocksEmpty: string;
  subStep1Title: string;
  subStep1Desc: string;
  subStep2Title: string;
  subStep2Desc: string;
  subStep3Title: string;
  subStep3Desc: string;
  managePlan: string;
  errRole: string;
  errVisa: string;
  errNationality: string;
  errNationalityPick: string;
  errLocation: string;
  errAvailableFrom: string;
  errSalary: string;
  errPhone: string;
  errExperience: string;
  errLanguages: string;
  errUae: string;
  errFullName: string;
  errCompany: string;
  errContact: string;
  errEmail: string;
  errEmailInvalid: string;
  draftSaved: string;
  discardDraft: string;
  yourRole: string;
  wrongRoleHelp: string;
  contactSupportRole: string;
  language: string;
  accountNotice: string;
  popularLanguages: string;
  subscriptionPending: string;
  subscriptionPendingHint: string;
  activeAgo: (days: number) => string;
  tradeLicense: string;
  tradeLicensePlaceholder: string;
  tradeLicenseHint: string;
}

const en: Strings = {
  appName: 'Tarteb',
  splashTagline: 'Your next job, arranged',
  welcomeToTarteb: 'Welcome to Tarteb',
  otpHelper: "We'll send a 6-digit code",
  sendOtp: 'Send OTP',
  continueWithoutOtp: 'Continue',
  verify: 'Verify',
  otpCode: 'OTP code',
  enterPhone: 'Enter your phone number',
  changePhone: 'Change phone number',
  codeSentTo: 'Code sent to',
  signInWithEmail: 'Sign in with email instead',
  selectRole: 'Choose your account type',
  selectRoleSubtitle:
    'This choice is permanent in the app. Contact support if you need to change it later.',
  roleCandidate: 'Job seeker',
  roleEmployer: 'Employer',
  roleCandidateSubtitle: 'Create a profile employers can browse',
  roleEmployerSubtitle: 'Browse candidates with a monthly plan',
  browse: 'Browse',
  myUnlocks: 'Candidates',
  subscribe: 'Subscribe',
  planActive: 'Plan active',
  subscription: 'Subscription',
  subscriptionPrice: 'AED 79.9 / month',
  unlockContact: 'Unlock contact',
  contactUnlocked: 'Contact unlocked!',
  subscriptionRequired: 'Subscribe to unlock candidate contacts',
  subscribeViaWhatsApp: 'Subscribe via WhatsApp',
  subscriptionBody:
    'Unlimited contact unlocks while your plan is active. Payment is confirmed via WhatsApp; we activate within 1 hour.',
  subscriptionBullet1: 'Unlimited unlocks for all candidates',
  subscriptionBullet2: 'Phone & WhatsApp contact details',
  subscriptionBullet3: 'Cancel anytime — no per-CV fees',
  subscriptionValidUntil: (date) => `Valid until ${date}`,
  settings: 'Settings',
  continue: 'Continue',
  cancel: 'Cancel',
  confirm: 'Confirm',
  loading: 'Loading...',
  errorGeneric: 'Something went wrong. Try again.',
  noCandidates: 'No candidates match your filters',
  noCandidatesHint: 'Try resetting filters or check back later for new profiles.',
  resetFilters: 'Reset filters',
  employerOnboarding: 'Company details',
  companyName: 'Company name',
  contactName: 'Contact name',
  startBrowsing: 'Start browsing',
  stepOf: (c, t) => `Step ${c} of ${t}`,
  yourPhoto: 'Your photo',
  camera: 'Camera',
  gallery: 'Gallery',
  skipForNow: 'Skip for now',
  skipPhotoForNow: 'Skip photo for now',
  skipPhotoForNowHint: 'You can add a photo later. A clear face photo helps employers trust your profile.',
  errPhotoRequired: 'Add a photo or tap “Skip photo for now”',
  jobRole: 'Job role',
  visaStatus: 'Visa status',
  nationality: 'Nationality',
  location: 'Location',
  monthlySalary: 'Monthly salary (AED)',
  phoneNumber: 'Phone number',
  whatsappOptional: 'WhatsApp (optional)',
  yearsExperience: 'Years of experience',
  languages: 'Languages',
  uaeExperience: 'Worked in UAE before?',
  yes: 'Yes',
  no: 'No',
  previousEmployer: 'Previous company (optional)',
  fullName: 'Full name',
  availableFrom: 'Available from',
  submitProfile: 'Submit profile',
  saveProfile: 'Save profile',
  required: 'Please fill all required fields',
  profilePaused: 'Your profile is paused — employers cannot see you',
  profileViews: 'Profile views',
  profileLive: 'Your profile is live — employers can find you',
  profileActive: 'Profile active',
  editProfile: 'Edit profile',
  filters: 'Filters',
  candidatePickRole: 'Your job role',
  candidatePickRoleHint:
    'Choose the one role that best matches what you are looking for. Listed A–Z.',
  roleSelected: 'Selected',
  browsePickRole: 'What role are you hiring for?',
  browsePickRoleHint:
    'Pick a job title first — then refine by nationality, location, salary, experience, and more. Use only the filters that matter to you.',
  browseRefine: 'Refine',
  browseBackToRoles: 'All roles',
  candidatesForRole: (role) => role,
  filterOptionalHint: 'All filters are optional — leave blank to see everyone in this role.',
  filterSalaryRange: 'Salary range (AED / month)',
  filterExperience: 'Experience',
  browseFilterLanguages: 'Languages spoken',
  filterUaeExp: 'Worked in UAE before',
  filterAny: 'Any',
  salaryMinLabel: 'Minimum',
  salaryMaxLabel: 'Maximum',
  salaryMinPlaceholder: 'Min (optional)',
  salaryMaxPlaceholder: 'Max (optional)',
  addEmirateOnly: (emirate) => `All of ${emirate}`,
  otpPlaceholder: '6-digit code',
  filterRoles: 'Job role',
  filterVisa: 'Visa status',
  apply: 'Apply',
  reset: 'Reset',
  filtered: 'Filtered',
  availableNow: 'Available now',
  enterEmail: 'Email address',
  email: 'Email',
  searchPlaceholder: 'Search nationality...',
  unlockedBadge: 'Unlocked',
  salaryPerMonth: (amount) => `AED ${amount}/mo`,
  subscribeToUnlock: 'Subscribe to unlock phone & WhatsApp',
  viewSubscription: 'View plans',
  call: 'Call',
  whatsApp: 'WhatsApp',
  noUnlocksYet: 'No unlocks yet',
  noUnlocksHint: 'Browse candidates and unlock contacts when you are ready to hire.',
  devOtpBanner: 'Test mode: OTP disabled — no SMS cost',
  selectLocation: 'Select location',
  supportWhatsApp: 'Support (WhatsApp)',
  logout: 'Logout',
  english: 'English',
  arabic: 'العربية',
  nationalityLabel: 'Nationality',
  experienceLabel: 'Experience',
  permissionRequired: 'Camera or photo library permission is required',
  emailPlaceholder: 'you@example.com',
  back: 'Back',
  nationalityPlaceholder: 'Start typing, e.g. Sud…',
  nationalityHint: 'Pick from the list so profiles stay consistent (e.g. Sudanese, not Sudan).',
  locationEmirate: 'Emirate',
  locationArea: 'Area or district',
  locationAreaHint: 'Optional — helps employers find people near their business.',
  locationAreaPlaceholder: 'e.g. Deira, Marina, Khalifa City…',
  locationNoMatch: 'No matching area — try another spelling or pick the emirate only.',
  locationSelected: 'Selected',
  locationFilterHint: 'Filter by emirate or a specific district',
  salaryPlaceholder: 'Amount in AED',
  phonePlaceholder: '05x xxx xxxx',
  whatsappPlaceholder: 'Same as phone or different',
  fullNamePlaceholder: 'As on your ID',
  companyPlaceholder: 'Your registered business name',
  contactPlaceholder: 'Person we can reach',
  datePlaceholder: 'Select a date',
  availableFromHint: 'When you can start working',
  signInWithPhone: 'Sign in with phone instead',
  changeEmail: 'Change email',
  pickDate: 'Pick availability date',
  photoHint: 'A clear face photo helps employers trust your profile',
  tapToAddPhoto: 'Tap to add photo',
  popularRoles: 'Popular roles',
  moreRoles: 'More roles',
  moreLanguages: 'More languages',
  home: 'Home',
  roleConfirmTitle: 'Confirm account type',
  roleConfirmMessage:
    'You cannot switch between job seeker and employer in the app. Our support team can help if you chose the wrong type.',
  roleConfirmAction: (role) => `Continue as ${role}`,
  roleSelectDifferent: 'Choose a different type',
  contactUnlocks: 'Contact unlocks',
  contactUnlocksHint: 'Employers who unlocked your phone or WhatsApp',
  contactUnlocksEmpty: 'No employer has unlocked your contact yet. Keep your profile active.',
  subStep1Title: 'Message us on WhatsApp',
  subStep1Desc: 'Tap Subscribe — we send payment details',
  subStep2Title: 'We confirm payment',
  subStep2Desc: 'Usually within 1 hour on business days',
  subStep3Title: 'Plan active',
  subStep3Desc: 'Unlimited unlocks until your plan ends',
  managePlan: 'Plan',
  errRole: 'Select a job role',
  errVisa: 'Select your visa status',
  errNationality: 'Enter your nationality',
  errNationalityPick: 'Choose a nationality from the list',
  errLocation: 'Select your location',
  errAvailableFrom: 'Select when you are available to start',
  errSalary: 'Enter expected monthly salary',
  errPhone: 'Enter your phone number',
  errExperience: 'Select years of experience',
  errLanguages: 'Select at least one language',
  errUae: 'Tell us if you worked in the UAE',
  errFullName: 'Enter your full name',
  errCompany: 'Enter company name',
  errContact: 'Enter contact name',
  errEmail: 'Enter your email',
  errEmailInvalid: 'Enter a valid email address',
  draftSaved: 'Your progress is saved — you can leave and continue later.',
  discardDraft: 'Discard saved progress',
  yourRole: 'Your account type',
  wrongRoleHelp:
    'Role cannot be changed in the app. If you chose Candidate or Employer by mistake, contact us on WhatsApp.',
  contactSupportRole: 'Contact support about my role',
  language: 'Language',
  accountNotice:
    'Your account is linked to this phone number. Use the same number when you return to sign in.',
  popularLanguages: 'Common languages',
  subscriptionPending: 'Activation pending',
  subscriptionPendingHint:
    'We received your WhatsApp message. Your plan is usually activated within 1 hour on business days.',
  activeAgo: (days) =>
    days === 0 ? 'Active today' : days === 1 ? 'Active yesterday' : days < 7 ? `Active ${days}d ago` : days < 30 ? `Active ${Math.floor(days / 7)}w ago` : `Active ${Math.floor(days / 30)}mo ago`,
  tradeLicense: 'Trade license number',
  tradeLicensePlaceholder: 'e.g. CN-1234567',
  tradeLicenseHint: 'Optional but helps candidates trust your business.',
};

const ar: Strings = {
  appName: 'Tarteb',
  splashTagline: 'رتّب شغلك',
  welcomeToTarteb: 'مرحباً بك في ترتّب',
  otpHelper: 'سنرسل رمزاً من 6 أرقام',
  sendOtp: 'إرسال الرمز',
  continueWithoutOtp: 'متابعة',
  verify: 'تحقق',
  otpCode: 'رمز التحقق',
  enterPhone: 'أدخل رقم هاتفك',
  changePhone: 'تغيير رقم الهاتف',
  codeSentTo: 'تم إرسال الرمز إلى',
  signInWithEmail: 'تسجيل الدخول بالبريد بدلاً من ذلك',
  selectRole: 'اختر نوع حسابك',
  selectRoleSubtitle:
    'هذا الاختيار دائم في التطبيق. تواصل مع الدعم إذا احتجت تغييره لاحقاً.',
  roleCandidate: 'باحث عن عمل',
  roleEmployer: 'صاحب عمل',
  roleCandidateSubtitle: 'أنشئ ملفاً يمكن لأصحاب العمل تصفحه',
  roleEmployerSubtitle: 'تصفح المرشحين بخطة شهرية',
  browse: 'تصفح',
  myUnlocks: 'المرشحون',
  subscribe: 'اشترك',
  planActive: 'الخطة نشطة',
  subscription: 'الاشتراك',
  subscriptionPrice: '٧٩٫٩ درهم / شهر',
  unlockContact: 'افتح بيانات التواصل',
  contactUnlocked: 'تم فتح بيانات التواصل!',
  subscriptionRequired: 'اشترك لفتح بيانات تواصل المرشحين',
  subscribeViaWhatsApp: 'اشترك عبر واتساب',
  subscriptionBody:
    'فتح غير محدود لبيانات التواصل طالما خطتك نشطة. يتم تأكيد الدفع عبر واتساب؛ التفعيل خلال ساعة.',
  subscriptionBullet1: 'فتح غير محدود لجميع المرشحين',
  subscriptionBullet2: 'رقم الهاتف وواتساب',
  subscriptionBullet3: 'إلغاء في أي وقت — بدون رسوم لكل سيرة',
  subscriptionValidUntil: (date) => `صالح حتى ${date}`,
  settings: 'الإعدادات',
  continue: 'متابعة',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  loading: 'جاري التحميل...',
  errorGeneric: 'حدث خطأ. حاول مرة أخرى.',
  noCandidates: 'لا يوجد مرشحون يطابقون الفلاتر',
  noCandidatesHint: 'جرّب إعادة تعيين الفلاتر أو عد لاحقاً لملفات جديدة.',
  resetFilters: 'إعادة تعيين الفلاتر',
  employerOnboarding: 'بيانات الشركة',
  companyName: 'اسم الشركة',
  contactName: 'اسم جهة الاتصال',
  startBrowsing: 'ابدأ التصفح',
  stepOf: (c, t) => `الخطوة ${c} من ${t}`,
  yourPhoto: 'صورتك',
  camera: 'الكاميرا',
  gallery: 'المعرض',
  skipForNow: 'تخطي الآن',
  skipPhotoForNow: 'تخطي الصورة الآن',
  skipPhotoForNowHint: 'يمكنك إضافة صورة لاحقاً. صورة واضحة للوجه تساعد أصحاب العمل على الوثوق بملفك.',
  errPhotoRequired: 'أضف صورة أو اضغط «تخطي الصورة الآن»',
  jobRole: 'المهنة',
  visaStatus: 'حالة التأشيرة',
  nationality: 'الجنسية',
  location: 'الموقع',
  monthlySalary: 'الراتب الشهري (درهم)',
  phoneNumber: 'رقم الهاتف',
  whatsappOptional: 'واتساب (اختياري)',
  yearsExperience: 'سنوات الخبرة',
  languages: 'اللغات',
  uaeExperience: 'هل عملت في الإمارات؟',
  yes: 'نعم',
  no: 'لا',
  previousEmployer: 'شركة سابقة (اختياري)',
  fullName: 'الاسم الكامل',
  availableFrom: 'متاح من',
  submitProfile: 'إرسال الملف',
  saveProfile: 'حفظ الملف',
  required: 'يرجى تعبئة الحقول المطلوبة',
  profilePaused: 'ملفك متوقف — أصحاب العمل لا يمكنهم رؤيتك',
  profileViews: 'مشاهدات الملف',
  profileLive: 'ملفك نشط — أصحاب العمل يمكنهم العثور عليك',
  profileActive: 'الملف نشط',
  editProfile: 'تعديل الملف',
  filters: 'الفلاتر',
  candidatePickRole: 'مهنتك',
  candidatePickRoleHint:
    'اختر المهنة الأنسب لما تبحث عنه. مرتبة أبجدياً.',
  roleSelected: 'المحدد',
  browsePickRole: 'ما المهنة التي توظف لها؟',
  browsePickRoleHint:
    'اختر المهنة أولاً — ثم صفّ حسب الجنسية والموقع والراتب والخبرة وغيرها. استخدم فقط الفلاتر التي تهمك.',
  browseRefine: 'تصفية',
  browseBackToRoles: 'كل المهن',
  candidatesForRole: (role) => role,
  filterOptionalHint: 'كل الفلاتر اختيارية — اتركها فارغة لعرض الجميع في هذه المهنة.',
  filterSalaryRange: 'نطاق الراتب (درهم / شهر)',
  filterExperience: 'الخبرة',
  browseFilterLanguages: 'اللغات',
  filterUaeExp: 'عمل سابقاً في الإمارات',
  filterAny: 'أي',
  salaryMinLabel: 'الحد الأدنى',
  salaryMaxLabel: 'الحد الأعلى',
  salaryMinPlaceholder: 'الحد الأدنى (اختياري)',
  salaryMaxPlaceholder: 'الحد الأعلى (اختياري)',
  addEmirateOnly: (emirate) => `كل ${emirate}`,
  otpPlaceholder: 'رمز من 6 أرقام',
  filterRoles: 'المهنة',
  filterVisa: 'حالة التأشيرة',
  apply: 'تطبيق',
  reset: 'إعادة تعيين',
  filtered: 'مفلتر',
  availableNow: 'متاح الآن',
  enterEmail: 'البريد الإلكتروني',
  email: 'البريد الإلكتروني',
  searchPlaceholder: 'ابحث عن الجنسية...',
  unlockedBadge: 'مفتوح',
  salaryPerMonth: (amount) => `${amount} درهم/شهر`,
  subscribeToUnlock: 'اشترك لفتح الهاتف وواتساب',
  viewSubscription: 'عرض الخطط',
  call: 'اتصال',
  whatsApp: 'واتساب',
  noUnlocksYet: 'لا يوجد فتح بعد',
  noUnlocksHint: 'تصفح المرشحين وافتح بيانات التواصل عندما تكون جاهزاً للتوظيف.',
  devOtpBanner: 'وضع الاختبار: OTP معطّل — بدون رسوم SMS',
  selectLocation: 'اختر الموقع',
  supportWhatsApp: 'الدعم (واتساب)',
  logout: 'تسجيل الخروج',
  english: 'English',
  arabic: 'العربية',
  nationalityLabel: 'الجنسية',
  experienceLabel: 'الخبرة',
  permissionRequired: 'مطلوب إذن الكاميرا أو معرض الصور',
  emailPlaceholder: 'you@example.com',
  back: 'رجوع',
  nationalityPlaceholder: 'ابدأ الكتابة، مثال: سود…',
  nationalityHint: 'اختر من القائمة للحفاظ على توحيد البيانات (مثال: سوداني وليس السودان).',
  locationEmirate: 'الإمارة',
  locationArea: 'المنطقة أو الحي',
  locationAreaHint: 'اختياري — يساعد أصحاب العمل في إيجاد مرشحين قريبين.',
  locationAreaPlaceholder: 'مثال: ديرة، مارينا، خليفة سيتي…',
  locationNoMatch: 'لا توجد منطقة مطابقة — جرّب إملاءً آخر أو اختر الإمارة فقط.',
  locationSelected: 'المحدد',
  locationFilterHint: 'فلترة حسب الإمارة أو حي محدد',
  salaryPlaceholder: 'المبلغ بالدرهم',
  phonePlaceholder: '05x xxx xxxx',
  whatsappPlaceholder: 'نفس الهاتف أو رقم مختلف',
  fullNamePlaceholder: 'كما في الهوية',
  companyPlaceholder: 'اسم الشركة المسجل',
  contactPlaceholder: 'الشخص الذي يمكن التواصل معه',
  datePlaceholder: 'اختر تاريخاً',
  availableFromHint: 'متى يمكنك بدء العمل',
  signInWithPhone: 'تسجيل الدخول بالهاتف بدلاً من ذلك',
  changeEmail: 'تغيير البريد',
  pickDate: 'اختر تاريخ التوفر',
  photoHint: 'صورة واضحة للوجه تساعد أصحاب العمل على الوثوق بملفك',
  tapToAddPhoto: 'اضغط لإضافة صورة',
  popularRoles: 'مهن شائعة',
  moreRoles: 'مهن أخرى',
  moreLanguages: 'لغات أخرى',
  home: 'الرئيسية',
  roleConfirmTitle: 'تأكيد نوع الحساب',
  roleConfirmMessage:
    'لا يمكن التبديل بين باحث عن عمل وصاحب عمل من التطبيق. فريق الدعم يمكنه المساعدة إذا اخترت بالخطأ.',
  roleConfirmAction: (role) => `المتابعة كـ ${role}`,
  roleSelectDifferent: 'اختر نوعاً آخر',
  contactUnlocks: 'فتح بيانات التواصل',
  contactUnlocksHint: 'أصحاب العمل الذين فتحوا هاتفك أو واتساب',
  contactUnlocksEmpty: 'لم يفتح أحد بيانات تواصلك بعد. أبقِ ملفك نشطاً.',
  subStep1Title: 'راسلنا على واتساب',
  subStep1Desc: 'اضغط اشترك — نرسل تفاصيل الدفع',
  subStep2Title: 'نؤكد الدفع',
  subStep2Desc: 'عادة خلال ساعة في أيام العمل',
  subStep3Title: 'الخطة نشطة',
  subStep3Desc: 'فتح غير محدود حتى انتهاء الخطة',
  managePlan: 'الخطة',
  errRole: 'اختر المهنة',
  errVisa: 'اختر حالة التأشيرة',
  errNationality: 'أدخل جنسيتك',
  errNationalityPick: 'اختر جنسية من القائمة',
  errLocation: 'اختر الموقع',
  errAvailableFrom: 'اختر تاريخ بدء التوفر',
  errSalary: 'أدخل الراتب الشهري المتوقع',
  errPhone: 'أدخل رقم الهاتف',
  errExperience: 'اختر سنوات الخبرة',
  errLanguages: 'اختر لغة واحدة على الأقل',
  errUae: 'أخبرنا إن عملت في الإمارات',
  errFullName: 'أدخل الاسم الكامل',
  errCompany: 'أدخل اسم الشركة',
  errContact: 'أدخل اسم جهة الاتصال',
  errEmail: 'أدخل البريد الإلكتروني',
  errEmailInvalid: 'أدخل بريداً إلكترونياً صالحاً',
  draftSaved: 'تم حفظ تقدمك — يمكنك المغادرة والمتابعة لاحقاً.',
  discardDraft: 'حذف التقدم المحفوظ',
  yourRole: 'نوع حسابك',
  wrongRoleHelp:
    'لا يمكن تغيير الدور من التطبيق. إذا اخترت مرشحاً أو صاحب عمل بالخطأ، تواصل معنا عبر واتساب.',
  contactSupportRole: 'الدعم بخصوص نوع حسابي',
  language: 'اللغة',
  accountNotice:
    'حسابك مرتبط بهذا الرقم. استخدم نفس الرقم عند تسجيل الدخول مرة أخرى.',
  popularLanguages: 'لغات شائعة',
  subscriptionPending: 'التفعيل قيد الانتظار',
  subscriptionPendingHint:
    'استلمنا رسالتك على واتساب. عادةً يتم تفعيل الخطة خلال ساعة في أيام العمل.',
  activeAgo: (days) =>
    days === 0 ? 'نشط اليوم' : days === 1 ? 'نشط أمس' : days < 7 ? `نشط منذ ${days} أيام` : days < 30 ? `نشط منذ ${Math.floor(days / 7)} أسابيع` : `نشط منذ ${Math.floor(days / 30)} أشهر`,
  tradeLicense: 'رقم الرخصة التجارية',
  tradeLicensePlaceholder: 'مثال: CN-1234567',
  tradeLicenseHint: 'اختياري — يساعد المرشحين على الوثوق بنشاطك التجاري.',
};

export function strings(lang: Lang): Strings {
  return lang === 'ar' ? ar : en;
}

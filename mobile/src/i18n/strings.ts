export type Lang = 'en' | 'ar';

export interface Strings {
  appName: string;
  splashTagline: string;
  welcomeToTarteb: string;
  otpHelper: string;
  sendOtp: string;
  verify: string;
  otpCode: string;
  enterPhone: string;
  changePhone: string;
  codeSentTo: string;
  signInWithEmail: string;
  selectRole: string;
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
  settings: string;
  continue: string;
  cancel: string;
  confirm: string;
  loading: string;
  errorGeneric: string;
  noCandidates: string;
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
  apply: string;
  reset: string;
  filtered: string;
  availableNow: string;
  enterEmail: string;
}

const en: Strings = {
  appName: 'Tarteb',
  splashTagline: 'Your next job, arranged',
  welcomeToTarteb: 'Welcome to Tarteb',
  otpHelper: "We'll send a 6-digit code",
  sendOtp: 'Send OTP',
  verify: 'Verify',
  otpCode: 'OTP code',
  enterPhone: 'Enter your phone number',
  changePhone: 'Change phone number',
  codeSentTo: 'Code sent to',
  signInWithEmail: 'Sign in with email instead',
  selectRole: 'I am a...',
  roleCandidate: 'Candidate',
  roleEmployer: 'Employer',
  roleCandidateSubtitle: 'List your profile for free',
  roleEmployerSubtitle: 'Browse candidates with a monthly plan',
  browse: 'Browse',
  myUnlocks: 'My Unlocks',
  subscribe: 'Subscribe',
  planActive: 'Plan active',
  subscription: 'Subscription',
  subscriptionPrice: 'AED 39.99 / month',
  unlockContact: 'Unlock contact',
  contactUnlocked: 'Contact unlocked!',
  subscriptionRequired: 'Subscribe to unlock candidate contacts',
  subscribeViaWhatsApp: 'Subscribe via WhatsApp',
  settings: 'Settings',
  continue: 'Continue',
  cancel: 'Cancel',
  confirm: 'Confirm',
  loading: 'Loading...',
  errorGeneric: 'Something went wrong. Try again.',
  noCandidates: 'No candidates match your filters',
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
  apply: 'Apply',
  reset: 'Reset',
  filtered: 'Filtered',
  availableNow: 'Available now',
  enterEmail: 'Email address',
};

const ar: Strings = {
  appName: 'Tarteb',
  splashTagline: 'رتّب شغلك',
  welcomeToTarteb: 'مرحباً بك في ترتّب',
  otpHelper: 'سنرسل رمزاً من 6 أرقام',
  sendOtp: 'إرسال الرمز',
  verify: 'تحقق',
  otpCode: 'رمز التحقق',
  enterPhone: 'أدخل رقم هاتفك',
  changePhone: 'تغيير رقم الهاتف',
  codeSentTo: 'تم إرسال الرمز إلى',
  signInWithEmail: 'تسجيل الدخول بالبريد بدلاً من ذلك',
  selectRole: 'أنا...',
  roleCandidate: 'مرشح',
  roleEmployer: 'صاحب عمل',
  roleCandidateSubtitle: 'أضف ملفك مجاناً',
  roleEmployerSubtitle: 'تصفح المرشحين بخطة شهرية',
  browse: 'تصفح',
  myUnlocks: 'المرشحون المفتوحون',
  subscribe: 'اشترك',
  planActive: 'الخطة نشطة',
  subscription: 'الاشتراك',
  subscriptionPrice: '٣٩٫٩٩ درهم / شهر',
  unlockContact: 'افتح بيانات التواصل',
  contactUnlocked: 'تم فتح بيانات التواصل!',
  subscriptionRequired: 'اشترك لفتح بيانات تواصل المرشحين',
  subscribeViaWhatsApp: 'اشترك عبر واتساب',
  settings: 'الإعدادات',
  continue: 'متابعة',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  loading: 'جاري التحميل...',
  errorGeneric: 'حدث خطأ. حاول مرة أخرى.',
  noCandidates: 'لا يوجد مرشحون يطابقون الفلاتر',
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
  apply: 'تطبيق',
  reset: 'إعادة تعيين',
  filtered: 'مفلتر',
  availableNow: 'متاح الآن',
  enterEmail: 'البريد الإلكتروني',
};

export function strings(lang: Lang): Strings {
  return lang === 'ar' ? ar : en;
}

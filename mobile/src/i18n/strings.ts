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
};

export function strings(lang: Lang): Strings {
  return lang === 'ar' ? ar : en;
}

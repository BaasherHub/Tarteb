import type { Lang } from '@/core/i18n/strings';

export type PrivacySection = { title: string; body: string };

const en: PrivacySection[] = [
  {
    title: 'What we collect',
    body:
      'Phone number for sign-in and contact unlocks; profile details (role, location, visa, salary, photo for candidates; company details for employers); push token if you enable notifications; limited diagnostics in production for reliability.',
  },
  {
    title: 'How we use data',
    body:
      'To authenticate you, match employers with candidates, send OTP and optional push alerts, and keep the service secure.',
  },
  {
    title: 'Sharing',
    body:
      'We do not sell personal data. Data is processed on Supabase and with partners required to run the service (e.g. SMS and messaging providers).',
  },
  {
    title: 'Retention & your choices',
    body:
      'Data is kept while your account is active. You may sign out anytime or email privacy@tarteb.app to request deletion. Denying notifications still lets you use the app.',
  },
  {
    title: 'Children & changes',
    body:
      'Tarteb is not directed at users under 18. We may update this policy in the app. Last updated June 2026. Contact: privacy@tarteb.app',
  },
];

const ar: PrivacySection[] = [
  {
    title: 'ما الذي نجمعه',
    body:
      'رقم الهاتف لتسجيل الدخول وفتح بيانات التواصل؛ بيانات الملف (الدور، الموقع، التأشيرة، الراتب، الصورة للمرشحين؛ بيانات الشركة لأصحاب العمل)؛ رمز الإشعارات إذا فعّلتها؛ بيانات تقنية محدودة في الإنتاج لتحسين الاستقرار.',
  },
  {
    title: 'كيف نستخدم البيانات',
    body:
      'للتحقق من هويتك، ربط أصحاب العمل بالمرشحين، إرسال رمز التحقق والإشعارات الاختيارية، والحفاظ على أمان الخدمة.',
  },
  {
    title: 'المشاركة',
    body:
      'لا نبيع بياناتك الشخصية. تُعالج البيانات على Supabase ومع مزودين ضروريين لتشغيل الخدمة (مثل الرسائل النصية).',
  },
  {
    title: 'الاحتفاظ وخياراتك',
    body:
      'نحتفظ بالبيانات طالما حسابك نشط. يمكنك تسجيل الخروج أو مراسلة privacy@tarteb.app لطلب الحذف. رفض الإشعارات لا يمنع استخدام التطبيق.',
  },
  {
    title: 'الأطفال والتغييرات',
    body:
      'تارتيب غير موجّه لمن هم دون 18 عاماً. قد نحدّث هذه السياسة داخل التطبيق. آخر تحديث: يونيو 2026. للتواصل: privacy@tarteb.app',
  },
];

export function privacyPolicySections(lang: Lang): PrivacySection[] {
  return lang === 'ar' ? ar : en;
}

export type ArabPhoneCountry = {
  id: string;
  dial: string;
  nameEn: string;
  nameAr: string;
  localPlaceholderEn: string;
  localPlaceholderAr: string;
  localMaxLength: number;
};

/** Arab countries plus major Asian expat communities common in the UAE. */
export const ARAB_PHONE_COUNTRIES: readonly ArabPhoneCountry[] = [
  {
    id: 'AE',
    dial: '+971',
    nameEn: 'UAE',
    nameAr: 'الإمارات',
    localPlaceholderEn: '50 123 4567',
    localPlaceholderAr: '50 123 4567',
    localMaxLength: 9,
  },
  {
    id: 'IN',
    dial: '+91',
    nameEn: 'India',
    nameAr: 'الهند',
    localPlaceholderEn: '9XXXX XXXXX',
    localPlaceholderAr: '9XXXX XXXXX',
    localMaxLength: 10,
  },
  {
    id: 'PK',
    dial: '+92',
    nameEn: 'Pakistan',
    nameAr: 'باكستان',
    localPlaceholderEn: '3XX XXX XXXX',
    localPlaceholderAr: '3XX XXX XXXX',
    localMaxLength: 10,
  },
  {
    id: 'BD',
    dial: '+880',
    nameEn: 'Bangladesh',
    nameAr: 'بنغلاديش',
    localPlaceholderEn: '1XXX XXXXXX',
    localPlaceholderAr: '1XXX XXXXXX',
    localMaxLength: 10,
  },
  {
    id: 'PH',
    dial: '+63',
    nameEn: 'Philippines',
    nameAr: 'الفلبين',
    localPlaceholderEn: '9XX XXX XXXX',
    localPlaceholderAr: '9XX XXX XXXX',
    localMaxLength: 10,
  },
  {
    id: 'LK',
    dial: '+94',
    nameEn: 'Sri Lanka',
    nameAr: 'سريلانكا',
    localPlaceholderEn: '7X XXX XXXX',
    localPlaceholderAr: '7X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'NP',
    dial: '+977',
    nameEn: 'Nepal',
    nameAr: 'نيبال',
    localPlaceholderEn: '98XX XXXXX',
    localPlaceholderAr: '98XX XXXXX',
    localMaxLength: 10,
  },
  {
    id: 'AF',
    dial: '+93',
    nameEn: 'Afghanistan',
    nameAr: 'أفغانستان',
    localPlaceholderEn: '7X XXX XXXX',
    localPlaceholderAr: '7X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'ID',
    dial: '+62',
    nameEn: 'Indonesia',
    nameAr: 'إندونيسيا',
    localPlaceholderEn: '8XX XXX XXXX',
    localPlaceholderAr: '8XX XXX XXXX',
    localMaxLength: 11,
  },
  {
    id: 'SA',
    dial: '+966',
    nameEn: 'Saudi Arabia',
    nameAr: 'السعودية',
    localPlaceholderEn: '5X XXX XXXX',
    localPlaceholderAr: '5X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'EG',
    dial: '+20',
    nameEn: 'Egypt',
    nameAr: 'مصر',
    localPlaceholderEn: '10X XXX XXXX',
    localPlaceholderAr: '10X XXX XXXX',
    localMaxLength: 10,
  },
  {
    id: 'JO',
    dial: '+962',
    nameEn: 'Jordan',
    nameAr: 'الأردن',
    localPlaceholderEn: '7X XXX XXXX',
    localPlaceholderAr: '7X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'KW',
    dial: '+965',
    nameEn: 'Kuwait',
    nameAr: 'الكويت',
    localPlaceholderEn: 'XXXX XXXX',
    localPlaceholderAr: 'XXXX XXXX',
    localMaxLength: 8,
  },
  {
    id: 'BH',
    dial: '+973',
    nameEn: 'Bahrain',
    nameAr: 'البحرين',
    localPlaceholderEn: 'XXXX XXXX',
    localPlaceholderAr: 'XXXX XXXX',
    localMaxLength: 8,
  },
  {
    id: 'QA',
    dial: '+974',
    nameEn: 'Qatar',
    nameAr: 'قطر',
    localPlaceholderEn: 'XXXX XXXX',
    localPlaceholderAr: 'XXXX XXXX',
    localMaxLength: 8,
  },
  {
    id: 'OM',
    dial: '+968',
    nameEn: 'Oman',
    nameAr: 'عُمان',
    localPlaceholderEn: 'XXXX XXXX',
    localPlaceholderAr: 'XXXX XXXX',
    localMaxLength: 8,
  },
  {
    id: 'LB',
    dial: '+961',
    nameEn: 'Lebanon',
    nameAr: 'لبنان',
    localPlaceholderEn: 'XX XXX XXX',
    localPlaceholderAr: 'XX XXX XXX',
    localMaxLength: 8,
  },
  {
    id: 'IQ',
    dial: '+964',
    nameEn: 'Iraq',
    nameAr: 'العراق',
    localPlaceholderEn: '7XX XXX XXXX',
    localPlaceholderAr: '7XX XXX XXXX',
    localMaxLength: 10,
  },
  {
    id: 'SY',
    dial: '+963',
    nameEn: 'Syria',
    nameAr: 'سوريا',
    localPlaceholderEn: '9XX XXX XXX',
    localPlaceholderAr: '9XX XXX XXX',
    localMaxLength: 9,
  },
  {
    id: 'YE',
    dial: '+967',
    nameEn: 'Yemen',
    nameAr: 'اليمن',
    localPlaceholderEn: '7XX XXX XXX',
    localPlaceholderAr: '7XX XXX XXX',
    localMaxLength: 9,
  },
  {
    id: 'PS',
    dial: '+970',
    nameEn: 'Palestine',
    nameAr: 'فلسطين',
    localPlaceholderEn: '5X XXX XXXX',
    localPlaceholderAr: '5X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'MA',
    dial: '+212',
    nameEn: 'Morocco',
    nameAr: 'المغرب',
    localPlaceholderEn: '6XX XXX XXX',
    localPlaceholderAr: '6XX XXX XXX',
    localMaxLength: 9,
  },
  {
    id: 'DZ',
    dial: '+213',
    nameEn: 'Algeria',
    nameAr: 'الجزائر',
    localPlaceholderEn: '5XX XX XX XX',
    localPlaceholderAr: '5XX XX XX XX',
    localMaxLength: 9,
  },
  {
    id: 'TN',
    dial: '+216',
    nameEn: 'Tunisia',
    nameAr: 'تونس',
    localPlaceholderEn: 'XX XXX XXX',
    localPlaceholderAr: 'XX XXX XXX',
    localMaxLength: 8,
  },
  {
    id: 'LY',
    dial: '+218',
    nameEn: 'Libya',
    nameAr: 'ليبيا',
    localPlaceholderEn: '9X XXX XXXX',
    localPlaceholderAr: '9X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'SD',
    dial: '+249',
    nameEn: 'Sudan',
    nameAr: 'السودان',
    localPlaceholderEn: '9X XXX XXXX',
    localPlaceholderAr: '9X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'IR',
    dial: '+98',
    nameEn: 'Iran',
    nameAr: 'إيران',
    localPlaceholderEn: '9XX XXX XXXX',
    localPlaceholderAr: '9XX XXX XXXX',
    localMaxLength: 10,
  },
  {
    id: 'CN',
    dial: '+86',
    nameEn: 'China',
    nameAr: 'الصين',
    localPlaceholderEn: '1XX XXXX XXXX',
    localPlaceholderAr: '1XX XXXX XXXX',
    localMaxLength: 11,
  },
  {
    id: 'TH',
    dial: '+66',
    nameEn: 'Thailand',
    nameAr: 'تايلاند',
    localPlaceholderEn: '8X XXX XXXX',
    localPlaceholderAr: '8X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'MY',
    dial: '+60',
    nameEn: 'Malaysia',
    nameAr: 'ماليزيا',
    localPlaceholderEn: '1X XXX XXXX',
    localPlaceholderAr: '1X XXX XXXX',
    localMaxLength: 10,
  },
  {
    id: 'VN',
    dial: '+84',
    nameEn: 'Vietnam',
    nameAr: 'فيتنام',
    localPlaceholderEn: '9X XXX XXXX',
    localPlaceholderAr: '9X XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'MM',
    dial: '+95',
    nameEn: 'Myanmar',
    nameAr: 'ميانمار',
    localPlaceholderEn: '9XX XXX XXXX',
    localPlaceholderAr: '9XX XXX XXXX',
    localMaxLength: 10,
  },
  {
    id: 'KH',
    dial: '+855',
    nameEn: 'Cambodia',
    nameAr: 'كمبوديا',
    localPlaceholderEn: 'XX XXX XXXX',
    localPlaceholderAr: 'XX XXX XXXX',
    localMaxLength: 9,
  },
  {
    id: 'KR',
    dial: '+82',
    nameEn: 'South Korea',
    nameAr: 'كوريا الجنوبية',
    localPlaceholderEn: '10 XXXX XXXX',
    localPlaceholderAr: '10 XXXX XXXX',
    localMaxLength: 10,
  },
  {
    id: 'JP',
    dial: '+81',
    nameEn: 'Japan',
    nameAr: 'اليابان',
    localPlaceholderEn: '90 XXXX XXXX',
    localPlaceholderAr: '90 XXXX XXXX',
    localMaxLength: 10,
  },
] as const;

/** Dial digits without +, longest first for E.164 prefix matching. */
export const AUTH_PHONE_DIAL_PREFIXES: readonly string[] = [
  ...new Set(ARAB_PHONE_COUNTRIES.map((c) => c.dial.slice(1))),
].sort((a, b) => b.length - a.length);

export const DEFAULT_ARAB_PHONE_COUNTRY = ARAB_PHONE_COUNTRIES[0];

export function findArabPhoneCountry(id: string): ArabPhoneCountry {
  return ARAB_PHONE_COUNTRIES.find((c) => c.id === id) ?? DEFAULT_ARAB_PHONE_COUNTRY;
}

export function countryLabel(country: ArabPhoneCountry, lang: 'en' | 'ar'): string {
  return lang === 'ar' ? country.nameAr : country.nameEn;
}

export function localPlaceholder(country: ArabPhoneCountry, lang: 'en' | 'ar'): string {
  return lang === 'ar' ? country.localPlaceholderAr : country.localPlaceholderEn;
}

/** Split a stored E.164 value into country + local digits for the auth phone field. */
export function parseAuthPhoneE164(
  e164: string,
): { country: ArabPhoneCountry; localNumber: string } | null {
  const trimmed = e164.trim();
  if (!trimmed.startsWith('+')) return null;

  const digits = trimmed.slice(1).replace(/\D/g, '');
  if (!digits) return null;

  const sorted = [...ARAB_PHONE_COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  for (const country of sorted) {
    const prefix = country.dial.slice(1);
    if (digits.startsWith(prefix) && digits.length > prefix.length) {
      return { country, localNumber: digits.slice(prefix.length) };
    }
  }

  return null;
}

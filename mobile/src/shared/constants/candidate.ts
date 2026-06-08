export type RoleCategoryId =
  | 'food-beverage'
  | 'cleaning-housekeeping'
  | 'drivers-delivery'
  | 'beauty-wellness'
  | 'security'
  | 'retail-sales'
  | 'construction-trades'
  | 'domestic-help'
  | 'warehouse'
  | 'office-support';

export type RoleCategory = {
  id: RoleCategoryId;
  label: string;
  labelAr: string;
  /** Shorter label for horizontal category chips. */
  shortLabel: string;
  shortLabelAr: string;
  roles: string[];
};

/** Onboarding Step 2 category chips (order matters). */
export const ONBOARDING_ROLE_CATEGORIES: RoleCategory[] = [
  {
    id: 'food-beverage',
    label: 'Food & Beverage',
    labelAr: '╪º┘ä╪ú╪║╪░┘è╪⌐ ┘ê╪º┘ä┘à╪┤╪▒┘ê╪¿╪º╪¬',
    shortLabel: 'Food',
    shortLabelAr: '┘à╪╖╪º╪╣┘à',
    roles: [
      'Barista',
      'Waiter',
      'Waitress',
      'Cook',
      'Kitchen Helper',
      'Commis Chef',
      'Dishwasher',
      'Cashier',
      'Host/Hostess',
    ],
  },
  {
    id: 'cleaning-housekeeping',
    label: 'Cleaning & Housekeeping',
    labelAr: '╪º┘ä┘å╪╕╪º┘ü╪⌐ ┘ê╪º┘ä╪¬╪»╪¿┘è╪▒',
    shortLabel: 'Cleaning',
    shortLabelAr: '┘å╪╕╪º┘ü╪⌐',
    roles: [
      'Office Cleaner',
      'Residential Cleaner',
      'Housekeeper',
      'Laundry Attendant',
      'Window Cleaner',
      'Janitor',
    ],
  },
  {
    id: 'drivers-delivery',
    label: 'Drivers & Delivery',
    labelAr: '╪º┘ä╪│╪º╪ª┘é┘ê┘å ┘ê╪º┘ä╪¬┘ê╪╡┘è┘ä',
    shortLabel: 'Drivers',
    shortLabelAr: '╪│╪º╪ª┘é┘ê┘å',
    roles: [
      'Personal Driver',
      'Delivery Driver',
      'Truck Driver',
      'Heavy Vehicle Driver',
      'Forklift Operator',
      'Courier',
    ],
  },
  {
    id: 'beauty-wellness',
    label: 'Beauty & Wellness',
    labelAr: '╪º┘ä╪¼┘à╪º┘ä ┘ê╪º┘ä╪╣╪º┘ü┘è╪⌐',
    shortLabel: 'Beauty',
    shortLabelAr: '╪¼┘à╪º┘ä',
    roles: [
      'Barber',
      'Hairdresser',
      'Nail Technician',
      'Beautician',
      'Massage Therapist',
      'Spa Attendant',
    ],
  },
  {
    id: 'security',
    label: 'Security',
    labelAr: '╪º┘ä╪ú┘à┘å',
    shortLabel: 'Security',
    shortLabelAr: '╪ú┘à┘å',
    roles: ['Security Guard', 'CCTV Operator', 'Bouncer'],
  },
  {
    id: 'retail-sales',
    label: 'Retail & Sales',
    labelAr: '╪º┘ä╪¬╪¼╪▓╪ª╪⌐ ┘ê╪º┘ä┘à╪¿┘è╪╣╪º╪¬',
    shortLabel: 'Retail',
    shortLabelAr: '╪¬╪¼╪▓╪ª╪⌐',
    roles: [
      'Sales Associate',
      'Retail Cashier',
      'Stock Room Assistant',
      'Visual Merchandiser',
      'Promoter',
      'Event Staff',
      'Usher',
      'Exhibition Staff',
      'Brand Ambassador',
    ],
  },
  {
    id: 'construction-trades',
    label: 'Construction & Trades',
    labelAr: '╪º┘ä╪¿┘å╪º╪í ┘ê╪º┘ä┘à┘ç┘å',
    shortLabel: 'Trades',
    shortLabelAr: '┘à┘ç┘å',
    roles: [
      'General Laborer',
      'Painter',
      'Plumber',
      'Electrician',
      'Electrician Helper',
      'AC Technician',
      'Carpenter Helper',
      'Mason',
      'Tiler',
      'Handyman',
      'Lift Technician',
      'Facilities Maintenance',
    ],
  },
  {
    id: 'domestic-help',
    label: 'Domestic Help',
    labelAr: '╪º┘ä╪«╪»┘à╪⌐ ╪º┘ä┘à┘å╪▓┘ä┘è╪⌐',
    shortLabel: 'Domestic',
    shortLabelAr: '┘à┘å╪▓┘ä┘è',
    roles: [
      'Nanny/Babysitter',
      'Home Cook',
      'Housemaid',
      'Gardener',
      'Caretaker',
      'Nursing Assistant',
      'Patient Care Assistant',
      'Hospital Orderly',
    ],
  },
  {
    id: 'warehouse',
    label: 'Warehouse',
    labelAr: '╪º┘ä┘à╪│╪¬┘ê╪»╪╣╪º╪¬',
    shortLabel: 'Warehouse',
    shortLabelAr: '┘à╪│╪¬┘ê╪»╪╣',
    roles: [
      'Warehouse Worker',
      'Storekeeper',
      'Packer',
      'Picker',
      'Loading Staff',
      'Inventory Clerk',
    ],
  },
  {
    id: 'office-support',
    label: 'Office Support',
    labelAr: '╪º┘ä╪»╪╣┘à ╪º┘ä┘à┘â╪¬╪¿┘è',
    shortLabel: 'Office',
    shortLabelAr: '┘à┘â╪¬╪¿',
    roles: [
      'Office Boy',
      'Tea Boy/Girl',
      'Receptionist',
      'Data Entry Clerk',
      'Runner/Peon',
      'PRO Assistant',
      'Pharmacy Helper',
    ],
  },
];

/** Full taxonomy including categories not shown as onboarding chips. */
export const ROLE_CATEGORIES: RoleCategory[] = ONBOARDING_ROLE_CATEGORIES;

export function getRoleCategoryLabel(
  category: RoleCategory,
  lang: 'en' | 'ar',
): string {
  return lang === 'ar' ? category.labelAr : category.label;
}

export function getRoleCategoryChipLabel(
  category: RoleCategory,
  lang: 'en' | 'ar',
): string {
  return lang === 'ar' ? category.shortLabelAr : category.shortLabel;
}

export function getCategoryById(id: RoleCategoryId): RoleCategory | undefined {
  return ONBOARDING_ROLE_CATEGORIES.find((c) => c.id === id);
}

const roleToCategoryId = new Map<string, RoleCategoryId>(
  ONBOARDING_ROLE_CATEGORIES.flatMap((c) =>
    c.roles.map((role) => [role, c.id] as const),
  ),
);

export function getRoleCategoryId(role: string): RoleCategoryId | undefined {
  return roleToCategoryId.get(role);
}

export const CANDIDATE_ROLES: string[] = [
  ...new Set(ONBOARDING_ROLE_CATEGORIES.flatMap((c) => c.roles)),
];

export const SORTED_CANDIDATE_ROLES = [...CANDIDATE_ROLES].sort((a, b) =>
  a.localeCompare(b),
);

export const VISA_STATUSES = [
  'Employment Visa',
  'Visit Visa',
  'Own Visa',
  'Cancelled Visa',
];

/** @deprecated Use UAE_EMIRATES from uaeLocations.ts */
export { UAE_EMIRATES as LOCATIONS } from '@/shared/constants/uaeLocations';

/** All languages relevant to the UAE workforce ΓÇö shown in full, no "more" toggle. */
export const LANGUAGE_OPTIONS = [
  'English',
  'Arabic',
  'Hindi',
  'Urdu',
  'Tagalog',
  'Bengali',
  'Malayalam',
  'Tamil',
  'Nepali',
  'Sinhala',
  'Punjabi',
  'Pashto',
  'French',
  'Russian',
  'Mandarin',
];

/** @deprecated Use LANGUAGE_OPTIONS directly */
export const POPULAR_LANGUAGES = LANGUAGE_OPTIONS;

export const CORE_LANGUAGE_OPTIONS = [
  'English',
  'Arabic',
  'Hindi',
  'Urdu',
  'Tagalog',
  'Bengali',
  'Malayalam',
] as const;

const coreLanguageSet = new Set<string>(CORE_LANGUAGE_OPTIONS);

export const MORE_LANGUAGE_OPTIONS = LANGUAGE_OPTIONS.filter((l) => !coreLanguageSet.has(l));

/** Experience buckets (stored `years` value). Used in onboarding + employer filters. */
export const EXPERIENCE_OPTIONS = [
  { years: 0 },
  { years: 1 },
  { years: 2 },
  { years: 4 },
  { years: 5 },
] as const;

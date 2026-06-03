export type RoleCategory = {
  label: string;
  labelAr: string;
  roles: string[];
};

export const ROLE_CATEGORIES: RoleCategory[] = [
  {
    label: 'Food & Beverage',
    labelAr: 'الأغذية والمشروبات',
    roles: [
      'Barista', 'Waiter', 'Waitress', 'Cook', 'Kitchen Helper',
      'Commis Chef', 'Dishwasher', 'Cashier', 'Host/Hostess',
    ],
  },
  {
    label: 'Retail & Sales',
    labelAr: 'التجزئة والمبيعات',
    roles: [
      'Sales Associate', 'Retail Cashier', 'Stock Room Assistant',
      'Visual Merchandiser', 'Promoter',
    ],
  },
  {
    label: 'Cleaning & Facility',
    labelAr: 'النظافة والمرافق',
    roles: [
      'Office Cleaner', 'Residential Cleaner', 'Housekeeper',
      'Laundry Attendant', 'Window Cleaner', 'Janitor',
    ],
  },
  {
    label: 'Drivers & Transport',
    labelAr: 'السائقون والنقل',
    roles: [
      'Personal Driver', 'Delivery Driver', 'Truck Driver',
      'Heavy Vehicle Driver', 'Forklift Operator', 'Courier',
    ],
  },
  {
    label: 'Domestic & Personal',
    labelAr: 'الخدمات المنزلية',
    roles: [
      'Nanny/Babysitter', 'Home Cook', 'Housemaid',
      'Gardener', 'Caretaker',
    ],
  },
  {
    label: 'Warehouse & Logistics',
    labelAr: 'المستودعات والخدمات اللوجستية',
    roles: [
      'Warehouse Worker', 'Storekeeper', 'Packer',
      'Picker', 'Loading Staff', 'Inventory Clerk',
    ],
  },
  {
    label: 'Security',
    labelAr: 'الأمن',
    roles: ['Security Guard', 'CCTV Operator', 'Bouncer'],
  },
  {
    label: 'Construction & Trades',
    labelAr: 'البناء والمهن',
    roles: [
      'General Laborer', 'Painter', 'Plumber', 'Electrician Helper',
      'AC Technician', 'Carpenter Helper', 'Mason', 'Tiler', 'Handyman',
    ],
  },
  {
    label: 'Office Support',
    labelAr: 'الدعم المكتبي',
    roles: [
      'Office Boy', 'Tea Boy/Girl', 'Receptionist',
      'Data Entry Clerk', 'Runner/Peon', 'PRO Assistant',
    ],
  },
  {
    label: 'Beauty & Wellness',
    labelAr: 'الجمال والعافية',
    roles: [
      'Barber', 'Hairdresser', 'Nail Technician',
      'Beautician', 'Massage Therapist', 'Spa Attendant',
    ],
  },
  {
    label: 'Events & Promotions',
    labelAr: 'الفعاليات والترويج',
    roles: ['Event Staff', 'Usher', 'Exhibition Staff', 'Brand Ambassador'],
  },
  {
    label: 'Healthcare Support',
    labelAr: 'الدعم الصحي',
    roles: [
      'Nursing Assistant', 'Hospital Orderly',
      'Patient Care Assistant', 'Pharmacy Helper',
    ],
  },
  {
    label: 'Maintenance',
    labelAr: 'الصيانة',
    roles: [
      'AC Technician', 'Plumber', 'Electrician',
      'Lift Technician', 'Facilities Maintenance',
    ],
  },
];

export const CANDIDATE_ROLES: string[] = [
  ...new Set(ROLE_CATEGORIES.flatMap((c) => c.roles)),
];

export const SORTED_CANDIDATE_ROLES = [...CANDIDATE_ROLES].sort((a, b) =>
  a.localeCompare(b),
);

export const POPULAR_ROLES = [
  'Barista', 'Waiter', 'Personal Driver', 'Office Cleaner',
  'Security Guard', 'Retail Cashier', 'Cook', 'Housekeeper',
];

export const VISA_STATUSES = [
  'Employment Visa', 'Visit Visa', 'Own Visa', 'Cancelled Visa',
];

/** @deprecated Use UAE_EMIRATES from uaeLocations.ts */
export { UAE_EMIRATES as LOCATIONS } from './uaeLocations';

/** All languages relevant to the UAE workforce — shown in full, no "more" toggle. */
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
  'Other',
];

/** @deprecated Use LANGUAGE_OPTIONS directly */
export const POPULAR_LANGUAGES = LANGUAGE_OPTIONS;

export const EXPERIENCE_OPTIONS = [
  { label: 'No experience', years: 0 },
  { label: '1 year', years: 1 },
  { label: '2-3 years', years: 2 },
  { label: '4-5 years', years: 4 },
  { label: '5+ years', years: 5 },
];

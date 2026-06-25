import { sanitizeLanguages } from '@/shared/utils/languages';

export type CompletionItem = {
  id: string;
  weight: number;
  done: boolean;
};

export type ProfileCompletionResult = {
  percent: number;
  items: CompletionItem[];
  nextItem: CompletionItem | null;
};

export type CandidateCompletionRoute =
  | { kind: 'onboarding'; startStep: number }
  | { kind: 'additionalRoles' };

function sum(items: CompletionItem[]): { earned: number; total: number } {
  let earned = 0;
  let total = 0;
  for (const i of items) {
    total += i.weight;
    if (i.done) earned += i.weight;
  }
  return { earned, total };
}

export function computeCompletion(items: CompletionItem[]): ProfileCompletionResult {
  const { earned, total } = sum(items);
  const percent = total > 0 ? Math.round((earned / total) * 100) : 0;
  const nextItem = items.find((i) => !i.done) ?? null;
  return { percent: Math.min(100, percent), items, nextItem };
}

/** Photo = 40%; eight profile fields share 60%. */
export function candidateProfileCompletion(
  row: Record<string, unknown>,
): ProfileCompletionResult {
  const languageList = sanitizeLanguages(row.languages);
  const experienceDone =
    row.years_experience !== undefined &&
    row.years_experience !== null &&
    languageList.length > 0;

  const extraRoles = row.additional_roles;
  const hasAlsoRoles =
    Array.isArray(extraRoles) && extraRoles.filter((r) => Boolean(r)).length > 0;

  const items: CompletionItem[] = [
    { id: 'photo', weight: 40, done: Boolean(row.photo_url) },
    { id: 'role', weight: 8, done: Boolean(row.role) },
    { id: 'alsoRoles', weight: 5, done: hasAlsoRoles },
    { id: 'visa', weight: 8, done: Boolean(row.visa_status) },
    { id: 'nationality', weight: 8, done: Boolean(row.nationality) },
    { id: 'location', weight: 8, done: Boolean(row.location) },
    {
      id: 'salary',
      weight: 8,
      done:
        row.current_salary != null &&
        row.current_salary !== '' &&
        row.salary_expectation != null &&
        row.salary_expectation !== '',
    },
    { id: 'phone', weight: 8, done: Boolean(row.phone) },
    { id: 'name', weight: 5, done: Boolean(String(row.name ?? '').trim()) },
    { id: 'available', weight: 5, done: Boolean(row.available_from) },
    { id: 'experience', weight: 5, done: experienceDone },
  ];

  return computeCompletion(items);
}

export function candidateCompletionRoute(
  itemId: string | undefined,
): CandidateCompletionRoute {
  switch (itemId) {
    case 'photo':
      return { kind: 'onboarding', startStep: 1 };
    case 'role':
      return { kind: 'onboarding', startStep: 2 };
    case 'name':
    case 'nationality':
    case 'location':
    case 'phone':
      return { kind: 'onboarding', startStep: 3 };
    case 'visa':
    case 'salary':
      return { kind: 'onboarding', startStep: 4 };
    case 'available':
    case 'experience':
      return { kind: 'onboarding', startStep: 5 };
    case 'alsoRoles':
      return { kind: 'additionalRoles' };
    default:
      return { kind: 'onboarding', startStep: 1 };
  }
}

/** Employer company profile completion. */
export function employerProfileCompletion(
  row: Record<string, unknown>,
): ProfileCompletionResult {
  const items: CompletionItem[] = [
    { id: 'company', weight: 30, done: Boolean(String(row.company_name ?? '').trim()) },
    { id: 'contact', weight: 20, done: Boolean(String(row.contact_name ?? '').trim()) },
    { id: 'phone', weight: 20, done: Boolean(row.phone) },
    { id: 'email', weight: 15, done: Boolean(String(row.email ?? '').trim()) },
    { id: 'location', weight: 15, done: Boolean(row.location) },
  ];
  return computeCompletion(items);
}

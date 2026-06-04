import { supabase } from '@/core/lib/supabase';

export const PAGE_SIZE = 20;
export const SALARY_FILTER_MAX = 10000;

export type BrowseFilters = {
  roles: string[];
  visaStatuses: string[];
  locations: string[];
  salaryMin: number;
  salaryMax: number;
  availableNow: boolean;
  nationalitySearch: string;
  experienceYears: number[];
  languages: string[];
  /** null = do not filter; true/false = filter UAE experience */
  uaeExperience: boolean | null;
};

export const emptyFilters: BrowseFilters = {
  roles: [],
  visaStatuses: [],
  locations: [],
  salaryMin: 0,
  salaryMax: SALARY_FILTER_MAX,
  availableNow: false,
  nationalitySearch: '',
  experienceYears: [],
  languages: [],
  uaeExperience: null,
};

export function filtersForRole(role: string): BrowseFilters {
  return { ...emptyFilters, roles: [role] };
}

export function hasRefineFilters(filters: BrowseFilters): boolean {
  return (
    filters.visaStatuses.length > 0 ||
    filters.locations.length > 0 ||
    filters.availableNow ||
    filters.nationalitySearch.trim().length > 0 ||
    filters.salaryMin > 0 ||
    filters.salaryMax < SALARY_FILTER_MAX ||
    filters.experienceYears.length > 0 ||
    filters.languages.length > 0 ||
    filters.uaeExperience !== null
  );
}

/** Returns a map of role → active candidate count for the role picker. */
export async function fetchRoleCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('candidates')
    .select('role')
    .eq('is_active', true);

  if (error || !data) return {};

  return data.reduce<Record<string, number>>((acc, row) => {
    const role = row.role as string;
    acc[role] = (acc[role] ?? 0) + 1;
    return acc;
  }, {});
}

export async function fetchCandidatesPage(
  filters: BrowseFilters,
  page: number,
): Promise<Record<string, unknown>[]> {
  let query = supabase.from('candidate_browse').select('*');

  if (filters.roles.length) query = query.in('role', filters.roles);
  if (filters.visaStatuses.length) query = query.in('visa_status', filters.visaStatuses);
  if (filters.locations.length) {
    const clauses: string[] = [];
    for (const loc of filters.locations) {
      if (loc.includes(' — ')) {
        clauses.push(`location.eq.${loc}`);
      } else {
        clauses.push(`location.eq.${loc}`, `location.ilike.${loc} —%`);
      }
    }
    query = query.or(clauses.join(','));
  }
  if (filters.nationalitySearch.trim()) {
    query = query.ilike('nationality', filters.nationalitySearch.trim());
  }
  if (filters.salaryMin > 0) {
    query = query.gte('salary_expectation', Math.round(filters.salaryMin));
  }
  if (filters.salaryMax < SALARY_FILTER_MAX) {
    query = query.lte('salary_expectation', Math.round(filters.salaryMax));
  }
  if (filters.availableNow) {
    const today = new Date().toISOString().slice(0, 10);
    query = query.lte('available_from', today);
  }
  if (filters.experienceYears.length) {
    query = query.in('years_experience', filters.experienceYears);
  }
  if (filters.languages.length) {
    query = query.overlaps('languages', filters.languages);
  }
  if (filters.uaeExperience !== null) {
    query = query.eq('uae_experience', filters.uaeExperience);
  }

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await query
    .order('last_active_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return (data ?? []) as Record<string, unknown>[];
}



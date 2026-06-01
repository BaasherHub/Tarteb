import { supabase } from '../lib/supabase';

export const PAGE_SIZE = 20;

export type BrowseFilters = {
  roles: string[];
  visaStatuses: string[];
  locations: string[];
  salaryMin: number;
  salaryMax: number;
  availableNow: boolean;
  nationalitySearch: string;
};

export const emptyFilters: BrowseFilters = {
  roles: [],
  visaStatuses: [],
  locations: [],
  salaryMin: 0,
  salaryMax: 10000,
  availableNow: false,
  nationalitySearch: '',
};

export async function fetchCandidatesPage(
  filters: BrowseFilters,
  page: number,
): Promise<Record<string, unknown>[]> {
  let query = supabase.from('candidate_browse').select('*');

  if (filters.roles.length) query = query.in('role', filters.roles);
  if (filters.visaStatuses.length) query = query.in('visa_status', filters.visaStatuses);
  if (filters.locations.length) query = query.in('location', filters.locations);
  if (filters.salaryMin > 0) query = query.gte('salary_expectation', Math.round(filters.salaryMin));
  if (filters.salaryMax < 10000) query = query.lte('salary_expectation', Math.round(filters.salaryMax));
  if (filters.availableNow) {
    const today = new Date().toISOString().slice(0, 10);
    query = query.lte('available_from', today);
  }
  if (filters.nationalitySearch.trim()) {
    query = query.ilike('nationality', `%${filters.nationalitySearch.trim()}%`);
  }

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return (data ?? []) as Record<string, unknown>[];
}

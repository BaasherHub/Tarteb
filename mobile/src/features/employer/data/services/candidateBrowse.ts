import { api } from '@/core/lib/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { employerKeys } from '@/features/employer/data/employerQueryKeys';
import {
  readBrowseCache,
  writeBrowseCache,
} from '@/features/employer/data/services/browseCache';
import { getErrorMessage } from '@/shared/utils/errors';
import { SALARY_FILTER_MAX } from '@/features/employer/data/services/candidateBrowseFilters';
export {
  emptyFilters,
  filtersForRole,
  hasRefineFilters,
  SALARY_FILTER_MAX,
  type BrowseFilters,
} from '@/features/employer/data/services/candidateBrowseFilters';
import type { BrowseFilters } from '@/features/employer/data/services/candidateBrowseFilters';

export const PAGE_SIZE = 20;

export async function fetchRoleCounts(): Promise<Record<string, number>> {
  const { roles } = await api.browse.roleCounts();
  return roles.reduce<Record<string, number>>((acc, { role, count }) => {
    if (role) acc[role] = Number(count);
    return acc;
  }, {});
}

export function useRoleCounts() {
  return useQuery({
    queryKey: employerKeys.roleCounts(),
    queryFn: fetchRoleCounts,
    staleTime: 5 * 60 * 1000,
  });
}

export type BrowsePageResult = {
  items: Record<string, unknown>[];
  fromCache: boolean;
};

async function fetchBrowsePage(
  filters: BrowseFilters,
  page: number,
): Promise<BrowsePageResult> {
  try {
    const items = await fetchCandidatesPage(filters, page);
    if (page === 1) void writeBrowseCache(filters, items);
    return { items, fromCache: false };
  } catch (e) {
    if (page === 1) {
      const cached = await readBrowseCache(filters);
      if (cached?.length) return { items: cached, fromCache: true };
    }
    throw e;
  }
}

export function useBrowseCandidates(filters: BrowseFilters | null, errorLabel: string) {
  return useInfiniteQuery({
    queryKey: filters ? employerKeys.browse(filters) : ['employer', 'browse', 'idle'],
    queryFn: async ({ pageParam }) => {
      try {
        return await fetchBrowsePage(filters!, pageParam);
      } catch (e) {
        throw new Error(getErrorMessage(e, errorLabel));
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.fromCache) return undefined;
      return lastPage.items.length >= PAGE_SIZE ? lastPageParam + 1 : undefined;
    },
    enabled: filters != null,
  });
}

export async function fetchCandidatesPage(
  filters: BrowseFilters,
  page: number,
): Promise<Record<string, unknown>[]> {
  const { candidates } = await api.browse.candidates(
    {
      roles: filters.roles,
      visaStatuses: filters.visaStatuses,
      locations: filters.locations,
      salaryMin: filters.salaryMin,
      salaryMax: filters.salaryMax < SALARY_FILTER_MAX ? filters.salaryMax : null,
      availableNow: filters.availableNow,
      nationalitySearch: filters.nationalitySearch,
      experienceYears: filters.experienceYears,
      languages: filters.languages,
      uaeExperience: filters.uaeExperience,
      limit: PAGE_SIZE,
    },
    page,
  );
  return candidates;
}

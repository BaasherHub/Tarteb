import type { BrowseFilters } from '@/features/employer/data/services/candidateBrowse';

export const employerKeys = {
  all: ['employer'] as const,
  roleCounts: () => [...employerKeys.all, 'roleCounts'] as const,
  browse: (filters: BrowseFilters) =>
    [...employerKeys.all, 'browse', JSON.stringify(filters)] as const,
  candidate: (id: string) => [...employerKeys.all, 'candidate', id] as const,
  unlockStatus: (id: string) => [...employerKeys.all, 'unlockStatus', id] as const,
  unlocks: () => [...employerKeys.all, 'unlocks'] as const,
};

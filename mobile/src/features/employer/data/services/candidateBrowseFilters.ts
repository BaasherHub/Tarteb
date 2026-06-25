export const SALARY_FILTER_MAX = 25000;

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

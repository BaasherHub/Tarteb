import { describe, expect, it } from 'vitest';
import {
  SALARY_FILTER_MAX,
  emptyFilters,
  filtersForRole,
  hasRefineFilters,
} from './candidateBrowseFilters';

describe('filtersForRole', () => {
  it('sets the role and keeps other filters at defaults', () => {
    const filters = filtersForRole('AC Technician');

    expect(filters.roles).toEqual(['AC Technician']);
    expect(filters).toMatchObject({
      visaStatuses: [],
      locations: [],
      salaryMin: 0,
      salaryMax: SALARY_FILTER_MAX,
      availableNow: false,
      nationalitySearch: '',
      experienceYears: [],
      languages: [],
      uaeExperience: null,
    });
  });
});

describe('hasRefineFilters', () => {
  it('returns false for empty filters', () => {
    expect(hasRefineFilters(emptyFilters)).toBe(false);
  });

  it('returns false when only a role is selected', () => {
    expect(hasRefineFilters(filtersForRole('Chef'))).toBe(false);
  });

  it.each([
    ['visaStatuses', { ...emptyFilters, visaStatuses: ['visit'] }],
    ['locations', { ...emptyFilters, locations: ['Dubai'] }],
    ['availableNow', { ...emptyFilters, availableNow: true }],
    ['nationalitySearch', { ...emptyFilters, nationalitySearch: 'Indian' }],
    ['salaryMin', { ...emptyFilters, salaryMin: 3000 }],
    ['salaryMax', { ...emptyFilters, salaryMax: 8000 }],
    ['experienceYears', { ...emptyFilters, experienceYears: [5] }],
    ['languages', { ...emptyFilters, languages: ['English'] }],
    ['uaeExperience true', { ...emptyFilters, uaeExperience: true }],
    ['uaeExperience false', { ...emptyFilters, uaeExperience: false }],
  ])('returns true when %s is set', (_label, filters) => {
    expect(hasRefineFilters(filters)).toBe(true);
  });

  it('ignores whitespace-only nationality search', () => {
    expect(hasRefineFilters({ ...emptyFilters, nationalitySearch: '   ' })).toBe(false);
  });
});

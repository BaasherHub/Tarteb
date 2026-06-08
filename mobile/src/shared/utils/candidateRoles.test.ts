import { describe, expect, it } from 'vitest';
import {
  candidateMatchesAnyHiringRole,
  matchHiringRoleFilter,
  normalizeAdditionalRoles,
  parseCandidateRoles,
  postgrestRoleOrFilter,
  toggleAdditionalRole,
} from './candidateRoles';

describe('parseCandidateRoles', () => {
  it('parses primary and additional roles', () => {
    expect(
      parseCandidateRoles({
        role: 'Barista',
        additional_roles: ['Waiter', 'Barista'],
      }),
    ).toEqual({
      primary: 'Barista',
      additional: ['Waiter'],
      all: ['Barista', 'Waiter'],
    });
  });

  it('returns null when primary role is missing', () => {
    expect(parseCandidateRoles({ role: '' })).toBeNull();
  });
});

describe('normalizeAdditionalRoles', () => {
  it('dedupes, drops primary, and caps at two roles', () => {
    expect(
      normalizeAdditionalRoles('Chef', ['Waiter', 'Chef', 'Waiter', 'Cook', 'Host']),
    ).toEqual(['Waiter', 'Cook']);
  });
});

describe('toggleAdditionalRole', () => {
  it('adds and removes secondary roles up to the cap', () => {
    expect(toggleAdditionalRole('Chef', [], 'Waiter')).toEqual(['Waiter']);
    expect(toggleAdditionalRole('Chef', ['Waiter'], 'Waiter')).toEqual([]);
    expect(toggleAdditionalRole('Chef', ['Waiter', 'Cook'], 'Host')).toEqual([
      'Waiter',
      'Cook',
    ]);
    expect(toggleAdditionalRole('Chef', [], 'Chef')).toEqual([]);
  });
});

describe('matchHiringRoleFilter', () => {
  it('matches primary and additional hiring roles', () => {
    const row = { role: 'Barista', additional_roles: ['Waiter'] };
    expect(matchHiringRoleFilter(row, 'Barista')).toBe('primary');
    expect(matchHiringRoleFilter(row, 'Waiter')).toBe('additional');
    expect(matchHiringRoleFilter(row, 'Chef')).toBeNull();
  });
});

describe('candidateMatchesAnyHiringRole', () => {
  it('returns true when no hiring roles are selected', () => {
    expect(candidateMatchesAnyHiringRole({ role: 'Barista' }, [])).toBe(true);
  });

  it('returns true when any hiring role matches', () => {
    expect(
      candidateMatchesAnyHiringRole(
        { role: 'Barista', additional_roles: ['Waiter'] },
        ['Chef', 'Waiter'],
      ),
    ).toBe(true);
  });
});

describe('postgrestRoleOrFilter', () => {
  it('builds OR clauses for primary and additional roles', () => {
    expect(postgrestRoleOrFilter(['Barista'])).toBe(
      'role.eq.Barista,additional_roles.cs.{Barista}',
    );
  });

  it('quotes values with special characters', () => {
    expect(postgrestRoleOrFilter(['Host/Hostess'])).toBe(
      'role.eq."Host/Hostess",additional_roles.cs.{"Host/Hostess"}',
    );
  });
});

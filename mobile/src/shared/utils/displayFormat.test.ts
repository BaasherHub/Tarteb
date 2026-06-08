import { describe, expect, it } from 'vitest';
import { formatDisplayName, formatNationalityDisplay } from './displayFormat';

describe('formatDisplayName', () => {
  it('title-cases each word', () => {
    expect(formatDisplayName('ahmed al mansoori')).toBe('Ahmed Al Mansoori');
  });

  it('collapses doubled tokens', () => {
    expect(formatDisplayName('IndianIndian')).toBe('Indian');
  });

  it('returns empty string for blank input', () => {
    expect(formatDisplayName('   ')).toBe('');
  });
});

describe('formatNationalityDisplay', () => {
  it('resolves known nationality aliases', () => {
    expect(formatNationalityDisplay('indian')).toBe('Indian');
  });

  it('fixes doubled demonyms from the nationality list', () => {
    expect(formatNationalityDisplay('FilipinoFilipino')).toBe('Filipino');
  });

  it('title-cases unknown values', () => {
    expect(formatNationalityDisplay('some place')).toBe('Some Place');
  });
});

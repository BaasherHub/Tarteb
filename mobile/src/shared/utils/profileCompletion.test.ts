import { describe, expect, it } from 'vitest';
import {
  candidateCompletionRoute,
  candidateProfileCompletion,
} from './profileCompletion';

describe('candidateCompletionRoute', () => {
  it('routes each missing candidate completion item to the correct editor', () => {
    expect(candidateCompletionRoute('photo')).toEqual({ kind: 'onboarding', startStep: 1 });
    expect(candidateCompletionRoute('role')).toEqual({ kind: 'onboarding', startStep: 2 });
    expect(candidateCompletionRoute('location')).toEqual({ kind: 'onboarding', startStep: 3 });
    expect(candidateCompletionRoute('salary')).toEqual({ kind: 'onboarding', startStep: 4 });
    expect(candidateCompletionRoute('available')).toEqual({ kind: 'onboarding', startStep: 5 });
    expect(candidateCompletionRoute('experience')).toEqual({ kind: 'onboarding', startStep: 5 });
    expect(candidateCompletionRoute('alsoRoles')).toEqual({ kind: 'additionalRoles' });
  });

  it('sends the availability-date completion prompt to final onboarding step', () => {
    const completion = candidateProfileCompletion({
      photo_url: 'https://example.com/photo.jpg',
      role: 'Barista',
      additional_roles: ['Cashier'],
      visa_status: 'own_visa',
      nationality: 'India',
      location: 'Dubai — Deira',
      current_salary: 2500,
      salary_expectation: 3000,
      phone: '+971501234567',
      name: 'Test Candidate',
      years_experience: 1,
      languages: ['English'],
      available_from: null,
    });

    expect(completion.nextItem?.id).toBe('available');
    expect(candidateCompletionRoute(completion.nextItem?.id)).toEqual({
      kind: 'onboarding',
      startStep: 5,
    });
  });
});

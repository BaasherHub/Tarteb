import { describe, expect, it } from 'vitest';
import { parseCandidateUpsertPayload } from './candidateProfile';

const validPayload = {
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Ahmed Ali',
  photo_url: 'https://example.com/photo.jpg',
  role: 'Barista',
  additional_roles: [] as string[],
  visa_status: 'Employment Visa',
  nationality: 'Indian',
  current_salary: 3000,
  salary_expectation: 4000,
  available_from: '2026-06-01',
  location: 'Dubai — Marina',
  phone: '+971501234567',
  whatsapp: null,
  years_experience: 2,
  languages: ['English', 'Arabic'],
  uae_experience: null,
  previous_employer: null,
  is_active: true as const,
};

describe('parseCandidateUpsertPayload', () => {
  it('accepts a valid candidate upsert payload', () => {
    expect(parseCandidateUpsertPayload(validPayload)).toEqual(validPayload);
  });

  it('rejects an invalid role', () => {
    expect(() =>
      parseCandidateUpsertPayload({ ...validPayload, role: 'Not A Real Role' }),
    ).toThrow();
  });

  it('rejects an invalid phone', () => {
    expect(() => parseCandidateUpsertPayload({ ...validPayload, phone: '050123' })).toThrow();
  });

  it('rejects empty languages', () => {
    expect(() => parseCandidateUpsertPayload({ ...validPayload, languages: [] })).toThrow();
  });
});

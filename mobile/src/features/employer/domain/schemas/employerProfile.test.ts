import { describe, expect, it } from 'vitest';
import { parseEmployerProfilePayload } from './employerProfile';

const validPayload = {
  company_name: 'Acme LLC',
  contact_name: 'Sara Khan',
  phone: '+971501234567',
  email: 'sara@acme.ae',
  location: 'Dubai — Business Bay',
  trade_license: null,
};

describe('parseEmployerProfilePayload', () => {
  it('accepts a valid employer profile payload', () => {
    expect(parseEmployerProfilePayload(validPayload)).toEqual(validPayload);
  });

  it('rejects missing email', () => {
    expect(() => parseEmployerProfilePayload({ ...validPayload, email: '' })).toThrow();
  });

  it('rejects invalid phone', () => {
    expect(() => parseEmployerProfilePayload({ ...validPayload, phone: '123' })).toThrow();
  });
});

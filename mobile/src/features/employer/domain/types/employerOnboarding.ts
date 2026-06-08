import { normalizeE164 } from '@/shared/utils/phone';

export type EmployerOnboardingData = {
  employerId?: string;
  companyName: string;
  tradeLicense: string;
  contactName: string;
  phone: string;
  email: string;
  location: string;
};

export const emptyEmployerOnboardingData = (): EmployerOnboardingData => ({
  companyName: '',
  tradeLicense: '',
  contactName: '',
  phone: '',
  email: '',
  location: '',
});

export function employerFromRow(row: Record<string, unknown>): EmployerOnboardingData {
  const phone = row.phone ? String(row.phone) : '';
  return {
    employerId: row.id as string | undefined,
    companyName: String(row.company_name ?? ''),
    tradeLicense: String(row.trade_license ?? ''),
    contactName: String(row.contact_name ?? ''),
    phone: phone ? normalizeE164(phone) : '',
    email: String(row.email ?? ''),
    location: String(row.location ?? ''),
  };
}

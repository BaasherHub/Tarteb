import {
  normalizeAdditionalRoles,
  parseAdditionalRoles,
} from '@/shared/utils/candidateRoles';
import { sanitizeLanguages } from '@/shared/utils/languages';

export type CandidateOnboardingData = {
  photoUrl?: string | null;
  role?: string;
  additionalRoles: string[];
  visaStatus?: string;
  currentSalary?: number;
  salaryExpectation?: number;
  location?: string;
  phone?: string;
  whatsapp?: string | null;
  availableFrom?: string;
  nationality?: string;
  name?: string;
  candidateId?: string;
  yearsExperience?: number;
  languages: string[];
};

export const emptyOnboardingData = (): CandidateOnboardingData => ({
  languages: [],
  additionalRoles: [],
});

export function onboardingFromRow(row: Record<string, unknown>): CandidateOnboardingData {
  return {
    candidateId: row.id as string | undefined,
    photoUrl: row.photo_url as string | undefined,
    role: row.role as string | undefined,
    additionalRoles: normalizeAdditionalRoles(
      String(row.role ?? ''),
      parseAdditionalRoles(row.additional_roles),
    ),
    visaStatus: row.visa_status as string | undefined,
    currentSalary: row.current_salary as number | undefined,
    salaryExpectation: row.salary_expectation as number | undefined,
    location: row.location as string | undefined,
    phone: row.phone as string | undefined,
    whatsapp: row.whatsapp as string | undefined,
    nationality: row.nationality as string | undefined,
    name: row.name as string | undefined,
    availableFrom: row.available_from as string | undefined,
    yearsExperience: (row.years_experience as number) ?? 0,
    languages: sanitizeLanguages(row.languages),
  };
}

export type CandidateOnboardingData = {
  photoUrl?: string | null;
  role?: string;
  visaStatus?: string;
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
  uaeExperience: boolean;
  previousEmployer?: string | null;
};

export const emptyOnboardingData = (): CandidateOnboardingData => ({
  languages: [],
  uaeExperience: false,
});

export function onboardingFromRow(row: Record<string, unknown>): CandidateOnboardingData {
  const langs = row.languages;
  return {
    candidateId: row.id as string | undefined,
    photoUrl: row.photo_url as string | undefined,
    role: row.role as string | undefined,
    visaStatus: row.visa_status as string | undefined,
    salaryExpectation: row.salary_expectation as number | undefined,
    location: row.location as string | undefined,
    phone: row.phone as string | undefined,
    whatsapp: row.whatsapp as string | undefined,
    nationality: row.nationality as string | undefined,
    name: row.name as string | undefined,
    availableFrom: row.available_from as string | undefined,
    yearsExperience: (row.years_experience as number) ?? 0,
    languages: Array.isArray(langs) ? langs.map(String) : [],
    uaeExperience: row.uae_experience === true,
    previousEmployer: row.previous_employer as string | undefined,
  };
}

import { z } from 'zod';
import {
  CANDIDATE_ROLES,
  VISA_STATUSES,
} from '@/shared/constants/candidate';
import { parseSchema } from '@/shared/validation/parseSchema';
import { isValidAuthPhoneE164 } from '@/shared/utils/phone';

const roleValues = CANDIDATE_ROLES as [string, ...string[]];
const visaValues = VISA_STATUSES as [string, ...string[]];

export const candidateUpsertSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  photo_url: z.union([z.string().min(1), z.null()]).optional(),
  role: z.enum(roleValues),
  additional_roles: z.array(z.string().min(1)).max(2),
  visa_status: z.enum(visaValues),
  nationality: z.string().trim().min(1).max(80),
  current_salary: z.number().int().min(0).max(1_000_000),
  salary_expectation: z.number().int().min(0).max(1_000_000),
  available_from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')
    .nullable(),
  location: z.string().trim().min(1),
  phone: z.string().refine(isValidAuthPhoneE164, 'Invalid phone'),
  whatsapp: z
    .union([z.string().refine(isValidAuthPhoneE164, 'Invalid WhatsApp'), z.null()])
    .optional(),
  years_experience: z.number().int().min(0).max(50),
  languages: z.array(z.string().min(1)).min(1).max(20),
  uae_experience: z.null(),
  previous_employer: z.null(),
  is_active: z.literal(true),
});

export type CandidateUpsertPayload = z.infer<typeof candidateUpsertSchema>;

export function parseCandidateUpsertPayload(input: unknown): CandidateUpsertPayload {
  return parseSchema(candidateUpsertSchema, input);
}

import { z } from 'zod';
import { parseSchema } from '@/shared/validation/parseSchema';
import { isValidAuthPhoneE164 } from '@/shared/utils/phone';

export const employerProfilePayloadSchema = z.object({
  company_name: z.string().trim().min(1).max(200),
  contact_name: z.string().trim().min(1).max(120),
  phone: z.string().refine(isValidAuthPhoneE164, 'Invalid phone'),
  email: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .refine((value) => value.includes('@'), 'Invalid email'),
  location: z.string().trim().min(1),
  trade_license: z.union([z.string().trim().max(100), z.null()]),
});

export type EmployerProfilePayload = z.infer<typeof employerProfilePayloadSchema>;

export function parseEmployerProfilePayload(input: unknown): EmployerProfilePayload {
  return parseSchema(employerProfilePayloadSchema, input);
}

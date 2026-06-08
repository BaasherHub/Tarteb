import { ZodType } from 'zod';

/** Parse unknown input against a schema; throws {@link ZodError} on failure. */
export function parseSchema<T>(schema: ZodType<T>, value: unknown): T {
  return schema.parse(value);
}

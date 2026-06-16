import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import type { ZodSchema, ZodIssue } from 'zod';

function parseIssues<T extends FieldValues>(issues: ZodIssue[]): FieldErrors<T> {
  const errors: Record<string, { message: string; type: string }> = {};

  for (const issue of issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = { message: issue.message, type: issue.code };
    }
  }

  return errors as FieldErrors<T>;
}

export function zodResolver<T extends FieldValues>(schema: ZodSchema<T>): Resolver<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (values): Promise<any> => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    return {
      values: {},
      errors: parseIssues<T>(result.error.issues)
    };
  };
}

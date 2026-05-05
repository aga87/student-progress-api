import type { ObjectSchema, ValidationError } from 'joi';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export const validateSchema = <T>(
  data: unknown,
  schema: ObjectSchema<T>
): ValidationResult<T> => {
  const result = schema.validate(data, { abortEarly: false }) as {
    error?: ValidationError;
    value: T;
  };

  if (result.error) {
    return {
      success: false,
      errors: result.error.details.map(d => d.message),
    };
  }

  return {
    success: true,
    data: result.value,
  };
};

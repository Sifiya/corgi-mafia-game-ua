import { ZodSchema } from 'zod';
import type { FormFieldValidationState } from '@/types';

export const validate = <T>(schema: ZodSchema<T>, value: T): FormFieldValidationState => {
  const result = schema.safeParse(value);
  const returnObject: FormFieldValidationState = {
    isValid: result.success,
  };
  if (!result.success) {
    returnObject.errorMessage = result.error?.issues[0].message;
  }
  return returnObject;
};

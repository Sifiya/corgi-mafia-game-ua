import { describe, test, expect } from 'vitest';
import { validate } from './utils';
import { z } from 'zod';

describe('validate', () => {
  test('should return true if the value is valid', () => {
    const result = validate(z.string(), 'test');
    expect(result.isValid).toBe(true);
  });

  test('should return false if the value is invalid', () => {
    const result = validate(z.string().min(10), 'test');
    expect(result.isValid).toBe(false);
  });

  test('should return the error message if the value is invalid', () => {
    const result = validate(z.string().min(1, { message: 'IS_REQUIRED_ERROR' }), '');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('IS_REQUIRED_ERROR');
  });
});

import { describe, test, expect } from 'vitest';
import { useTextField } from '../form.utils';

describe('useTextField', () => {
  test('should return initial value', () => {
    const textField = useTextField({ initialValue: 'test' });
    expect(textField.value()).toBe('test');
  });

  test('should update value on input', () => {
    const textField = useTextField({ initialValue: 'test' });
    textField.onValueChange({ target: { value: 'new value' } } as unknown as Event);
    expect(textField.value()).toBe('new value');
  });

  test('should return isValid true if checkValidity is not provided', () => {
    const textField = useTextField({ initialValue: 'test' });
    expect(textField.state().isValid).toBe(true);
  });

  test('should return isValid false if checkValidity is provided and returns false', () => {
    const textField = useTextField({
      initialValue: 'test',
      checkValidity: () => ({ isValid: false, errorMessage: 'Error message' }),
    });
    expect(textField.state().isValid).toBe(false);
    expect(textField.state().errorMessage).toBe('Error message');
  });

  test('should return isValid true if checkValidity returns true', () => {
    const textField = useTextField({
      initialValue: 'test',
      checkValidity: () => ({ isValid: true }),
    });
    expect(textField.state().isValid).toBe(true);
    expect(textField.state().errorMessage).toBeUndefined();
  });

  test('should update isValid and errorMessage when checkValidity changes', () => {
    const textField = useTextField({
      initialValue: '',
      checkValidity: (value) => ({
        isValid: value.length > 0,
        ...(value.length > 0 ? {} : { errorMessage: 'Value is required' }),
      }),
    });
    textField.onValueChange({ target: { value: 'new value' } } as unknown as Event);
    expect(textField.state().isValid).toBe(true);
    expect(textField.state().errorMessage).toBeUndefined();

    textField.onValueChange({ target: { value: '' } } as unknown as Event);
    expect(textField.state().isValid).toBe(false);
    expect(textField.state().errorMessage).toBe('Value is required');
  });
});

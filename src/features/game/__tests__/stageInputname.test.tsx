import { describe, beforeEach, test, expect, vi } from 'vitest';
import { render, waitFor } from '@solidjs/testing-library';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { TranslationProvider } from '@/lib/i18n/TranslationProvider';
import { StageInputName } from '../StageInputName';

const WrappedStageInputName = () => {
  const handleNext = () => {};
  return (
    <TranslationProvider>
      <StageInputName onNext={handleNext} />
    </TranslationProvider>
  );
};

let user: UserEvent;

describe('StageInputName', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  test('should render', async () => {
    const { getByRole } = render(() => <WrappedStageInputName />);

    await waitFor(() => {
      expect(getByRole('textbox', { name: 'Введіть ваше ім\'я' })).toBeInTheDocument();
      const button = getByRole('button', { name: 'Почати гру' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  test('should show error message if name is empty', async () => {
    const { findByRole, getByText, getByRole } = render(() => <WrappedStageInputName />);
    const nameInput = await findByRole('textbox');
    await user.click(nameInput);
    await user.paste('Test');
    await user.clear(nameInput);

    await waitFor(() => {
      expect(getByText('Це поле є обовʼязковим')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Почати гру' })).toBeDisabled();
    });
  });

  test('should show error message if name is too long', async () => {
    const { findByRole, getByText, getByRole } = render(() => <WrappedStageInputName />);
    const nameInput = await findByRole('textbox');
    await user.click(nameInput);
    await user.paste('a'.repeat(61));

    await waitFor(() => {
      expect(getByText('Максимальна довжина 60 символів')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Почати гру' })).toBeDisabled();
    });
  });

  test('should show error message if name contains forbidden characters', async () => {
    const { findByRole, getByText, getByRole } = render(() => <WrappedStageInputName />);
    const nameInput = await findByRole('textbox');
    await user.click(nameInput);
    await user.paste('Test@#$%');

    await waitFor(() => {
      expect(getByText('Допустимі символи: латиниця, кирилиця, цифри, апострофи, тире')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Почати гру' })).toBeDisabled();
    });
  });

  test('should enable submit button when name is valid', async () => {
    const { findByRole, getByRole } = render(() => <WrappedStageInputName />);
    const nameInput = await findByRole('textbox');
    await user.click(nameInput);
    await user.paste('Валідне Імʼя');

    await waitFor(() => {
      expect(getByRole('button', { name: 'Почати гру' })).toBeEnabled();
    });
  });

  test('should call onNext with entered name when form is submitted', async () => {
    const handleNext = vi.fn();
    const { findByRole } = render(() => (
      <TranslationProvider>
        <StageInputName onNext={handleNext} />
      </TranslationProvider>
    ));

    const nameInput = await findByRole('textbox');
    const submitButton = await findByRole('button');

    await user.click(nameInput);
    await user.paste('Валідне Імʼя');
    await user.click(submitButton);

    expect(handleNext).toHaveBeenCalledWith('Валідне Імʼя');
  });
});

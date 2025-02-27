import { describe, beforeEach, test, expect } from 'vitest';
import { render, waitFor } from '@solidjs/testing-library';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { TranslationProvider } from '@/lib/i18n/TranslationProvider';
import AddCorgiPage from '../AddCorgi/AddCorgi';

const WrappedAddCorgiPage = () => {
  return (
    <TranslationProvider>
      <AddCorgiPage />
    </TranslationProvider>
  );
};

let user: UserEvent;

describe('AddCorgiPage', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  test('should render', async () => {
    const { getByRole } = render(() => <WrappedAddCorgiPage />);

    await waitFor(() => {
      expect(getByRole('heading', { level: 1 })).toHaveTextContent('Додати свого коргі');
      expect(getByRole('link', { name: 'На головну' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Додати коргі' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Ім\'я песика' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Ім\'я власника' })).toBeInTheDocument();
      expect(getByRole('checkbox', { name: 'Я є власником/власницею цього коргі' })).toBeInTheDocument();
    });
  });

  test('should show error message if corgi name is empty', async () => {
    const { findByRole, getByRole, getByText } = render(() => <WrappedAddCorgiPage />);
    const corgiNameInput = await findByRole('textbox', { name: 'Ім\'я песика' });
    await user.click(corgiNameInput);
    await user.paste('Pundyk');
    await user.clear(corgiNameInput);

    const ownerNameInput = getByRole('textbox', { name: 'Ім\'я власника' });
    await user.click(ownerNameInput);
    await user.paste('Maria Petrova');

    await waitFor(() => {
      expect(getByText('Це поле є обовʼязковим')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Додати коргі' })).toBeDisabled();
    });
  });

  test('should show error message if owner name is empty', async () => {
    const { getByRole, getByText, findByRole } = render(() => <WrappedAddCorgiPage />);
    const corgiNameInput = await findByRole('textbox', { name: 'Ім\'я песика' });
    await user.click(corgiNameInput);
    await user.paste('Pundyk');

    const ownerNameInput = getByRole('textbox', { name: 'Ім\'я власника' });
    await user.click(ownerNameInput);
    await user.paste('Maria Petrova');
    await user.clear(ownerNameInput);

    await waitFor(() => {
      expect(getByText('Це поле є обовʼязковим')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Додати коргі' })).toBeDisabled();
    });
  });

  test('should show error message if corgi name is too long', async () => {
    const { findByRole, getByRole, getByText } = render(() => <WrappedAddCorgiPage />);
    const corgiNameInput = await findByRole('textbox', { name: 'Ім\'я песика' });
    await user.click(corgiNameInput);
    await user.paste('a'.repeat(201));

    await waitFor(() => {
      expect(getByText('Максимальна довжина 200 символів')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Додати коргі' })).toBeDisabled();
    });
  });

  test('should show error message if owner name is too long', async () => {
    const { findByRole, getByRole, getByText } = render(() => <WrappedAddCorgiPage />);
    const ownerNameInput = await findByRole('textbox', { name: 'Ім\'я власника' });
    await user.click(ownerNameInput);
    await user.paste('a'.repeat(201));

    await waitFor(() => {
      expect(getByText('Максимальна довжина 200 символів')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Додати коргі' })).toBeDisabled();
    });
  });

  test('should show error message if corgi name contains forbidden characters', async () => {
    const { findByRole, getByRole, getByText } = render(() => <WrappedAddCorgiPage />);
    const corgiNameInput = await findByRole('textbox', { name: 'Ім\'я песика' });
    await user.click(corgiNameInput);
    await user.paste('Пундик@#$%');

    await waitFor(() => {
      expect(getByText('Допустимі символи: латиниця, кирилиця, цифри, апострофи, тире')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Додати коргі' })).toBeDisabled();
    });
  });

  test('should show error message if owner name contains forbidden characters', async () => {
    const { findByRole, getByRole, getByText } = render(() => <WrappedAddCorgiPage />);
    const ownerNameInput = await findByRole('textbox', { name: 'Ім\'я власника' });
    await user.click(ownerNameInput);
    await user.paste('Марія@#$%');

    await waitFor(() => {
      expect(getByText('Допустимі символи: латиниця, кирилиця, цифри, апострофи, тире')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Додати коргі' })).toBeDisabled();
    });
  });
});


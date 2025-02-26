import { describe, test, expect } from 'vitest';
import { render, waitFor } from '@solidjs/testing-library';
import { TranslationProvider } from '@/lib/i18n/TranslationProvider';
import HomePage from '../Home';

const WrappedHomePage = () => {
  return (
    <TranslationProvider>
      <HomePage />
    </TranslationProvider>
  );
};

describe('HomePage', () => {
  test('should render', async () => {
    const { getByText, getByRole } = render(() => <WrappedHomePage />);

    await waitFor(() => {
      expect(getByText('Коргі-мафія представляє')).toBeInTheDocument();
      expect(getByRole('heading', { level: 1 })).toHaveTextContent('Вгадай песика по фото');
      expect(getByText('Гра, в якій потрібно вгадати ім\'я собаки по його світлині')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Почати гру' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Додати свого коргі' })).toBeInTheDocument();
    });
  });
});

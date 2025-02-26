import { describe, test, expect } from 'vitest';
import { render, waitFor } from '@solidjs/testing-library';
import { TranslationProvider } from '@/lib/i18n/TranslationProvider';
import AddCorgiPage from '../AddCorgi';

const WrappedAddCorgiPage = () => {
  return (
    <TranslationProvider>
      <AddCorgiPage />
    </TranslationProvider>
  );
};

describe('AddCorgiPage', () => {
  test('should render', async () => {
    const { getByRole } = render(() => <WrappedAddCorgiPage />);

    await waitFor(() => {
      expect(getByRole('heading', { level: 1 })).toHaveTextContent('Додати свого коргі');
      expect(getByRole('link', { name: 'На головну' })).toBeInTheDocument();
    });
  });
});

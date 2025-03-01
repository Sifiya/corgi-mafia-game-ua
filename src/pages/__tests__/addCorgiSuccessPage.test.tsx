import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@solidjs/testing-library';
import { TranslationProvider } from '@/lib/i18n/TranslationProvider';
import * as services from '@/services/getDog';
import AddSuccess from '../AddSuccess';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

vi.mock('@/services/getDog', () => ({
  getDog: vi.fn(),
}));

vi.mock('@solidjs/router', () => ({
  useParams: () => ({ id: '123' }),
}));

const WrappedAddSuccessPage = () => {
  return (
    <TranslationProvider>
      <AddSuccess />
    </TranslationProvider>
  );
};

describe('AddSuccessPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render success page with dog information', async () => {
    const mockDog = {
      data: {
        name: 'Пундик',
        images: ['test-image.jpg'],
      } ,
    } as PostgrestSingleResponse<any>;

    vi.mocked(services.getDog).mockResolvedValue(mockDog);

    const { getByText, getByRole, getAllByRole } = render(() => <WrappedAddSuccessPage />);

    await waitFor(() => {
      expect(getByText('Пундик')).toBeInTheDocument();
      expect(getAllByRole('link', { name: /на головну/i })[1]).toBeInTheDocument();
      expect(getByRole('link', { name: /додати ще/i })).toBeInTheDocument();
    });
  });
});

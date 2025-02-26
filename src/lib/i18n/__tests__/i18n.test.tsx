import { describe, test, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@solidjs/testing-library';
import { userEvent, UserEvent } from '@testing-library/user-event';
import { TranslationProvider } from '../TranslationProvider';
import { useTranslationContext } from '../context';

let user: UserEvent;

const TestComponent = () => {
  const tc = useTranslationContext();
  return (
    <div>
      <p data-testid="main-page-title">{tc.t('MAIN_PAGE_TITLE')}</p>
      <p data-testid="locale">Locale is {tc.locale()}</p>
      <button onClick={() => tc.switchLocale('en')} data-testid="switch-locale">
        Set Locale to en
      </button>
    </div>
  );
};

const WrappedTestComponent = () => {
  return (
    <TranslationProvider>
      <TestComponent />
    </TranslationProvider>
  );
};

describe('TranslationProvider', () => {
  beforeEach(() => {
    user = userEvent.setup({ delay: null });
  });

  test('should render with default locale', async () => {
    const { getByTestId } = render(() => <WrappedTestComponent />);
    await waitFor(() => {
      expect(getByTestId('main-page-title')).toHaveTextContent(
        'Вгадай песика по фото',
      );
      expect(getByTestId('locale')).toHaveTextContent('Locale is uk');
    });
  });

  test('should switch locale', async () => {
    const { findByTestId, getByTestId } = render(() => (
      <WrappedTestComponent />
    ));
    const button = await findByTestId('switch-locale');
    await user.click(button);

    await waitFor(() => {
      expect(getByTestId('locale')).toHaveTextContent('Locale is en');
      expect(getByTestId('main-page-title')).toHaveTextContent(
        'Guess the dog by photo',
      );
    });
  });
});

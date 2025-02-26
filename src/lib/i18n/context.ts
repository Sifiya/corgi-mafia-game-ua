import { createContext, useContext } from 'solid-js';
import * as i18n from '@solid-primitives/i18n';
import type { Locale, Dictionary } from './types';
import type { Accessor } from 'solid-js';

const DEFAULT_LOCALE: Locale = 'uk';

type TranslationContextType = {
  locale: Accessor<Locale>;
  switchLocale: (locale: Locale) => void;
  t: i18n.Translator<Dictionary, string>;
  duringLocaleTransition: () => boolean;
};

export const TranslationContext = createContext<TranslationContextType>({
  locale: () => DEFAULT_LOCALE,
  switchLocale: (locale: Locale) => {
    console.log('switchLocale', locale);
  },
  t: (key: string, params?: Record<string, string>) => {
    console.log('t', key, params);
    return key;
  },
  duringLocaleTransition: () => false,
} as TranslationContextType);

export const useTranslationContext = () => useContext(TranslationContext);

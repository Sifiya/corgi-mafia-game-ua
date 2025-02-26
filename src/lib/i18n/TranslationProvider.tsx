import {
  createSignal,
  createResource,
  useTransition,
  Show,
  Suspense,
  JSX,
} from 'solid-js';
import * as i18n from '@solid-primitives/i18n';
import * as uk from './locales/uk.ts';
import * as en from './locales/en.ts';
import { TranslationContext } from './context';
import type { Locale, Dictionary, RawDictionary } from './types';

const locales = { en, uk };

async function fetchDictionary (locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = locales[locale].dict;
  return i18n.flatten(dict);
}

export const TranslationProvider = (props: { children: JSX.Element }) => {
  const [locale, setLocale] = createSignal<Locale>('uk');
  const [duringLocaleTransition, startLocaleTransition] = useTransition();
  const [dict] = createResource(locale, fetchDictionary, {
    initialValue: i18n.flatten(locales.uk.dict),
  });
  function switchLocale (locale: Locale) {
    startLocaleTransition(() => setLocale(locale));
  }

  return (
    <Suspense>
      <Show when={dict()}>
        {(dict) => {
          const t = i18n.translator(dict, i18n.resolveTemplate);
          return (
            <TranslationContext.Provider
              value={{ locale, switchLocale, t, duringLocaleTransition }}
            >
              {props.children}
            </TranslationContext.Provider>
          );
        }}
      </Show>
    </Suspense>
  );
};

import * as i18n from '@solid-primitives/i18n';
import * as uk from './locales/uk.ts';

export type Locale = 'en' | 'uk';
export type RawDictionary = typeof uk.dict;
export type Dictionary = i18n.Flatten<RawDictionary>;

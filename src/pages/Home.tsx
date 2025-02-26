import { useTranslationContext } from '@/lib/i18n/context';
import type { Component } from 'solid-js';

const Home: Component = () => {
  const i18n = useTranslationContext();
  return (
    <section class="grow w-full h-full flex items-center justify-center">
      <p>{i18n.t('MAIN_PAGE_PRE_TITLE')}</p>
      <h1>{i18n.t('MAIN_PAGE_TITLE')}</h1>
      <p>{i18n.t('MAIN_PAGE_DESCRIPTION')}</p>
      <button>{i18n.t('MAIN_PAGE_BUTTON_START')}</button>
      <button>{i18n.t('MAIN_PAGE_BUTTON_ADD_CORGI')}</button>
    </section>
  );
};

export default Home;

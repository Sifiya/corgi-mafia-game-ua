import { useTranslationContext } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import type { Component } from 'solid-js';

const Home: Component = () => {
  const i18n = useTranslationContext();
  return (
    <section class="flex flex-col gap-4">
      <p>{i18n.t('MAIN_PAGE_PRE_TITLE')}</p>
      <h1>{i18n.t('MAIN_PAGE_TITLE')}</h1>
      <p>{i18n.t('MAIN_PAGE_DESCRIPTION')}</p>
      <Button variant="secondary">{i18n.t('MAIN_PAGE_BUTTON_ADD_CORGI')}</Button>
      <Button>{i18n.t('MAIN_PAGE_BUTTON_START')}</Button>
    </section>
  );
};

export default Home;

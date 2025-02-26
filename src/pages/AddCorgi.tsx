import { useTranslationContext } from '@/lib/i18n/context';
import { Header1 } from '@/components/typography/header1';
import { Header } from '@/features/header';

import type { Component } from 'solid-js';

const AddCorgi: Component = () => {
  const i18n = useTranslationContext();
  return (
    <>
      <Header />
      <section class="flex flex-col grow justify-start items-center">
        <Header1>{i18n.t('ADD_CORGI_PAGE_TITLE')}</Header1>
      </section>
    </>
  );
};

export default AddCorgi;

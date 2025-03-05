import { useTranslationContext } from '@/lib/i18n/context';
import { cn } from '@/utils/class.utils';

import { Button } from '@/components/ui/button';
import { Paragraph } from '@/components/typography/paragraph';
import { Header1 } from '@/components/typography/header1';
import type { Component } from 'solid-js';

const Home: Component = () => {
  const i18n = useTranslationContext();
  return (
    <>
      <header class={cn(
        'p-4 md:px-10',
        'flex justify-start items-center',
      )}>
        <Button as="a" href="/rating" variant='link'>
          <i aria-hidden="true" class="ri-trophy-fill mr-1 -ml-2" />
          {i18n.t('MAIN_PAGE_BUTTON_RATING')}
        </Button>
      </header>
      <section class={cn(
        'flex flex-col gap-5 grow justify-center items-center',
        'p-10'
      )}>
        <Paragraph variant="secondary" class="text-center">
          {i18n.t('MAIN_PAGE_PRE_TITLE')}
        </Paragraph>
        <Header1 class="text-center text-7xl max-w-lg">
          {i18n.t('MAIN_PAGE_TITLE')}
        </Header1>
        <Paragraph variant="primary" class="text-center">
          {i18n.t('MAIN_PAGE_DESCRIPTION')}
        </Paragraph>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          {/* <Button
            as="a"
            href="/add"
            variant="secondary"
            size="lg"
            class="whitespace-nowrap"
          >
            <i aria-hidden="true" class="text-lg ri-add-fill mr-1 -ml-2" />
            {i18n.t('MAIN_PAGE_BUTTON_ADD_CORGI')}
          </Button> */}
          <Button
            as="a"
            href="/game"
            size="lg"
            class="whitespace-nowrap col-span-2"
          >
            <i aria-hidden="true" class="text-lg ri-play-large-fill mr-1 -ml-2" />
            {i18n.t('MAIN_PAGE_BUTTON_START')}
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;

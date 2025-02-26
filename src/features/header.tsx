import { useTranslationContext } from '@/lib/i18n/context';
import { cn } from '@/utils/class.utils';
import { Button } from '@/components/ui/button';

import type { Component } from 'solid-js';

export const Header: Component = () => {
  const i18n = useTranslationContext();
  return (
    <header class={cn(
      'p-4 md:px-10',
      'flex justify-start items-center',
    )}>
      <Button as="a" href="/" variant='link'>
        <i aria-hidden="true" class="ri-home-2-fill mr-1 -ml-2" />
        {i18n.t('HEADER_HOME_BUTTON')}
      </Button>
    </header>
  );
};

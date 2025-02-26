import { useTranslationContext } from '@/lib/i18n/context';
import { cn } from '@/utils/class.utils';
import { Button } from '@/components/ui/button';

import type { Component } from 'solid-js';

export const Header: Component = () => {
  const i18n = useTranslationContext();
  return (
    <header class={cn(
      'p-4',
      'flex justify-center items-center',
    )}>
      <Button as="a" href="/" variant='link'>
        {i18n.t('HEADER_HOME_BUTTON')}
      </Button>
    </header>
  );
};

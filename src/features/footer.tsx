import { useTranslationContext } from '@/lib/i18n/context';
import { cn } from '@/utils/class.utils';
import { Paragraph } from '@/components/typography/paragraph';

import type { Component } from 'solid-js';

export const Footer: Component = () => {
  const i18n = useTranslationContext();
  return (
    <footer class={cn(
      'p-4',
      'flex justify-center items-center',
    )}>
      <Paragraph class="text-sm" variant="secondary">
        {i18n.t('FOOTER_COPYRIGHT', { year: new Date().getFullYear() })}
      </Paragraph>
    </footer>
  );
};

import { cn } from '@/utils/class.utils';

import { Header1 } from '@/components/typography/header1';
import { Cropper } from '@/features/cropper/cropper';
import type { Component } from 'solid-js';

// TODO: delete page when cropper is ready
const CropperPage: Component = () => {
  return (
    <section class={cn(
      'flex flex-col gap-5 grow justify-start items-center',
      'p-10'
    )}>
      <Header1 class="text-center">
        Перевіряємо роботу кроппера
      </Header1>

      <Cropper />
    </section>
  );
};

export default CropperPage;

import { createSignal, onMount } from 'solid-js';
import { useTranslationContext } from '@/lib/i18n/context';
import { useParams } from '@solidjs/router';
import { getDog } from '@/services/getDog';
import { getImageUrl } from '@/utils/images.utils';

import { Button } from '@/components/ui/button';
import { Paragraph } from '@/components/typography/paragraph';
import { Header1 } from '@/components/typography/header1';
import { Image, ImageFallback, ImageRoot } from '@/components/ui/image';
import { Header } from '@/features/header';
import { Badge } from '@/components/ui/badge';

import type { Component } from 'solid-js';

const AddSuccess: Component = () => {
  const i18n = useTranslationContext();
  const params = useParams();
  const [imageUrl, setImageUrl] = createSignal<string>('');
  const [dogName, setDogName] = createSignal<string>('');

  onMount(async () => {
    const dog = await getDog(params.id);
    if (dog.data) {
      const imageUrl = getImageUrl(dog.data.images[0]);
      setImageUrl(imageUrl);
      setDogName(dog.data.name);
    }
  });

  return (
    <>
      <Header />
      <section class="grow flex flex-col items-center gap-4 max-w-md mx-auto pt-18">
        <div class="w-[200px] h-[200px] relative">
          <ImageRoot class="w-full h-full shadow-md">
            <Image src={imageUrl()} width={200} height={200} alt={dogName()} />
            <ImageFallback>your corgi</ImageFallback>
          </ImageRoot>
          <Badge variant="secondary" class="absolute bottom-5 right-0 text-sm">{dogName()}</Badge>
        </div>
        <Header1>
          {i18n.t('ADD_SUCCESS_PAGE_TITLE')}
        </Header1>
        <Paragraph>
          {i18n.t('ADD_SUCCESS_PAGE_DESCRIPTION')}
        </Paragraph>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button as="a" href="/" variant="default">
            <i aria-hidden="true" class="ri-home-2-fill mr-1 -ml-2" />
            {i18n.t('ADD_SUCCESS_PAGE_BUTTON_HOME')}
          </Button>
          <Button as="a" href="/add" variant="secondary">
            <i aria-hidden="true" class="text-lg ri-add-fill mr-1 -ml-2" />
            {i18n.t('ADD_SUCCESS_PAGE_BUTTON_ADD_MORE')}
          </Button>
        </div>
      </section>
    </>
  );
};

export default AddSuccess;

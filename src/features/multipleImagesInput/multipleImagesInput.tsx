import { createSignal, Show } from 'solid-js';
import { useTranslationContext } from '@/lib/i18n/context';
import { Image } from '@/components/ui/image';
import { Cropper } from '../cropper/Cropper';
import type { Component } from 'solid-js';

type MultipleImagesInputProps = {
  onSave: (files: File[]) => void;
}

export const MultipleImagesInput: Component<MultipleImagesInputProps> = (props) => {
  const i18n = useTranslationContext();
  const [images, setImages] = createSignal<File[]>([]);

  const handleAdd = (blob: Blob) => {
    const randomName = Math.random().toString(36).substring(2, 15);
    const file = new File([blob], `${randomName}-${Date.now()}.jpg`, { type: 'image/jpeg' });
    const newImages = [...images(), file];
    setImages(newImages);
    props.onSave(newImages);
  };

  return (
    <div class="flex flex-row flex-wrap items-center justify-center gap-4">
      <Show when={images().length > 0}>
        {images().map((image) => (
          <Image src={URL.createObjectURL(image)} width={120} height={120} class="aspect-square object-cover" />
        ))}
      </Show>
      <Cropper
        onSave={handleAdd}
        cancelButtonText={i18n.t('ADD_CORGI_PAGE_CANCEL_BUTTON_TEXT')}
        saveButtonText={i18n.t('ADD_CORGI_PAGE_SAVE_BUTTON_TEXT')}
      />
    </div>
  );
};

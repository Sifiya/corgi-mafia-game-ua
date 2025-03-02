import { createSignal, Show } from 'solid-js';
import { useTranslationContext } from '@/lib/i18n/context';
import { Image, ImageRoot } from '@/components/ui/image';
import { Cropper } from '../cropper/Cropper';
import type { Component } from 'solid-js';
import { Button } from '@/components/ui/button';

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

  const handleRemove = (image: File) => {
    const newImages = images().filter((i) => i !== image);
    setImages(newImages);
    props.onSave(newImages);
  };

  return (
    <div class="flex flex-row flex-wrap items-center justify-center gap-4">
      <Show when={images().length > 0}>
        {images().map((image) => (
          <div class="w-[120px] h-[120px] relative">
            <ImageRoot class="w-full h-full">
              <Image src={URL.createObjectURL(image)} width={120} height={120} class="aspect-square object-cover shadow-md" />
            </ImageRoot>
            <Button
              size="icon"
              variant="default"
              class="absolute bottom-0 right-0 rounded-full"
              onClick={() => handleRemove(image)}
            >
              <i class="ri-delete-bin-2-fill text-xl" />
            </Button>
          </div>
        ))}
      </Show>
      <Show when={images().length < 5}>
        <Cropper
          onSave={handleAdd}
          cancelButtonText={i18n.t('ADD_CORGI_PAGE_CANCEL_BUTTON_TEXT')}
          saveButtonText={i18n.t('ADD_CORGI_PAGE_SAVE_BUTTON_TEXT')}
        />
      </Show>
    </div>
  );
};

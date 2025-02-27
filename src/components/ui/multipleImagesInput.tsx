import { createSignal} from 'solid-js';
import { Image } from './image';
import { ImageInput } from './imageInput';

export const MultipleImagesInput = () => {
  const [images, setImages] = createSignal<File[]>([]);

  return (
    <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
      {images().map((image) => (
        <Image src={URL.createObjectURL(image)} width={120} height={120} class="aspect-square object-cover" />
      ))}
      <ImageInput onInput={(file) => setImages([...images(), file])} />
    </div>
  );
};

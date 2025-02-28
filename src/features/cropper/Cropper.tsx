import { createSignal } from 'solid-js';
import { Button } from '@/components/ui/button';
import type { Component } from 'solid-js';

export const Cropper: Component = () => {
  const [imageFile, setImageFile] = createSignal<File | null>(null);

  const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setImageFile(file);
  };

  return (
    <div class="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      <div class="flex flex-col gap-3">
        <canvas class="bg-amber-500" />
        <div class="grid grid-cols-2 gap-2">
          <Button variant="secondary">
            Скасувати
          </Button>
          <Button>
            Зберегти
          </Button>
        </div>
      </div>

      {imageFile() && (
        <img
          src={URL.createObjectURL(imageFile() as Blob)}
          alt="preview"
          width={120}
          height={120}
          class="object-cover"
        />
      )}
    </div>
  );
};

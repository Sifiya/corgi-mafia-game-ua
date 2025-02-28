import { onMount } from 'solid-js';
import { getImageDimensions } from './utils';
import { Button } from '@/components/ui/button';
import type { Component } from 'solid-js';

export const Cropper: Component = () => {

  let imageInputRef: HTMLInputElement | undefined;
  let imagePreviewRef: HTMLImageElement | undefined;
  let originalImage: HTMLImageElement | undefined;
  let canvas: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d');
    }
  });

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      // show preview
      if (imagePreviewRef) {
        imagePreviewRef.src = reader.result as string;
      }

      originalImage = new Image();
      originalImage.onload = () => {
        if (!canvas || !ctx || !originalImage) {
          return;
        }

        const { width, height } = getImageDimensions(originalImage);

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
      };
      originalImage.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    loadImage(file);
  };

  return (
    <div class="flex flex-col gap-4">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      <div class="flex flex-col gap-3">
        <canvas
          ref={canvas}
          class="bg-amber-500"
        />
        <div class="grid grid-cols-2 gap-2">
          <Button variant="secondary">
            Скасувати
          </Button>
          <Button>
            Зберегти
          </Button>
        </div>
      </div>

      <img
        ref={imagePreviewRef}
        src="/images/corgi.jpg"
        alt="preview"
        width={120}
        height={120}
        class="object-cover"
      />
    </div>
  );
};

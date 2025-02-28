import './cropper.css';
import { createSignal, onMount, onCleanup } from 'solid-js';
import { getImageCoverDimensions } from './utils';
import { cn } from '@/utils/class.utils';
import { throttle } from 'lodash';
import { Button } from '@/components/ui/button';
import type { Component } from 'solid-js';

export const Cropper: Component = () => {
  const [image, setImage] = createSignal<File | null>(null);
  const [movingState, setMovingState] = createSignal({
    x: 0,
    y: 0,
    isDragging: false,
  });

  let imageInputRef: HTMLInputElement | undefined;
  let originalImage: HTMLImageElement | undefined;
  let cropperContainerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;

  onMount(() => {
    if (canvasRef) {
      ctx = canvasRef.getContext('2d');
    }
  });

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {

      originalImage = new Image();
      originalImage.onload = () => {
        if (!canvasRef || !ctx || !originalImage) {
          return;
        }

        let maxWidth = 0;
        let maxHeight = 0;
        if (cropperContainerRef) {
          maxWidth = cropperContainerRef.offsetWidth;
          maxHeight = cropperContainerRef.offsetHeight;
        }

        const { width, height } = getImageCoverDimensions(originalImage, maxWidth, maxHeight);

        canvasRef.width = width;
        canvasRef.height = height;

        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        ctx.drawImage(originalImage, 0, 0, canvasRef.width, canvasRef.height);
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

    setImage(file);
    loadImage(file);
  };

  // Mouse down / Touch start
  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!canvasRef || !ctx) return;

    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    setMovingState({
      x: clientX,
      y: clientY,
      isDragging: true,
    });
  };

  // Mouse move / Touch move
  const handleMouseMove = throttle((e: MouseEvent | TouchEvent) => {
    if (!canvasRef || !movingState().isDragging) return;
    e.preventDefault();

    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    const deltaX = clientX - movingState().x;
    const deltaY = clientY - movingState().y;

    const prevTop = parseFloat(canvasRef.style.top);
    const prevLeft = parseFloat(canvasRef.style.left);
    canvasRef.style.top = `${prevTop + deltaY}px`;
    canvasRef.style.left = `${prevLeft + deltaX}px`;

    setMovingState({
      x: clientX,
      y: clientY,
      isDragging: true,
    });
  }, 50);

  // Mouse up / Touch end
  const handleMouseUp = () => {
    setMovingState(prev => ({ ...prev, isDragging: false }));
  };

  document.body.addEventListener('mouseup', handleMouseUp);
  document.body.addEventListener('touchend', handleMouseUp);

  onCleanup(() => {
    document.body.removeEventListener('mouseup', handleMouseUp);
    document.body.removeEventListener('touchend', handleMouseUp);
  });

  return (
    <div class="flex flex-col gap-4">
      <label class="cursor-pointer">
        <Button as="span" class="flex items-center gap-1.5">
          <i class="ri-image-add-fill text-xl" />
          Вибрати зображення
        </Button>
        <input
          class="hidden"
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
      </label>
      <div class={cn(
        'flex flex-col gap-3',
      )}>
        <div
          ref={cropperContainerRef}
          class="relative overflow-hidden w-sm aspect-square cursor-grab rounded-md"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
        >
          <div
            class={cn(
              'uwu-overlay z-10 rounded-full',
              'h-[calc(100%-10px)] w-[calc(100%-10px)]',
              'absolute inset-1/2 -translate-x-1/2 -translate-y-1/2',
            )} />
          <canvas
            ref={canvasRef}
            class="absolute"
            style={{
              top: 0,
              left: 0,
            }}
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <Button variant="secondary">
            Скасувати
          </Button>
          <Button>
            Зберегти
          </Button>
        </div>
      </div>
    </div>
  );
};

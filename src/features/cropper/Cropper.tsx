import './cropper.css';
import { createSignal, onMount, onCleanup } from 'solid-js';
import { getImageCoverDimensions, getMaxDimensions } from './utils';
import { cn } from '@/utils/class.utils';
import { throttle } from 'lodash';
import { Button } from '@/components/ui/button';
import type { Component } from 'solid-js';

type CropperProps = {
  maxWidth?: number;
  maxHeight?: number;
}

export const Cropper: Component<CropperProps> = (props) => {
  const MAX_WIDTH = props.maxWidth || 800;
  const MAX_HEIGHT = props.maxHeight || 800;

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

    loadImage(file);
  };

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

  const handleMouseMove = throttle((e: MouseEvent | TouchEvent) => {
    if (!canvasRef || !movingState().isDragging || !cropperContainerRef) return;
    e.preventDefault();

    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    const deltaX = clientX - movingState().x;
    const deltaY = clientY - movingState().y;

    const prevTop = parseFloat(canvasRef.style.top);
    const prevLeft = parseFloat(canvasRef.style.left);

    const maxBottom = cropperContainerRef.offsetHeight - canvasRef.height;
    const maxRight = cropperContainerRef.offsetWidth - canvasRef.width;

    const newTop = Math.min(0, Math.max(maxBottom, prevTop + deltaY));
    const newLeft = Math.min(0, Math.max(maxRight, prevLeft + deltaX));

    canvasRef.style.top = `${newTop}px`;
    canvasRef.style.left = `${newLeft}px`;

    setMovingState({
      x: clientX,
      y: clientY,
      isDragging: true,
    });
  }, 30);

  const handleMouseUp = () => {
    setMovingState(prev => ({ ...prev, isDragging: false }));
  };

  document.body.addEventListener('mouseup', handleMouseUp);
  document.body.addEventListener('touchend', handleMouseUp);

  onCleanup(() => {
    document.body.removeEventListener('mouseup', handleMouseUp);
    document.body.removeEventListener('touchend', handleMouseUp);
  });

  const handleSave = () => {
    if (!originalImage || !canvasRef || !cropperContainerRef) return;
    const canvasTop = parseFloat(canvasRef.style.top) || 0;
    const canvasLeft = parseFloat(canvasRef.style.left) || 0;

    const scaleX = originalImage.naturalWidth / canvasRef.width;
    const scaleY = originalImage.naturalHeight / canvasRef.height;

    const sourceCropX = (0 - canvasLeft) * scaleX;
    const sourceCropY = (0 - canvasTop) * scaleY;
    const sourceCropWidth = cropperContainerRef.offsetWidth * scaleX;
    const sourceCropHeight = cropperContainerRef.offsetHeight * scaleY;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;

    const { width: outputWidth, height: outputHeight } = getMaxDimensions(
      sourceCropWidth,
      sourceCropHeight,
      MAX_WIDTH,
      MAX_HEIGHT
    );

    tempCanvas.width = outputWidth;
    tempCanvas.height = outputHeight;

    tempCtx.drawImage(
      originalImage,
      sourceCropX, sourceCropY, sourceCropWidth, sourceCropHeight,
      0, 0, outputWidth, outputHeight
    );

    // Convert to blob and download or use as needed
    tempCanvas.toBlob((blob) => {
      if (!blob) return;

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cropped-image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Alternatively, you can use the blob for upload or other purposes
      // For example: uploadImage(blob);
    }, 'image/jpeg', 0.95);
  };

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
          <Button onClick={handleSave}>
            Зберегти
          </Button>
        </div>
      </div>
    </div>
  );
};

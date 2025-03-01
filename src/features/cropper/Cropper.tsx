import './cropper.css';
import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { getImageCoverDimensions, getMaxDimensions, compressImage } from './utils';
import { cn } from '@/utils/class.utils';
import { throttle } from 'lodash';
import { Button } from '@/components/ui/button';
import { Portal } from 'solid-js/web';
import type { Component } from 'solid-js';
import { ImageInput } from '@/components/ui/imageInput';

type CropperProps = {
  maxWidth?: number;
  maxHeight?: number;
  onSave: (blob: Blob) => void;
  cancelButtonText?: string;
  saveButtonText?: string;
  maxSize?: number;
}

export const Cropper: Component<CropperProps> = (props) => {
  const MAX_WIDTH = props.maxWidth || 800;
  const MAX_HEIGHT = props.maxHeight || 800;

  const [isCropping, setIsCropping] = createSignal(false);
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

  const handleFileSelect = async (file: File) => {
    setIsCropping(true);
    await new Promise(resolve => {
      const checkRefs = () => {
        if (cropperContainerRef && canvasRef) {
          ctx = canvasRef.getContext('2d');
          resolve(undefined);
          return;
        }
        requestAnimationFrame(checkRefs);
      };
      checkRefs();
    });

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

    compressImage(tempCanvas, props.maxSize, 1, 'image/jpeg').then((blob) => {
      if (!blob) return;
      props.onSave(blob);
      setIsCropping(false);

      if (imageInputRef) {
        imageInputRef.value = '';
      }
    });
  };

  const handleCancel = () => {
    if (imageInputRef) {
      imageInputRef.value = '';
    }
    setIsCropping(false);
  };

  return (
    <div class="flex flex-col gap-4">
      <ImageInput onInput={handleFileSelect} ref={imageInputRef} />

      <Portal>
        <Show when={isCropping()}>
          <div
            class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
            onMouseDown={handleCancel}
          >
            <div
              class="flex flex-col gap-3 bg-background rounded-lg p-4 max-w-full"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                ref={cropperContainerRef}
                class="relative overflow-hidden w-sm max-w-full aspect-square cursor-grab rounded-md"
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
                <Button variant="secondary" onClick={handleCancel}>
                  {props.cancelButtonText || 'Скасувати'}
                </Button>
                <Button onClick={handleSave}>
                  {props.saveButtonText || 'Зберегти'}
                </Button>
              </div>
            </div>
          </div>
        </Show>
      </Portal>
    </div>
  );
};

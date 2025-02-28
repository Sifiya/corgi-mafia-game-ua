import { createSignal, onMount, onCleanup } from 'solid-js';

interface CropperState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isDragging: boolean;
}

const ImageUploader = () => {
  const [imageFile, setImageFile] = createSignal<File | null>(null);
  const [cropperState, setCropperState] = createSignal<CropperState>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDragging: false,
  });

  let imageInput: HTMLInputElement | undefined;
  let canvas: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;
  let originalImage: HTMLImageElement | null = null;

  // Constants
  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1080;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ASPECT_RATIO = 16 / 9; // Example aspect ratio

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d');
    }
  });

  const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setImageFile(file);
    await loadImage(file);
  };

  const loadImage = async (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        originalImage = new Image();
        originalImage.onload = () => {
          if (canvas && ctx) {
            // Reset canvas and prepare for new image
            const { width, height } = calculateDimensions(
              originalImage.width,
              originalImage.height
            );
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(originalImage, 0, 0, width, height);
            
            // Show preview container
            const previewContainer = document.getElementById('previewContainer');
            if (previewContainer) {
              previewContainer.style.display = 'block';
            }
          }
          resolve(null);
        };
        originalImage.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const calculateDimensions = (width: number, height: number) => {
    let newWidth = width;
    let newHeight = height;

    // Maintain aspect ratio while resizing
    if (width > MAX_WIDTH) {
      newWidth = MAX_WIDTH;
      newHeight = (height * MAX_WIDTH) / width;
    }

    if (newHeight > MAX_HEIGHT) {
      newHeight = MAX_HEIGHT;
      newWidth = (width * MAX_HEIGHT) / height;
    }

    return { width: newWidth, height: newHeight };
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropperState({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      isDragging: true,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvas || !cropperState().isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update cropper state while maintaining aspect ratio
    const width = x - cropperState().startX;
    const height = width / ASPECT_RATIO;

    setCropperState({
      ...cropperState(),
      endX: x,
      endY: cropperState().startY + height,
    });

    drawCropOverlay();
  };

  const handleMouseUp = () => {
    setCropperState((prev) => ({ ...prev, isDragging: false }));
  };

  const drawCropOverlay = () => {
    if (!ctx || !canvas) return;

    // Clear previous overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw original image
    if (originalImage) {
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw crop area
    const { startX, startY, endX, endY } = cropperState();
    ctx.clearRect(startX, startY, endX - startX, endY - startY);
    
    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  };

  const cropImage = async () => {
    if (!canvas || !ctx || !originalImage) return;

    const { startX, startY, endX, endY } = cropperState();
    
    // Create temporary canvas for cropped image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return;

    const width = endX - startX;
    const height = endY - startY;

    tempCanvas.width = width;
    tempCanvas.height = height;

    // Draw cropped portion
    tempCtx.drawImage(
      canvas,
      startX,
      startY,
      width,
      height,
      0,
      0,
      width,
      height
    );

    // Convert to Blob with compression
    const blob = await new Promise<Blob>((resolve) => {
      tempCanvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
        },
        'image/jpeg',
        0.8 // Compression quality
      );
    });

    // Check file size and compress further if needed
    if (blob.size > MAX_FILE_SIZE) {
      // Implement additional compression or show warning
      console.warn('File size exceeds maximum limit');
    }

    return blob;
  };

  onCleanup(() => {
    // Cleanup event listeners if needed
  });

  return (
    <div class="image-uploader">
      <input
        type="file"
        ref={imageInput}
        accept="image/*"
        onChange={handleFileSelect}
      />
      <canvas
        ref={canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <button onClick={cropImage}>Crop and Save</button>
    </div>
  );
};

export default ImageUploader;
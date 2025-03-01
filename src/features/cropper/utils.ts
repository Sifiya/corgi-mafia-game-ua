const MAX_WIDTH = 600;
const MAX_HEIGHT = 600;

export const getImageCoverDimensions = (
  image: HTMLImageElement,
  maxWidth: number = MAX_WIDTH,
  maxHeight: number = MAX_HEIGHT,
) => {
  const { width, height } = image;
  let newWidth = width;
  let newHeight = height;

  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }

  if (newHeight < maxHeight) {
    newHeight = maxHeight;
    newWidth = (width * maxHeight) / height;
  }

  return { width: newWidth, height: newHeight };
};

export const getMaxDimensions = (
  width: number,
  height: number,
  maxWidth: number = MAX_WIDTH,
  maxHeight: number = MAX_HEIGHT,
) => {
  let newWidth = width;
  let newHeight = height;

  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }

  if (height > maxHeight) {
    newHeight = maxHeight;
    newWidth = (width * maxHeight) / height;
  }

  return { width: newWidth, height: newHeight };
};

export const compressImage = (
  canvas: HTMLCanvasElement,
  maxSize: number = 1024 * 1024,
  initialQuality: number = 0.9,
  type: string = 'image/jpeg',
): Promise<Blob | null> => {
  let quality = initialQuality;
  return new Promise((resolve) => {
    const compress = () => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        if (blob.size < maxSize || quality <= 0.1) {
          resolve(blob);
          return;
        } else {
          quality -= 0.1;
          compress();
        }
      }, type, quality);
    };

    compress();
  });
};

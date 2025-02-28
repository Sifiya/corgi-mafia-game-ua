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

const STORAGE_FOLDER = 'storage/v1/object/public';

export const getImageUrl = (imageName: string) => {
  const origin = import.meta.env.VITE_SUPABASE_PROJECT_URL;
  const bucket = import.meta.env.VITE_CORGIS_BUCKET_NAME;
  return `${origin}/${STORAGE_FOLDER}/${bucket}/public/${imageName}`;
};

export const getRandomImage = (images: string[]) => {
  return images[Math.floor(Math.random() * images.length)];
};

import supabase from '@/lib/supabase/client';

type UploadFileError = {
  message: string;
  filename: string;
}

export const uploadImages = async (images: File[]) => {
  let errors: UploadFileError[] = [];
  for (const image of images) {
    const { error } = await supabase.storage
      .from(import.meta.env.VITE_CORGIS_BUCKET_NAME)
      .upload(`public/${image.name}`, image);

    if (error) {
      errors.push({
        message: error.message,
        filename: image.name,
      });
    }
  }

  return {
    errors,
  };
};

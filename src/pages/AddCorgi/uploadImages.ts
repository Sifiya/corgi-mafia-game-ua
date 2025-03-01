import supabase from '@/lib/supabase/client';

export const uploadImages = async (images: File[]) => {
  let errors: string[] = [];
  for (const image of images) {
    const { error } = await supabase.storage
      .from(import.meta.env.VITE_CORGIS_BUCKET_NAME)
      .upload(`public/${image.name}`, image);

    if (error) {
      errors.push(`${image.name}: ${error.message}`);
    }
  }

  return {
    errors,
  };
};

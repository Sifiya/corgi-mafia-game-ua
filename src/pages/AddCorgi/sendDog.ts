import supabase from '@/lib/supabase/client';

export type Dog = {
  name: string;
  ownerName: string;
  images: string[];
}

export const sendDog = async (dog: Dog) => {
  const { data, error } = await supabase.from('dogs')
    .insert({
      name: dog.name,
      owner_name: dog.ownerName,
      images: dog.images,
      include: true,
    })
    .select().single();
  return {
    id: data?.id,
    success: !!data,
    error: error?.message,
  };
};


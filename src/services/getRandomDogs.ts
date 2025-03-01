import supabase from '@/lib/supabase/client';

export const getRandomDogs = async (count: number) => {
  return supabase.from('random_dogs').select('*').limit(count);
};

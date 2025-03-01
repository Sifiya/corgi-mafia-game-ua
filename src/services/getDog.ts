import supabase from '@/lib/supabase/client';

export const getDog = async (id: string) => {
  return supabase.from('dogs').select('*').eq('id', id).single();
};

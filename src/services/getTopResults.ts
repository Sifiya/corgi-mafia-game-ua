import supabase from '@/lib/supabase/client';
import type { Result } from '@/features/RatingTable';

const TOP_RESULTS_COUNT = 10;

export const getTopResults = async (): Promise<{ data: Result[] }> => {
  const { data, error } = await supabase.from('results').select('*').order('score', { ascending: false }).limit(TOP_RESULTS_COUNT);
  if (error) {
    throw error;
  }
  return {
    data: data.map((result, index) => ({
      id: result.id,
      name: result.player_name,
      score: result.score,
      time: result.time_taken,
      rank: index + 1,
    })),
  };
};

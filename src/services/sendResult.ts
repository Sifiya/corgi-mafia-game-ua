import supabase from '@/lib/supabase/client';

type GameResult = {
  time: number;
  score: number;
  playerName: string;
}

export const sendResult = async (result: GameResult) => {
  const { data, error } = await supabase.from('results').insert({
    time_taken: result.time,
    score: result.score,
    player_name: result.playerName,
  }).select().single();
  return {
    result: data,
    success: !!data,
    error: error?.message,
  };
};

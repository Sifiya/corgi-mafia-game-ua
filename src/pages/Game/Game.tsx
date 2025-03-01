import { createSignal, Show } from 'solid-js';
import { cn } from '@/utils/class.utils';
import { sendResult } from '@/services/sendResult';

import { Header } from '@/features/header';
import { StageInputName } from '@/features/game/StageInputName';
import { StageQuiz } from '@/features/game/StageQuiz';
import { StageResult } from '@/features/game/StageResult';
import type { Component } from 'solid-js';

enum GameStage {
  InputName = 0,
  Game = 1,
  Result = 2,
}

const Game: Component = () => {
  const [stage, setStage] = createSignal<GameStage>(GameStage.Game);
  const [name, setName] = createSignal<string>('');
  const [resultId, setResultId] = createSignal<number | null>(null);

  const handleFirstStage = (name: string) => {
    setStage(GameStage.Game);
    setName(name);
  };

  const handleFinishGame = async (data: {
    score: number;
    time: number;
  }) => {
    const { id } = await sendResult({
      playerName: name(),
      score: data.score,
      time: data.time,
    });
    setResultId(id);
    setStage(GameStage.Result);
  };

  return (
    <>
      <Header />
      <section class={cn(
        'flex flex-col gap-5 grow justify-center items-center',
      )}>
        <Show when={stage() === GameStage.InputName}>
          <StageInputName onNext={handleFirstStage} />
        </Show>

        <Show when={stage() === GameStage.Game}>
          <StageQuiz handleFinishGame={handleFinishGame} />
        </Show>

        <Show when={stage() === GameStage.Result}>
          <StageResult resultId={resultId() ?? 0} />
        </Show>
      </section>
    </>
  );
};

export default Game;

import { createSignal, Show } from 'solid-js';
// import { useTranslationContext } from '@/lib/i18n/context';
import { cn } from '@/utils/class.utils';

import { Header } from '@/features/header';
import { StageInputName } from '@/features/game/StageInputName';
import { StageQuiz } from '@/features/game/StageQuiz';
import type { Component } from 'solid-js';

enum GameStage {
  InputName = 0,
  Game = 1,
}

const Game: Component = () => {
  // const i18n = useTranslationContext();
  const [stage, setStage] = createSignal<GameStage>(GameStage.Game);
  const [name, setName] = createSignal<string>('');

  const handleFirstStage = (name: string) => {
    setStage(GameStage.Game);
    setName(name);
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
          <StageQuiz />
        </Show>
      </section>
    </>
  );
};

export default Game;

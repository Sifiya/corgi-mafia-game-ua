import { createSignal, Show } from 'solid-js';
// import { useTranslationContext } from '@/lib/i18n/context';
import { cn } from '@/utils/class.utils';

import { Header } from '@/features/header';
import { StageInputName } from '@/features/game/StageInputName';
import type { Component } from 'solid-js';

enum GameStage {
  InputName = 0,
}

const Game: Component = () => {
  // const i18n = useTranslationContext();
  const [stage] = createSignal<GameStage>(GameStage.InputName);
  return (
    <>
      <Header />
      <section class={cn(
        'flex flex-col gap-5 grow justify-center items-center',
        'p-10'
      )}>
        <Show when={stage() === GameStage.InputName}>
          <StageInputName />
        </Show>
      </section>
    </>
  );
};

export default Game;

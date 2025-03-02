import './loader.css';
import { Show } from 'solid-js';
import { cn } from '@/utils/class.utils';
import type { Component } from 'solid-js';

type LoaderProps = {
  class?: string;
  show?: boolean;
};

export const Loader: Component<LoaderProps> = (props) => {
  return (
    <Show when={props.show}>
      <div class="fixed inset-0 bg-background/60 flex justify-center items-center">
        <div class={cn('corgi-game-loader scale-200', props.class)} />
      </div>
    </Show>
  );
};
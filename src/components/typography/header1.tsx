import { cn } from '@/utils/class.utils';
import type { JSX } from 'solid-js';

type header1Props = {
  class?: string;
  style?: JSX.CSSProperties;
  children: JSX.Element | string;
};

export const Header1 = (props: header1Props) => {
  return (
    <h1
      style={props.style}
      class={cn('text-4xl font-bold', props.class)}
    >
      {props.children}
    </h1>
  );
};

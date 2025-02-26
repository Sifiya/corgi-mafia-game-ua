import { cn } from '@/utils/class.utils';
import { cva } from 'class-variance-authority';
import type { Component, JSX } from 'solid-js';

const paragraphVariants = cva(
  '',
  {
    variants: {
      variant: {
        primary: 'text-foreground',
        secondary: 'text-muted-foreground/70',
      }
    },
    defaultVariants: {
      variant: 'primary',
    }
  },
);

type ParagraphProps = {
  children: string;
  style?: JSX.CSSProperties;
  class?: string;
  variant?: 'primary' | 'secondary';
};

export const Paragraph: Component<ParagraphProps> = (props) => {
  return (
    <p
      style={props.style}
      class={cn(
        paragraphVariants({ variant: props.variant }),
        props.class,
      )}
    >
      {props.children}
    </p>
  );
};

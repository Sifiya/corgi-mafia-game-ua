import './loader.css';
import { cn } from '@/utils/class.utils';
type LoaderProps = {
  class?: string;
};

export const Loader = (props: LoaderProps) => {
  return (
    <div class={cn('corgi-game-loader', props.class)} />
  );
};
import { cn } from '@/utils/class.utils';
type ImageProps = {
  src: string;
  class?: string;
  width?: number;
  height?: number;
};

export const Image = (props: ImageProps) => {
  const width = props.width ?? 100;
  const height = props.height ?? 100;

  return (
    <img
      src={props.src}
      width={width}
      height={height}
      class={cn(
        'rounded-full',
        'shadow-md',
        props.class,
      )}
    />
  );
};

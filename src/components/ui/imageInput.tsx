import { cn } from '@/utils/class.utils';

type ImageInputProps = {
  class?: string;
  onInput: (file: File) => void;
};

export const ImageInput = (props: ImageInputProps) => {

  return (
    <label class={cn(
      'w-32 h-32',
      'rounded-full',
      'border-border border-4',
      'flex items-center justify-center',
      'cursor-pointer',
      'relative',
      props.class,
    )}>
      <div class="absolute inset-0 top-1 p-3" aria-hidden="true">
        <img src="/src/assets/corgi-shadow.png" class="w-full h-full" />
        <i class="ri-add-fill absolute left-1/2 top-1/2 -translate-x-[65%] -translate-y-[30%] text-5xl text-background" />
      </div>
      <input
        type="file"
        accept="image/png, image/jpeg"
        capture="environment"
        class="hidden"
        onChange={(event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            props.onInput(file);
          }
        }}
      />
    </label>
  );
};

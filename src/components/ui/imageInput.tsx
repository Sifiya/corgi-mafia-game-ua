import { cn } from '@/utils/class.utils';

type ImageInputProps = {
  class?: string;
  onInput: (file: File) => void;
  ref?: HTMLInputElement;
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
        ref={props.ref}
        type="file"
        accept="image/png, image/jpeg"
        capture="environment"
        class="hidden"
        onChange={(event) => {
          const input = event.target as HTMLInputElement;
          if (!input.files?.length) return;

          const file = input.files[0];
          if (!file.type.startsWith('image/')) {
            return;
          }

          props.onInput(file);
        }}
      />
    </label>
  );
};

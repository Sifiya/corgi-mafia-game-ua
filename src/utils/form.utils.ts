import { createSignal } from 'solid-js';

type UseTextFieldProps = {
  initialValue?: string;
  checkValidity?: (value: string) => {
    isValid: boolean;
    errorMessage?: string;
  };
};

export const useTextField = (props: UseTextFieldProps) => {
  const [value, setValue] = createSignal(props.initialValue || '');
  const [isDirty, setIsDirty] = createSignal(false);
  const [state, setState] = createSignal<{
    isValid: boolean;
    errorMessage?: string;
  }>(
    props.checkValidity?.(value()) || { isValid: true },
  );

  const onValueChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setValue(value);
    setIsDirty(true);
    if (props.checkValidity) {
      setState(props.checkValidity(value));
    }
  };

  return {
    value,
    onValueChange,
    state,
    isDirty,
  };
};

type UseMultipleImagesFieldProps = {
  checkValidity?: (value: File[]) => {
    isValid: boolean;
    errorMessage?: string;
  };
};

export const useMultipleImagesField = (props: UseMultipleImagesFieldProps) => {
  const [images, setImages] = createSignal<File[]>([]);
  const [isDirty, setIsDirty] = createSignal(false);
  const [state, setState] = createSignal<{
    isValid: boolean;
    errorMessage?: string;
  }>(
    props.checkValidity?.(images()) || { isValid: true },
  );

  const onChange = (files: File[]) => {
    setImages(files);
    setIsDirty(true);
    if (props.checkValidity) {
      setState(props.checkValidity(files));
    }
  };

  return {
    images,
    onChange,
    state,
    isDirty,
  };
};
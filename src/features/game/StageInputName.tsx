import { useTranslationContext } from '@/lib/i18n/context';
import { useTextField } from '@/utils/form.utils';
import { validate } from '@/lib/zod/utils';
import { z } from 'zod';

import {
  TextField,
  TextFieldDescription,
  TextFieldLabel,
  TextFieldRoot,
  TextFieldErrorMessage,
} from '@/components/ui/textfield';
import { Button } from '@/components/ui/button';
import { Show, type Component } from 'solid-js';
import type { Dictionary } from '@/lib/i18n/types';

const nameSchema = z.string()
  .min(1, { message: 'IS_REQUIRED_ERROR' })
  .max(60, { message: 'MAX_LENGTH_ERROR' })
  .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9'ʼ-\s]+$/, { message: 'INVALID_CHARACTERS_ERROR' });

type StageInputNameProps = {
  onNext: (name: string) => void;
}

export const StageInputName: Component<StageInputNameProps> = (props) => {
  const i18n = useTranslationContext();
  const name = useTextField({
    initialValue: '',
    checkValidity: (value) => validate(nameSchema, value),
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    props.onNext(name.value());
  };

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-5 w-full max-w-md mt-8">
      <TextFieldRoot
        class="flex flex-col gap-0.5"
        validationState={(!name.isDirty() || name.state().isValid) ? 'valid' : 'invalid'}
      >
        <TextFieldLabel>{i18n.t('GAME_STAGE_INPUT_NAME_LABEL')}</TextFieldLabel>
        <TextField
          value={name.value()}
          onInput={name.onValueChange}
          placeholder={i18n.t('GAME_STAGE_INPUT_NAME_PLACEHOLDER')}
        />
        <TextFieldDescription>{i18n.t('GAME_STAGE_INPUT_NAME_DESCRIPTION')}</TextFieldDescription>
        <Show when={name.isDirty() && !!name.state().errorMessage}>
          <TextFieldErrorMessage>
            {i18n.t(name.state().errorMessage as keyof Dictionary)}
          </TextFieldErrorMessage>
        </Show>
      </TextFieldRoot>

      <Button type="submit" disabled={!name.state().isValid}>
        {i18n.t('GAME_STAGE_INPUT_NAME_BUTTON')}
      </Button>
    </form>
  );
};

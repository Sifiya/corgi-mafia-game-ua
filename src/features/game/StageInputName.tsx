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
import { Show, type Component, onMount } from 'solid-js';
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
  const savedName = localStorage.getItem('playerName') || '';
  const ownerSavedName = localStorage.getItem('ownerName') || '';

  const name = useTextField({
    initialValue: savedName || ownerSavedName,
    checkValidity: (value) => validate(nameSchema, value),
  });

  onMount(() => {
    if (savedName && validate(nameSchema, savedName).isValid) {
      props.onNext(savedName);
    }
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const playerName = name.value();
    localStorage.setItem('playerName', playerName);
    props.onNext(playerName);
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

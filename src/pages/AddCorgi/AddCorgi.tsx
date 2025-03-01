import { useTranslationContext } from '@/lib/i18n/context';
import { useAddCorgi } from './useAddCorgi';

import { Show } from 'solid-js';
import { Header1 } from '@/components/typography/header1';
import { Header } from '@/features/header';
import { TextFieldLabel, TextFieldRoot, TextField, TextFieldDescription, TextFieldErrorMessage} from '@/components/ui/textfield';
import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxControl, CheckboxLabel } from '@/components/ui/checkbox';
import { Dictionary } from '@/lib/i18n/types';
import { MultipleImagesInput } from '@/features/multipleImagesInput/multipleImagesInput';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

import type { Component } from 'solid-js';

const AddCorgi: Component = () => {
  const i18n = useTranslationContext();
  const addCorgi = useAddCorgi();

  return (
    <>
      <Header />
      <section class="flex flex-col grow justify-start items-center gap-2 px-6">
        <Header1 class="text-center">{i18n.t('ADD_CORGI_PAGE_TITLE')}</Header1>

        <form
          onSubmit={addCorgi.handleSubmit}
          class="flex flex-col gap-4 w-full max-w-md mt-8"
        >
          <MultipleImagesInput onSave={addCorgi.images.onChange} />

          <TextFieldRoot
            class="flex flex-col gap-0.5"
            validationState={(!addCorgi.corgiName.isDirty() || addCorgi.corgiName.state().isValid) ? 'valid' : 'invalid'}>
            <TextFieldLabel>
              {i18n.t('ADD_CORGI_PAGE_NAME_LABEL')}
            </TextFieldLabel>
            <TextField
              value={addCorgi.corgiName.value()}
              onInput={addCorgi.corgiName.onValueChange}
              type="text"
              name="corgiName"
              placeholder={i18n.t('ADD_CORGI_PAGE_NAME_PLACEHOLDER')}
            />
            {addCorgi.corgiName.isDirty() && !!addCorgi.corgiName.state().errorMessage && (
              <TextFieldErrorMessage>
                {i18n.t(addCorgi.corgiName.state().errorMessage as keyof Dictionary)}
              </TextFieldErrorMessage>
            )}
          </TextFieldRoot>

          <TextFieldRoot
            class="flex flex-col gap-0.5"
            validationState={(!addCorgi.ownerName.isDirty() || addCorgi.ownerName.state().isValid) ? 'valid' : 'invalid'}>
            <TextFieldLabel>{i18n.t('ADD_CORGI_PAGE_OWNER_LABEL')}</TextFieldLabel>
            <TextField
              value={addCorgi.ownerName.value()}
              onInput={addCorgi.ownerName.onValueChange}
              type="text"
              name="ownerName"
              placeholder={i18n.t('ADD_CORGI_PAGE_OWNER_PLACEHOLDER')}
            />
            <TextFieldDescription>{i18n.t('ADD_CORGI_PAGE_OWNER_DESCRIPTION')}</TextFieldDescription>
            {addCorgi.ownerName.isDirty() && !!addCorgi.ownerName.state().errorMessage && (
              <TextFieldErrorMessage>
                {i18n.t(addCorgi.ownerName.state().errorMessage as keyof Dictionary)}
              </TextFieldErrorMessage>
            )}
          </TextFieldRoot>

          <Checkbox
            checked={addCorgi.isOwner()}
            onChange={(checked) => addCorgi.setIsOwner(checked)}
            class="flex items-center gap-2 text-sm"
          >
            <CheckboxControl />
            <CheckboxLabel>
              {i18n.t('ADD_CORGI_PAGE_CHECKBOX_LABEL')}
            </CheckboxLabel>
          </Checkbox>

          <Button type="submit" class="mt-5" disabled={!addCorgi.isFormValid()}>
            {i18n.t('ADD_CORGI_PAGE_BUTTON_ADD_CORGI')}
          </Button>
        </form>

        <Button as="a" href="/" variant="link">
          <i aria-hidden="true" class="ri-arrow-left-s-line mr-px -ml-3" />
          {i18n.t('HEADER_HOME_BUTTON')}
        </Button>

        <Show when={addCorgi.isSendingError()}>
          <Alert variant="destructive" class="max-w-md">
            <AlertTitle>
              {i18n.t('ADD_CORGI_PAGE_ERROR_TITLE')}
            </AlertTitle>
            <AlertDescription>
              {addCorgi.sendingErrors().join(', ')}
            </AlertDescription>
          </Alert>
        </Show>
      </section>
    </>
  );
};

export default AddCorgi;

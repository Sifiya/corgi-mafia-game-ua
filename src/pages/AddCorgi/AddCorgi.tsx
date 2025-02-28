import { useTranslationContext } from '@/lib/i18n/context';
import { useAddCorgi } from './useAddCorgi';
import { Header1 } from '@/components/typography/header1';
import { Header } from '@/features/header';
import { TextFieldLabel, TextFieldRoot, TextField, TextFieldDescription, TextFieldErrorMessage} from '@/components/ui/textfield';
import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxControl, CheckboxLabel } from '@/components/ui/checkbox';
import { Dictionary } from '@/lib/i18n/types';
import { MultipleImagesInput } from '@/features/multipleImagesInput/multipleImagesInput';

import type { Component } from 'solid-js';

const AddCorgi: Component = () => {
  const i18n = useTranslationContext();
  const { corgiName, ownerName, isOwner, setIsOwner, handleSubmit, isFormValid } = useAddCorgi();

  // TODO: save images to the database
  const handleSave = (files: File[]) => {
    console.log(files);
  };

  return (
    <>
      <Header />
      <section class="flex flex-col grow justify-start items-center gap-5 md:gap-8 px-6">
        <Header1 class="text-center">{i18n.t('ADD_CORGI_PAGE_TITLE')}</Header1>

        <form
          onSubmit={handleSubmit}
          class="flex flex-col gap-4 w-full max-w-md"
        >
          <MultipleImagesInput onSave={handleSave} />

          <TextFieldRoot
            class="flex flex-col gap-0.5"
            validationState={(!corgiName.isDirty() || corgiName.state().isValid) ? 'valid' : 'invalid'}>
            <TextFieldLabel>
              {i18n.t('ADD_CORGI_PAGE_NAME_LABEL')}
            </TextFieldLabel>
            <TextField
              value={corgiName.value()}
              onInput={corgiName.onValueChange}
              type="text"
              name="corgiName"
              placeholder={i18n.t('ADD_CORGI_PAGE_NAME_PLACEHOLDER')}
            />
            {corgiName.isDirty() && !!corgiName.state().errorMessage && (
              <TextFieldErrorMessage>
                {i18n.t(corgiName.state().errorMessage as keyof Dictionary)}
              </TextFieldErrorMessage>
            )}
          </TextFieldRoot>

          <TextFieldRoot
            class="flex flex-col gap-0.5"
            validationState={(!ownerName.isDirty() || ownerName.state().isValid) ? 'valid' : 'invalid'}>
            <TextFieldLabel>{i18n.t('ADD_CORGI_PAGE_OWNER_LABEL')}</TextFieldLabel>
            <TextField
              value={ownerName.value()}
              onInput={ownerName.onValueChange}
              type="text"
              name="ownerName"
              placeholder={i18n.t('ADD_CORGI_PAGE_OWNER_PLACEHOLDER')}
            />
            <TextFieldDescription>{i18n.t('ADD_CORGI_PAGE_OWNER_DESCRIPTION')}</TextFieldDescription>
            {ownerName.isDirty() && !!ownerName.state().errorMessage && (
              <TextFieldErrorMessage>
                {i18n.t(ownerName.state().errorMessage as keyof Dictionary)}
              </TextFieldErrorMessage>
            )}
          </TextFieldRoot>

          <Checkbox
            checked={isOwner()}
            onChange={(checked) => setIsOwner(checked)}
            class="flex items-center gap-2 text-sm"
          >
            <CheckboxControl />
            <CheckboxLabel>
              {i18n.t('ADD_CORGI_PAGE_CHECKBOX_LABEL')}
            </CheckboxLabel>
          </Checkbox>

          <Button type="submit" class="mt-5" disabled={!isFormValid()}>
            {i18n.t('ADD_CORGI_PAGE_BUTTON_ADD_CORGI')}
          </Button>
        </form>
      </section>
    </>
  );
};

export default AddCorgi;

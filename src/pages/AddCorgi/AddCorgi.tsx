import { useTranslationContext } from '@/lib/i18n/context';
import { useAddCorgi } from './useAddCorgi';
import { Header1 } from '@/components/typography/header1';
import { Header } from '@/features/header';
import { TextFieldLabel, TextFieldRoot, TextField} from '@/components/ui/textfield';
import { Button } from '@/components/ui/button';
import type { Component } from 'solid-js';
import { Checkbox, CheckboxControl, CheckboxLabel } from '@/components/ui/checkbox';

const AddCorgi: Component = () => {
  const i18n = useTranslationContext();
  const {
    corgiName,
    ownerName,
    isOwner,
    setCorgiName,
    setOwnerName,
    setIsOwner,
    handleSubmit,
  } = useAddCorgi();

  return (
    <>
      <Header />
      <section class="flex flex-col grow justify-start items-center gap-5 md:gap-8 px-6">
        <Header1 class="text-center">{i18n.t('ADD_CORGI_PAGE_TITLE')}</Header1>

        <form
          onSubmit={handleSubmit}
          class="flex flex-col gap-4 w-full max-w-md"
        >
          <TextFieldRoot class="flex flex-col gap-0.5">
            <TextFieldLabel>
              {i18n.t('ADD_CORGI_PAGE_NAME_LABEL')}
            </TextFieldLabel>
            <TextField
              value={corgiName()}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                setCorgiName(target.value);
              }}
              type="text"
              name="corgiName"
              placeholder={i18n.t('ADD_CORGI_PAGE_NAME_PLACEHOLDER')}
            />
          </TextFieldRoot>

          <TextFieldRoot class="flex flex-col gap-0.5">
            <TextFieldLabel>{i18n.t('ADD_CORGI_PAGE_OWNER_LABEL')}</TextFieldLabel>
            <TextField
              value={ownerName()}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                setOwnerName(target.value);
              }}
              type="text"
              name="ownerName"
              placeholder={i18n.t('ADD_CORGI_PAGE_OWNER_PLACEHOLDER')}
            />
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

          <Button type="submit" class="mt-5">
            {i18n.t('ADD_CORGI_PAGE_BUTTON_ADD_CORGI')}
          </Button>
        </form>
      </section>
    </>
  );
};

export default AddCorgi;

import { createSignal } from 'solid-js';
import { useTextField, useMultipleImagesField } from '@/utils/form.utils';
import { uploadImages } from './uploadImages';
import { z } from 'zod';
import { validate } from '@/lib/zod/utils';
import { sendDog } from './sendDog';
const corgiNameSchema = z.string()
  .min(1, { message: 'IS_REQUIRED_ERROR' })
  .max(200, { message: 'MAX_LENGTH_ERROR' })
  .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9'-\s]+$/, { message: 'INVALID_CHARACTERS_ERROR' });
const ownerNameSchema = z.string()
  .min(1, { message: 'IS_REQUIRED_ERROR' })
  .max(200, { message: 'MAX_LENGTH_ERROR' })
  .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9'-\s]+$/, { message: 'INVALID_CHARACTERS_ERROR' });
const imagesSchema = z.array(z.instanceof(File))
  .nonempty({ message: 'IS_REQUIRED_ERROR' })
  .max(5, { message: 'MAX_IMAGES_ERROR' });

export const useAddCorgi = () => {
  const corgiName = useTextField({
    initialValue: '',
    checkValidity: (value) => validate(corgiNameSchema, value),
  });

  const ownerName = useTextField({
    initialValue: '',
    checkValidity: (value) => validate(ownerNameSchema, value),
  });
  const images = useMultipleImagesField({
    checkValidity: (value) => validate(imagesSchema, value),
  });
  const [isOwner, setIsOwner] = createSignal(false);
  const [isSendingPending, setIsSendingPending] = createSignal(false);
  const [isSendingError, setIsSendingError] = createSignal(false);
  const [sendingErrors, setSendingErrors] = createSignal<string[]>([]);

  const isFormValid = () => {
    return (
      corgiName.state().isValid &&
      ownerName.state().isValid &&
      images.state().isValid &&
      isOwner()
    );
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsSendingPending(true);
    const { errors } = await uploadImages(images.images());
    if (errors.length > 0) {
      setIsSendingError(true);
      setSendingErrors(errors);
      setIsSendingPending(false);
      return;
    }
    const { error } = await sendDog({
      name: corgiName.value(),
      ownerName: ownerName.value(),
      images: images.images().map((image) => image.name),
    });

    setIsSendingPending(false);
    setIsSendingError(!!error);
    setSendingErrors(error ? [error] : []);
  };

  return {
    corgiName,
    ownerName,
    images,
    isOwner,
    setIsOwner,
    handleSubmit,
    isFormValid,
    isSendingPending,
    isSendingError,
    sendingErrors,
  };
};

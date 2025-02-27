import { createSignal } from 'solid-js';
import { useTextField } from '@/utils/form.utils';
import { z } from 'zod';
import { validate } from '@/lib/zod/utils';

const corgiNameSchema = z.string().min(1, { message: 'IS_REQUIRED_ERROR' });
const ownerNameSchema = z.string().min(1, { message: 'IS_REQUIRED_ERROR' });

export const useAddCorgi = () => {
  const corgiName = useTextField({
    initialValue: '',
    checkValidity: (value) => validate(corgiNameSchema, value),
  });

  const ownerName = useTextField({
    initialValue: '',
    checkValidity: (value) => validate(ownerNameSchema, value),
  });
  const [isOwner, setIsOwner] = createSignal(false);

  const isFormValid = () => {
    return corgiName.state().isValid && ownerName.state().isValid;
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    console.log(corgiName.value(), ownerName.value(), isOwner());
  };

  return {
    corgiName,
    ownerName,
    isOwner,
    setIsOwner,
    handleSubmit,
    isFormValid,
  };
};

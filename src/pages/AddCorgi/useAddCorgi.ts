import { createSignal } from 'solid-js';

export const useAddCorgi = () => {
  const [corgiName, setCorgiName] = createSignal('');
  const [ownerName, setOwnerName] = createSignal('');
  const [isOwner, setIsOwner] = createSignal(false);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    console.log(corgiName(), ownerName(), isOwner());
  };

  return {
    corgiName,
    ownerName,
    isOwner,
    setCorgiName,
    setOwnerName,
    setIsOwner,
    handleSubmit,
  };
};

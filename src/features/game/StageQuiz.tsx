import { createSignal, onMount, Show, For } from 'solid-js';
import { getRandomDogs } from '@/services/getRandomDogs';
import { getRandomImage, getImageUrl } from '@/utils/images.utils';
import { ImageRoot, Image } from '@/components/ui/image';
import type { Component } from 'solid-js';
import type { Dog } from '@/pages/AddCorgi/sendDog';

type QuizDog = Omit<Dog, 'images'> & {
  id: string;
  image: string;
}

export const StageQuiz: Component = () => {
  const [dogs, setDogs] = createSignal<QuizDog[]>([]);

  // TODO: add error handling when no dogs are found
  onMount(async () => {
    const response = await getRandomDogs(5);

    if (response.data) {
      const dogs = response.data.map((dog) => ({
        id: dog.id,
        name: dog.name,
        ownerName: dog.owner_name,
        image: getImageUrl(getRandomImage(dog.images)),
      }));
      setDogs(dogs);
    }
  });

  return (
    <div class="w-full max-w-lg flex flex-col items-center gap-3">
      <Show when={dogs().length > 0}>
        <For each={dogs()}>
          {(dog) => (
            <div class="flex flex-col gap-2">
              <ImageRoot class="w-[300px] h-[300px] rounded-lg">
                <Image src={dog.image} alt={dog.name} />
              </ImageRoot>
              <p>{dog.name}</p>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};

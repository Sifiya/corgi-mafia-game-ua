import { createSignal, onMount, Show, For } from 'solid-js';
import { getRandomDogs } from '@/services/getRandomDogs';
import { getRandomImage, getImageUrl } from '@/utils/images.utils';
import { ImageRoot, Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Paragraph } from '@/components/typography/paragraph';
import { Header1 } from '@/components/typography/header1';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import type { Component } from 'solid-js';

type QuizName = {
  id: string;
  name: string;
}

type QuizQuestion = {
  id: string;
  image: string;
  name: string;
  answer?: QuizName;
}

export const StageQuiz: Component = () => {
  const [names, setNames] = createSignal<QuizName[]>([]);
  const [questions, setQuestions] = createSignal<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isGameOver, setIsGameOver] = createSignal(true);
  // TODO: add error handling when no dogs are found
  onMount(async () => {
    const response = await getRandomDogs(5);

    if (response.data) {
      const dogs = response.data.map((dog) => ({
        id: dog.id,
        name: `${dog.name} (${dog.owner_name})`,
        image: getImageUrl(getRandomImage(dog.images)),
      }));

      setNames(dogs.map(({ id, name }) => ({ id, name })));
      setQuestions(dogs.map(({ id, image, name }) => ({ id, image, name })));
    }
  });

  const handleAnswer = (answer: QuizName) => {
    if (currentIndex() === questions().length - 1) {
      setIsGameOver(true);
      return;
    }

    const currentQuestion = questions()[currentIndex()];
    const updatedQuestions = [...questions()];
    updatedQuestions[currentIndex()] = {
      ...currentQuestion,
      answer,
    };
    setQuestions(updatedQuestions);
    setCurrentIndex(currentIndex() + 1);
  };

  return (
    <div class="w-full max-w-xl flex flex-col items-center gap-5">
      <Show when={!isGameOver() && questions().length > 0}>
        <div class="flex flex-col gap-2">
          <ImageRoot class="w-[300px] h-[300px] rounded-lg shadow-md">
            <Image src={questions()[currentIndex()].image} alt={questions()[currentIndex()].name} />
          </ImageRoot>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <For each={names()}>
            {(name) => (
              <Button type="button" variant="outline" class="cursor-pointer" onClick={() => handleAnswer(name)}>
                {name.name}
              </Button>
            )}
          </For>
        </div>
      </Show>

      <Show when={isGameOver()}>
        <Header1>Game over</Header1>
        <div class="flex flex-wrap justify-center gap-2">
          <For each={questions()}>
            {(question) => (
              <Card class="p-3 flex flex-col gap-3 items-center justify-start max-w-[150px]">
                <div class="w-[120px] h-[120px] relative">
                  <ImageRoot class="w-full h-full rounded-lg shadow-md">
                    <Image src={question.image} alt={question.name} />
                  </ImageRoot>
                  <Badge
                    class="absolute bottom-2 -right-2.5"
                    variant={question.answer?.id === question.id ? 'success' : 'destructive'}
                  >
                    {question.answer?.id === question.id ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>
                <Paragraph class="text-center text-sm text-card-foreground">{question.name}</Paragraph>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

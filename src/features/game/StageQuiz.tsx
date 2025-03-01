import { createSignal, onMount, Show, For } from 'solid-js';
import { useTranslationContext } from '@/lib/i18n/context';
import { getRandomDogs } from '@/services/getRandomDogs';
import { getRandomImage, getImageUrl } from '@/utils/images.utils';
import { ImageRoot, Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Paragraph } from '@/components/typography/paragraph';
import { Header1 } from '@/components/typography/header1';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Timer } from '@/features/timer/Timer';

import type { Component } from 'solid-js';

type QuizName = {
  id: string;
  name: string;
  ownerName: string;
}

type QuizQuestion = QuizName & {
  image: string;
  answer?: QuizName;
}

type StageQuizProps = {
  handleFinishGame: (data: {
    score: number;
    time: number;
  }) => void;
}

export const StageQuiz: Component<StageQuizProps> = (props) => {
  const i18n = useTranslationContext();
  const [names, setNames] = createSignal<QuizName[]>([]);
  const [questions, setQuestions] = createSignal<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isGameOver, setIsGameOver] = createSignal(false);
  const [time, setTime] = createSignal(0);
  const [shouldStop, setShouldStop] = createSignal(false);

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

      setNames(dogs.map(({ id, name, ownerName }) => ({ id, name, ownerName })));
      setQuestions(dogs.map(({ id, image, name, ownerName }) => ({ id, image, name, ownerName })));
    }
  });

  const handleAnswer = (answer: QuizName) => {
    if (currentIndex() === questions().length - 1) {
      setShouldStop(true);
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

  const countCorrectAnswers = () => {
    return questions().filter((question) => question.answer?.id === question.id).length;
  };

  return (
    <div class="w-full max-w-[1000px] flex flex-col items-center gap-5">
      <Timer shouldStop={shouldStop()} handleStop={setTime} />

      <Show when={!isGameOver() && questions().length > 0}>
        <div class="flex flex-col gap-2">
          <ImageRoot class="w-[300px] h-[300px] rounded-lg shadow-md">
            <Image src={questions()[currentIndex()].image} alt={questions()[currentIndex()].name} />
          </ImageRoot>
        </div>

        <div class="grid grid-cols-2 gap-2 min-w-[300px]">
          <For each={names()}>
            {(item) => (
              <Button type="button" variant="outline" class="flex-col h-auto hover:bg-muted/50" onClick={() => handleAnswer(item)}>
                <span class="text-base">{item.name}</span>
                <span class="text-sm text-muted-foreground/80">{item.ownerName}</span>
              </Button>
            )}
          </For>
        </div>
      </Show>

      <Show when={isGameOver()}>
        <Header1>{i18n.t('FINISH_GAME_RESULT_TITLE')} {countCorrectAnswers()}</Header1>

        <Button
          size="lg"
          class="flex items-center"
          onClick={() => props.handleFinishGame({
            score: countCorrectAnswers(),
            time: time(),
          })}
        >
          {i18n.t('FINISH_GAME_BUTTON')}
          <i class="ri-arrow-right-up-line text-xl" />
        </Button>

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
                <Paragraph class="text-center text-sm text-card-foreground flex flex-col gap-0.5">
                  <span>{question.name}</span>
                  <span class="text-xs opacity-70">{question.ownerName}</span>
                </Paragraph>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

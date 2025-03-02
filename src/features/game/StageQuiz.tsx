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
import { Loader } from '@/components/ui/loader';

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
  const [isLoading, setIsLoading] = createSignal(false);
  const [names, setNames] = createSignal<QuizName[]>([]);
  const [questions, setQuestions] = createSignal<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isGameOver, setIsGameOver] = createSignal(false);
  const [time, setTime] = createSignal(0);
  const [shouldStop, setShouldStop] = createSignal(false);

  // TODO: add error handling when no dogs are found
  onMount(async () => {
    setIsLoading(true);
    const response = await getRandomDogs(15);
    setIsLoading(false);

    if (response.data) {
      const dogs = response.data.map((item) => {
        const dog = item as unknown as {
          id: string;
          name: string;
          owner_name: string;
          images: string[];
        };
        return {
          id: dog.id,
          name: dog.name,
          ownerName: dog.owner_name,
          image: getImageUrl(getRandomImage(dog.images)),
        };
      });

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
      <Loader show={isLoading()} />

      <Show when={!isLoading()}>
        <Timer shouldStop={shouldStop()} handleStop={setTime} />
      </Show>

      <Show when={!isGameOver() && questions().length > 0}>
        <div class="flex flex-col gap-2">
          <ImageRoot class="w-[300px] h-[300px] rounded-lg shadow-md">
            <Image src={questions()[currentIndex()].image} alt={questions()[currentIndex()].name} />
          </ImageRoot>
        </div>

        <div class="grid grid-cols-3 gap-2 min-w-[300px]">
          <For each={names()}>
            {(item) => (
              <Button type="button" size="sm" variant="outline" class="flex-col h-auto hover:bg-muted/50" onClick={() => handleAnswer(item)}>
                <span class="text-base">{item.name}</span>
                <span class="text-sm text-muted-foreground/80">{item.ownerName}</span>
              </Button>
            )}
          </For>
        </div>
      </Show>

      <Show when={isGameOver()}>
        <div class="flex flex-col items-center justify-center gap-8 py-8 px-4 mx-auto">
          <div class="text-center">
            <Header1 class="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
              {i18n.t('FINISH_GAME_RESULT_TITLE')} {countCorrectAnswers()}/{questions().length}
            </Header1>
            <p class="text-muted-foreground text-lg">Час гри: {time()} секунд</p>
          </div>

          <Button
            size="lg"
            class="flex items-center gap-2 px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-md"
            onClick={() => props.handleFinishGame({
              score: countCorrectAnswers(),
              time: time(),
            })}
          >
            {i18n.t('FINISH_GAME_BUTTON')}
            <i class="ri-arrow-right-up-line text-xl" />
          </Button>

          <div class="flex flex-wrap justify-center gap-4 mt-4 max-w-4xl">
            <For each={questions()}>
              {(question) => (
                <Card class="p-4 flex flex-col gap-3 items-center justify-start max-w-[170px] hover:shadow-lg transition-shadow duration-300 border-2 border-opacity-50 border-muted">
                  <div class="w-[140px] h-[140px] relative rounded-lg">
                    <ImageRoot class="w-full h-full rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                      <Image src={question.image} alt={question.name} />
                    </ImageRoot>
                    <Badge
                      class="absolute bottom-2 -right-2.5 font-medium shadow-sm"
                      variant={question.answer?.id === question.id ? 'success' : 'destructive'}
                    >
                      {question.answer?.id === question.id ? i18n.t('QUIZ_CORRECT_ANSWER') : i18n.t('QUIZ_INCORRECT_ANSWER')}
                    </Badge>
                  </div>
                  <Paragraph class="text-center text-sm text-card-foreground flex flex-col gap-1 w-full">
                    <span class="font-medium truncate">{question.name}</span>
                    <span class="text-xs text-muted-foreground truncate">{question.ownerName}</span>
                  </Paragraph>
                </Card>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};

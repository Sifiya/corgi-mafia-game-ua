import { onMount, createSignal } from 'solid-js';
import { useTranslationContext } from '@/lib/i18n/context';
import { getTopResults } from '@/services/getTopResults';
import { Header } from '@/features/header';
import { Header1 } from '@/components/typography/header1';
import { Button } from '@/components/ui/button';
import { RatingTable, type Result } from '@/features/RatingTable';
import { Loader } from '@/components/ui/loader';
import type { Component } from 'solid-js';

const Rating: Component = () => {
  const i18n = useTranslationContext();
  const [isLoading, setIsLoading] = createSignal(false);
  const [topResults, setTopResults] = createSignal<Result[]>([]);

  onMount(async () => {
    setIsLoading(true);
    const { data } = await getTopResults();
    if (data) {
      setTopResults(data);
    }
    setIsLoading(false);
  });

  return (
    <>
      <Header />
      <Loader show={isLoading()} />
      <section class="max-w-xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        <Header1 class="text-center">{i18n.t('RATING_TABLE_TITLE')}</Header1>
        <RatingTable topResults={topResults} />
        <Button
          as="a"
          href="/game"
          size="lg"
        >
          <i aria-hidden="true" class="text-lg ri-play-large-fill mr-1 -ml-2" />
          {i18n.t('MAIN_PAGE_BUTTON_START')}
        </Button>
      </section>
    </>
  );
};

export default Rating;

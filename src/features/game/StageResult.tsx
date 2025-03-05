import { onMount, createSignal } from 'solid-js';
import { useTranslationContext } from '@/lib/i18n/context';
import { getTopResults } from '@/services/getTopResults';
import { Header1 } from '@/components/typography/header1';
import { RatingTable } from '../RatingTable';
import { Button } from '@/components/ui/button';
import type { Component } from 'solid-js';
import type { Result } from '@/features/RatingTable';
import { Loader } from '@/components/ui/loader';
import { DonateLink } from '../DonateLink';

type StageResultProps = {
  result: Omit<Result, 'rank'> | null;
  onPlayAgain: () => void;
}

export const StageResult: Component<StageResultProps> = (props) => {

  const i18n = useTranslationContext();
  const [topResults, setTopResults] = createSignal<Result[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  onMount(async () => {
    setIsLoading(true);
    const { data } = await getTopResults();
    setIsLoading(false);
    if (!data) return;
    const newTopResults = data;

    if (props.result) {
      const result = props.result;
      const playerResultIndex = newTopResults.findIndex((r) => r.id === result.id);
      if (playerResultIndex !== -1) {
        newTopResults[playerResultIndex].shouldHighlight = true;
      } else {
        newTopResults.push({
          ...result,
          shouldHighlight: true,
          rank: newTopResults.length + 1,
        });
      }
    }

    setTopResults(data);
  });

  return (
    <div class="max-w-xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
      <Loader show={isLoading()} />
      <Header1 class="text-center">{i18n.t('RATING_TABLE_TITLE')}</Header1>
      <RatingTable topResults={topResults} />
      <Button
        onClick={props.onPlayAgain}
        size="lg"
      >
        <i aria-hidden="true" class="text-lg ri-play-large-fill mr-1 -ml-2" />
        {i18n.t('RATING_STAGE_PLAY_AGAIN_BUTTON')}
      </Button>

      <DonateLink />
    </div>
  );
};
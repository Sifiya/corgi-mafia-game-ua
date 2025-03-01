import { onMount, createSignal, For, Show } from 'solid-js';
import { useTranslationContext } from '@/lib/i18n/context';
import supabase from '@/lib/supabase/client';
import { formatSeconds } from '@/utils/time.utils';
import { Header } from '@/features/header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header1 } from '@/components/typography/header1';
import { Button } from '@/components/ui/button';
import type { Component } from 'solid-js';

type Result = {
  id: string;
  name: string;
  score: number;
  time: number;
  rank: number;
};

const Rating: Component = () => {
  const i18n = useTranslationContext();
  const [topResults, setTopResults] = createSignal<Result[]>([]);

  onMount(async () => {
    const { data } = await supabase.from('results').select('*').order('score', { ascending: false }).limit(10);
    if (data) {
      setTopResults(data.map((result: { id: string; player_name: string; score: number; time_taken: number }, index: number) => ({
        id: result.id,
        name: result.player_name,
        score: result.score,
        time: result.time_taken,
        rank: index + 1,
      })));
    }
  });

  return (
    <>
      <Header />
      <section class="max-w-xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        <Header1 class="text-center">{i18n.t('RATING_TABLE_TITLE')}</Header1>
        <div class="rounded-xl overflow-hidden shadow-lg border border-primary/20">
          <Table class="w-full">
            <TableHeader>
              <TableRow class="bg-gradient-to-r from-primary/20 to-primary-foreground/20">
                <TableHead class="py-4 text-center font-bold text-foreground">{i18n.t('RATING_TABLE_HEAD_RANK')}</TableHead>
                <TableHead class="py-4 text-center font-bold text-foreground even:bg-primary/5">{i18n.t('RATING_TABLE_HEAD_NAME')}</TableHead>
                <TableHead class="py-4 text-center font-bold text-foreground">{i18n.t('RATING_TABLE_HEAD_SCORE')}</TableHead>
                <TableHead class="py-4 text-center font-bold text-foreground even:bg-primary/5">{i18n.t('RATING_TABLE_HEAD_TIME')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={topResults()}>
                {(result) => (
                  <TableRow class="hover:bg-muted/50 transition-colors odd:bg-background even:bg-muted/20">
                    <TableCell class="py-3 text-center odd:bg-primary/5 flex items-center justify-center gap-2">
                      <Show when={result.rank === 1}>
                        <i class="ri-trophy-fill text-xl text-yellow-500 drop-shadow" />
                      </Show>
                      <Show when={result.rank === 2}>
                        <i class="ri-trophy-fill text-xl text-gray-500 drop-shadow" />
                      </Show>
                      <Show when={result.rank === 3}>
                        <i class="ri-trophy-fill text-xl text-orange-500 drop-shadow" />
                      </Show>
                      {result.rank}
                    </TableCell>
                    <TableCell class="py-3 text-center">{result.name}</TableCell>
                    <TableCell class="py-3 text-center odd:bg-primary/5 font-medium">{result.score}</TableCell>
                    <TableCell class="py-3 text-center">{formatSeconds(result.time)}</TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </div>

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

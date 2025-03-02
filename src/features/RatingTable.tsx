import { useTranslationContext } from '@/lib/i18n/context';
import { cn } from '@/utils/class.utils';
import { formatSeconds } from '@/utils/time.utils';
import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Accessor, Component } from 'solid-js';

export interface Result {
  shouldHighlight?: boolean;
  id: string;
  name: string;
  score: number;
  time: number;
  rank: number;
};

type RatingTableProps = {
  topResults: Accessor<Result[]>;
};

export const RatingTable: Component<RatingTableProps> = (props) => {
  const i18n = useTranslationContext();
  return (
    <div class="rounded-xl overflow-hidden shadow-lg border border-primary/20">
      <Table class="w-full overflow-hidden">
        <TableHeader>
          <TableRow class="bg-gradient-to-r from-primary/20 to-primary-foreground/20">
            <TableHead class="py-4 text-center font-bold text-foreground">{i18n.t('RATING_TABLE_HEAD_RANK')}</TableHead>
            <TableHead class="py-4 text-center font-bold text-foreground even:bg-primary/5">{i18n.t('RATING_TABLE_HEAD_NAME')}</TableHead>
            <TableHead class="py-4 text-center font-bold text-foreground">{i18n.t('RATING_TABLE_HEAD_SCORE')}</TableHead>
            <TableHead class="py-4 text-center font-bold text-foreground even:bg-primary/5">{i18n.t('RATING_TABLE_HEAD_TIME')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="relative overflow-hidden">
          <For each={props.topResults()}>
            {(result) => (
              <TableRow class={cn(
                'hover:bg-muted/50 transition-colors odd:bg-background even:bg-muted/20',
                result.shouldHighlight && 'bg-blue-200/50  hover:bg-blue-300/50 scale-105 font-medium shadow-md relative z-10'
              )}>
                <TableCell class={cn(
                  'py-3 text-center odd:bg-primary/5 flex items-center justify-center gap-2',
                  result.shouldHighlight && 'bg-blue-300/50 odd:bg-blue-300/50'
                )}>
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
                <TableCell class={cn(
                  'py-3 text-center',
                  result.shouldHighlight && 'bg-blue-100/50'
                )}>{result.name}</TableCell>
                <TableCell class={cn(
                  'py-3 text-center odd:bg-primary/5 font-medium',
                  result.shouldHighlight && 'bg-blue-300/50 odd:bg-blue-300/50'
                )}>{result.score}</TableCell>
                <TableCell class={cn(
                  'py-3 text-center',
                  result.shouldHighlight && 'bg-blue-100/50'
                )}>{formatSeconds(result.time)}</TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </div>
  );
};
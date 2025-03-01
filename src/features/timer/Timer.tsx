import { createSignal, createEffect, onCleanup, onMount } from 'solid-js';
import { Card } from '@/components/ui/card';
import { Paragraph } from '@/components/typography/paragraph';

type TimerProps = {
  shouldStop: boolean;
  handleStop: (time: number) => void;
}

export const Timer = (props: TimerProps) => {
  let interval: ReturnType<typeof setInterval>;
  const [time, setTime] = createSignal(0);

  const getSeconds = () => {
    return (time() % 60).toString().padStart(2, '0');
  };

  const getMinutes = () => {
    return (Math.floor(time() / 60)).toString().padStart(2, '0');
  };

  createEffect(() => {
    if (props.shouldStop) {
      clearInterval(interval);
      props.handleStop(time());
    }
  });

  onMount(() => {
    interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3 bg-gradient-to-r from-primary/10 to-primary-foreground/10 rounded-xl shadow-md">
      <Card class="p-4 bg-gradient-to-b from-background to-background/80 border-2 border-primary/20 shadow-inner">
        <span class="text-4xl font-bold text-primary">{getMinutes()}</span>
      </Card>
      <Paragraph class="text-4xl font-bold text-primary animate-pulse">:</Paragraph>
      <Card class="p-4 bg-gradient-to-b from-background to-background/80 border-2 border-primary/20 shadow-inner">
        <span class="text-4xl font-bold text-primary">{getSeconds()}</span>
      </Card>
    </div>
  );
};
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
    <div class="grid gap-2 grid-cols-[1fr_auto_1fr] items-center">
      <Card class="p-3">
        <span class="text-3xl font-bold">{getMinutes()}</span>
      </Card>
      <Paragraph class="text-3xl font-bold">:</Paragraph>
      <Card class="p-3">
        <span class="text-3xl font-bold">{getSeconds()}</span>
      </Card>
    </div>
  );
};
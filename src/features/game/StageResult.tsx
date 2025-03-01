import { onMount } from 'solid-js';
import type { Component } from 'solid-js';

type StageResultProps = {
  resultId: number;
}

export const StageResult: Component<StageResultProps> = (props) => {
  onMount(() => {
    // TODO: get All results
    // TODO: get result by id
    // if result is between the top 10, show the position
    // if result is not between the top 10, show it under the top 10
  });

  return (
    <div>
      <h1>{props.resultId}</h1>
    </div>
  );
};
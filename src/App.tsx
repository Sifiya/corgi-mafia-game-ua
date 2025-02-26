import { TranslationProvider } from '@/lib/i18n/TranslationProvider';

import type { Component } from 'solid-js';
import type { RouteSectionProps } from '@solidjs/router';

const App: Component<RouteSectionProps> = (props) => {
  return (
    <TranslationProvider>
      <div class="flex flex-col min-h-screen lg:max-h-screen lg:overflow-hidden">
        <header>site header</header>
        <main class="grow flex flex-col">
          {props.children}
        </main>
        <footer>site footer</footer>
      </div>
    </TranslationProvider>
  );
};

export default App;

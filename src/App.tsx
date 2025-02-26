import { TranslationProvider } from '@/lib/i18n/TranslationProvider';
import { Footer } from '@/features/footer';

import type { Component } from 'solid-js';
import type { RouteSectionProps } from '@solidjs/router';

const App: Component<RouteSectionProps> = (props) => {
  return (
    <TranslationProvider>
      <div class="flex flex-col min-h-screen lg:max-h-screen lg:overflow-hidden">
        <main class="grow flex flex-col">
          {props.children}
        </main>
        <Footer />
      </div>
    </TranslationProvider>
  );
};

export default App;

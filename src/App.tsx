import type { Component } from 'solid-js';

import { TranslationProvider } from '@/lib/i18n/TranslationProvider';
import Home from './pages/Home';

const App: Component = () => {
  return (
    <TranslationProvider>
      <Home />
    </TranslationProvider>
  );
};

export default App;

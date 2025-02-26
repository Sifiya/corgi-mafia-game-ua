/* @refresh reload */
import { render } from 'solid-js/web';
import { lazy } from 'solid-js';

import './index.css';
import App from './App';
import { Router, Route } from '@solidjs/router';

const Home = lazy(() => import('./pages/Home'));
const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
    </Router>
  ),
  root!,
);

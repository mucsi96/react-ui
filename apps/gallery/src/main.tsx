import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import { NotificationsProvider } from '@mucsi96/react-ui';
import '@mucsi96/react-ui/styles.css';
import { App } from './app';
import './reset.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </HashRouter>
  </StrictMode>,
);

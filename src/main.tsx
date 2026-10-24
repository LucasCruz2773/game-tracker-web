import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/pixelify-sans';
import { App } from './app/App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Missing #root element in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import App from './App.tsx';

// Mobile performance optimizations
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register service worker for caching (can be added later)
  });
}

// Optimize for mobile touch events
document.addEventListener('touchstart', () => {}, { passive: true });

// Disable zoom on double-tap for better mobile UX
let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  { passive: false }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

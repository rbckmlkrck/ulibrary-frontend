/**
 * src/index.tsx
 *
 * This is the main entry point for the React application.
 * It handles rendering the root component and importing global styles.
 *
 * Author: Raul Berrios
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import global styles including Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
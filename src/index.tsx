/**
 * src/index.tsx
 *
 * This file is part of the University Library project.
 * It serves as the main entry point for the React application,
 * responsible for rendering the root `App` component into the DOM.
 *
 * Author: Raul Berrios
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
/**
 * vite.config.ts
 *
 * This file is part of the University Library project.
 * It configures the Vite development server for the frontend application,
 * including server port, plugins, and proxy settings for API requests.
 *
 * Author: Raul Berrios
 */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' loads all env variables, not just those prefixed with VITE_.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.PORT) || 3000, // Use port from .env file, or default to 3000
      proxy: {
        // Proxy API requests to the backend server during local development
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        // Proxy Django admin and static files to the backend during development
        // to ensure the admin panel works correctly.
        '/admin': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/static': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
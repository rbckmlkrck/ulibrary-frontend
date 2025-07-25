# University Library - Frontend

This is the frontend for the University Library system, built with React, TypeScript, and Vite.

## Features

-   User-friendly interface for students and librarians.
-   Login functionality to access role-specific dashboards.
-   Students can browse, search, and filter books.
-   Students can request to check out available books and view their current checkouts.
-   Librarians can manage users and books.
-   Librarians can view all active checkouts and mark books as returned.

## Setup and Installation

Before starting the frontend, ensure the [backend API server](../backend/README.md) is running, as this application depends on it for data.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Create Environment File:**
    Create a `.env` file in the `frontend` directory. This file will hold your local configuration.
    ```.env
    # frontend/.env
    PORT=3000
    ```
    **Note:** The `PORT` is read by the `vite.config.ts` file. API requests are proxied to the backend via the Vite dev server (for local development) or Nginx (in Docker).

3.  **Install dependencies:**
    This will install all the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

4.  **Run the development server:**
    This command starts the Vite development server, which features Hot Module Replacement (HMR) for a fast development experience. It will proxy API requests to the backend as configured in `vite.config.ts`.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Available Scripts

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run preview`: Serves the production build locally to preview it before deployment.

## Makefile Commands

A `Makefile` is provided to simplify common tasks.
- `make build`: Installs dependencies (if needed) and builds the application for production.
- `make install`: Installs dependencies using `npm install`.
- `make clean`: Removes the `node_modules` and `dist` directories.
# Pragyan Frontend

This package is the browser app for Pragyan. It is a React + Vite application that renders the user experience, talks to the backend API, and keeps auth state in sync.

## What Runs Here

- React 18 + TypeScript
- Vite development server
- Route-based UI with lazy-loaded pages
- Auth persistence through local storage and a React context provider
- API calls through a shared client that uses the backend proxy during development

## Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx            # Router and route definitions
│   │   ├── pages/             # Landing, auth, dashboard, roadmap, results, and more
│   │   └── components/        # Shared UI and visual components
│   ├── context/               # App-wide React context providers
│   ├── services/              # API client and feature services
│   ├── styles/                # Global CSS and theme layers
│   ├── types/                 # Frontend TypeScript types
│   └── main.tsx               # React entry point
├── vite.config.ts             # Dev server + API proxy configuration
├── package.json
└── index.html
```

## Prerequisites

- Node.js 18 or newer
- npm 9+ or pnpm 8+
- The backend running locally on port `5000` if you want live data and auth

## First-Time Setup

### 1. Install dependencies

```bash
cd /workspaces/Pragyan/frontend
npm install
```

### 2. Make sure the backend is available

The frontend expects the backend API to be reachable at `http://localhost:5000` during development. The Vite config proxies `/api` to that server.

If the backend is not running, public pages may still render, but authenticated routes and API-backed data will fail.

## Start The Frontend

```bash
cd /workspaces/Pragyan/frontend
npm run dev
```

This starts the Vite dev server on `http://localhost:5173`.

Open `http://localhost:5173` in your browser after the server is ready.

## Recommended Startup Order

1. Start the backend first on `http://localhost:5000`.
2. Start the frontend second on `http://localhost:5173`.
3. Sign in or seed the database if you need protected pages and live dashboard data.

## Production Build

```bash
npm run build
```

This compiles the app into `frontend/dist/`.

## Available Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
```

## Current Routes

The app uses lazy-loaded route pages for faster startup. Main routes include:

- `/` - landing page
- `/auth` - login / registration flow
- `/auth/success` - post-auth success page
- `/dashboard` - user dashboard
- `/assessment` - adaptive assessment flow
- `/results` - assessment or recommendation results
- `/analysis` - detailed analysis views
- `/roadmap` - learning roadmap view
- `/jobs` - job listings and matching views
- `/assistant` - AI assistant experience
- `/profile` - user profile page

Unknown routes redirect back to `/`.

## Frontend Architecture Notes

### App shell

`src/app/App.tsx` owns routing and lazy loads route pages so the first screen can render faster.

### Auth state

`src/context/AuthContext.tsx` keeps the session in local storage and hydrates it on startup. If cached user data exists, the app can render immediately and refresh the user in the background.

### API access

`src/services/apiClient.ts` is the shared request layer. Feature-specific services live beside it in `src/services/`.

### Styling

`src/styles/index.css` pulls in the style layers used by the app, including the theme and font placeholder files that the build still expects.

## Development Tips

- Keep `frontend/vite.config.ts` as the canonical frontend config.
- Keep the backend running when you test protected pages or anything that calls `/api`.
- If the app seems stale after a config change, restart the Vite server.

## Troubleshooting

### The page is blank or still loading

- Confirm the frontend dev server is running.
- Confirm the backend API is running on port `5000`.
- Check the browser console for failed module or API requests.

### Auth is not restoring the session

- Clear site storage and log in again.
- Make sure the backend can reach MongoDB and return `/api/auth/me`.
- Check whether `backend/.env` was changed and the backend was restarted.

### Styles are missing or imports fail

- Make sure `src/styles/index.css` still imports the required style files.
- Keep the placeholder CSS files that the current build expects until the imports are removed.

## Notes For Maintenance

- This package is intentionally self-contained; use this folder when starting the website.
- The frontend has no separate database or server of its own.
- If you add a new page, prefer lazy loading it with the rest of the route pages.

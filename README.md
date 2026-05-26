# Pragyan

Pragyan is an AI-powered career guidance and learning platform. The repository is split into two runnable apps:

- `frontend/` - the React + Vite website
- `backend/` - the Express + TypeScript API, Prisma schema, and seed scripts

Local development uses these default ports:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

The frontend Vite server proxies `/api` requests to the backend during development, so the browser only needs to talk to the frontend origin.

## What Pragyan Does

Pragyan helps users:

- discover careers that fit their interests and skills
- complete adaptive assessments
- view learning roadmaps and progress tracking
- get AI-assisted recommendations and explanations
- explore jobs, roadmaps, and personalized guidance

## Project Layout

```text
Pragyan/
├── frontend/        # Web app
├── backend/         # API server, database schema, tests
├── README.md        # This guide
└── .gitignore       # Shared ignore rules
```

Important frontend folders:

- `frontend/src/app/` - pages, route components, shared UI pieces
- `frontend/src/context/` - React providers such as auth state
- `frontend/src/services/` - API client and feature services
- `frontend/src/styles/` - global CSS entry files and theme layers

Important backend folders:

- `backend/src/` - server bootstrap, routes, controllers, services, middleware
- `backend/prisma/` - Prisma schema and seed file
- `backend/scripts/` - seed/import/check scripts

## Prerequisites

Install these before starting the project:

- Node.js 18 or newer
- npm 9+ or pnpm 8+
- MongoDB Atlas or another MongoDB replica-set compatible database
- Optional AI provider keys if you want live AI responses

## First-Time Setup

### 1. Install dependencies

Install packages inside both app folders:

```bash
cd /workspaces/Pragyan/backend
npm install

cd /workspaces/Pragyan/frontend
npm install
```

### 2. Configure the backend environment

Create the backend environment file from the example:

```bash
cd /workspaces/Pragyan/backend
cp .env.example .env
```

Set at least these values in `backend/.env`:

- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - access-token secret
- `JWT_REFRESH_SECRET` - refresh-token secret
- `FRONTEND_URL` - usually `http://localhost:5173`
- `CORS_ORIGINS` - allowed browser origins

Optional values for AI and caching:

- `AI_PROVIDER`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GROQ_API_KEY`
- `REDIS_URL`

Do not commit `.env` files.

### 3. Prepare the database

From the backend folder:

```bash
cd /workspaces/Pragyan/backend
npm run prisma:generate
npm run prisma:push
```

If you want demo data, run:

```bash
npm run seed
```

The backend validates its environment before it starts listening, so a bad `DATABASE_URL` or missing secret will stop startup early.

## How To Start The Website

Open two terminals and start both services.

### Terminal 1 - Backend

```bash
cd /workspaces/Pragyan/backend
npm run dev
```

This starts the API on `http://localhost:5000`.

### Terminal 2 - Frontend

```bash
cd /workspaces/Pragyan/frontend
npm run dev
```

This starts the website on `http://localhost:5173`.

Open `http://localhost:5173` in your browser after both are running.

## Recommended Startup Order

1. Start the backend first so auth and data requests have a live API.
2. Start the frontend second so Vite can serve the UI and proxy `/api` calls.
3. Seed the database if you want sample roadmaps, jobs, and test accounts.
4. Keep the backend terminal visible because it prints configuration and connection issues clearly.

## Useful Commands

### Frontend

```bash
cd /workspaces/Pragyan/frontend
npm run dev
npm run build
```

### Backend

```bash
cd /workspaces/Pragyan/backend
npm run dev
npm run build
npm run start
npm run seed
npm test
```

### Prisma

```bash
cd /workspaces/Pragyan/backend
npm run prisma:generate
npm run prisma:push
```

## What Lives Where

### Frontend

The frontend is a React app with lazy-loaded routes and an auth context that persists sessions in local storage. Main areas include:

- `frontend/src/app/pages/` - landing, auth, dashboard, assessment, roadmap, results, profile, assistant, and analysis pages
- `frontend/src/app/components/` - shared UI, navigation, and visual components
- `frontend/src/services/` - API wrappers for auth, jobs, roadmaps, assessment, and recommendations
- `frontend/src/context/AuthContext.tsx` - session bootstrap and auth state

### Backend

The backend uses Express, Passport, Prisma, and MongoDB. Main areas include:

- `backend/src/app.ts` - Express app setup, middleware, and route registration
- `backend/src/server.ts` - startup validation, Prisma connection, and server boot
- `backend/src/routes/` - API route modules
- `backend/src/controllers/` - request handlers
- `backend/src/services/` - business logic and AI helpers
- `backend/prisma/schema.prisma` - database schema

## API Areas

The backend exposes grouped routes for:

- authentication
- roadmaps
- progress tracking
- assessments
- AI recommendations
- jobs and career matching
- admin and utility workflows

There is also a health endpoint at `/health`.

## Troubleshooting

### The frontend does not load

- Confirm `frontend/` is running with `npm run dev`.
- Confirm `backend/` is also running on port `5000`.
- Check the browser console for `/api` failures.

### The backend exits immediately

- Check `backend/.env`.
- Confirm `DATABASE_URL` points to a valid MongoDB instance.
- Confirm the MongoDB cluster supports the Prisma MongoDB workflow.

### Auth requests fail

- Confirm `FRONTEND_URL` and `CORS_ORIGINS` include `http://localhost:5173`.
- Make sure the backend is running before logging in.
- Clear browser storage if you have an old invalid session.

### Prisma setup fails

- Run `npm run prisma:generate` again.
- Re-check `backend/prisma/schema.prisma`.
- Run `npm run prisma:push` after the database connection is fixed.

## Notes

- The canonical Vite config for the app is `frontend/vite.config.ts`.
- The backend startup code validates env values before serving traffic.
- Keep placeholder CSS files only if they are still imported by the build.

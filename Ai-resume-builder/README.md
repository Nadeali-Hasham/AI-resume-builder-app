# AI Resume Builder

React + Vite frontend with Strapi backend and Clerk auth.

## Setup

### 1) Frontend (`Ai-resume-builder/`)

Copy env values into `.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_STRAPI_API_KEY=your_strapi_api_token
VITE_STRAPI_URL=http://localhost:1337/api
VITE_BASE_URL=http://localhost:5173
```

Notes:
- Do **not** put Google AI keys in frontend env.
- `VITE_STRAPI_API_KEY` is still used by the SPA today; keep the token scoped and rotate it if exposed.
- Prefer deploying a BFF later so Strapi tokens stay server-only.

```bash
yarn install
yarn dev
```

### 2) Backend (`my-backend/`)

In `my-backend/.env` add:

```
HOST=127.0.0.1
PORT=1337
FRONTEND_URL=http://localhost:5173
GOOGLE_AI_API_KEY=your_google_ai_key
GOOGLE_AI_MODEL=gemini-2.0-flash
```

```bash
cd my-backend
yarn install
yarn develop
```

Install Google SDK in backend if needed:

```bash
cd my-backend
yarn add @google/generative-ai
```

## Features

- Clerk authentication
- Resume CRUD with ownership checks via `X-User-Email`
- Public share view: `GET /api/user-resumes/public/:id`
- AI summary / experience bullets via Strapi (`/api/ai/summary`, `/api/ai/experience`)
- Theme colors, rich-text experience, print-to-PDF download

## Scripts

- `yarn dev` / `yarn dev:frontend` — Vite app
- `yarn dev:backend` — Strapi (`my-backend`)
- `yarn build` — production frontend build

## Security notes

1. Rotate any keys that were previously committed or bundled.
2. Ownership is enforced in Strapi controllers; always send signed-in user email header from the app.
3. Rich text is sanitized before preview/render.
4. CORS is limited to local Vite + `FRONTEND_URL`.

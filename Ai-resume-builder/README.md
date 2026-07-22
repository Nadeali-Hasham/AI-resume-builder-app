# AI Resume Builder

React + Vite frontend, Strapi 5 backend, Clerk auth, server-side Gemini AI.

## Security model

- Browser sends **Clerk session JWT** (`Authorization: Bearer …`).
- Strapi middleware (`global::clerk-auth`) verifies the token with `CLERK_SECRET_KEY`.
- Controllers enforce ownership by verified email — **no client Strapi API token**.
- Public share uses opaque **`shareToken`** (not guessable document ids alone).
- Soft limits: `FREE_RESUME_LIMIT` (default 3 resumes), `AI_DAILY_LIMIT` (default 20 AI calls / 24h / user+IP).

## Setup

### 1) Frontend

`.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_STRAPI_URL=http://localhost:1337/api
VITE_BASE_URL=http://localhost:5173
```

```bash
yarn install
yarn add html2canvas jspdf
yarn dev
```

### 2) Backend (`my-backend/`)

`.env` (see `my-backend/.env.example`):

```
HOST=127.0.0.1
PORT=1337
FRONTEND_URL=http://localhost:5173
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...
GOOGLE_AI_API_KEY=...
GOOGLE_AI_MODEL=gemini-2.0-flash
FREE_RESUME_LIMIT=3
AI_DAILY_LIMIT=20
```

```bash
cd my-backend
npm install
npm run develop
```

Get `CLERK_SECRET_KEY` from the Clerk dashboard (API Keys).

### 3) Docker (Postgres + Strapi)

From repo root, set the same secrets in a root `.env`, then:

```bash
docker compose up --build
```

Frontend still runs via Vite locally (or deploy to Vercel/Netlify with the env vars above and `VITE_STRAPI_URL` pointing at your Strapi host).

## Features

- Clerk JWT auth to Strapi
- Templates: classic / modern / ats
- Sections: experience, education, skills (tags), projects, certifications, languages, links
- JD-aware AI with multiple options
- Real PDF download (`html2canvas` + `jspdf`)
- Share link copy / rotate; duplicate & rename resumes
- Mobile Form | Preview tabs on edit

## Scripts

- `yarn dev` — frontend
- `yarn dev:backend` — Strapi
- `yarn build` — frontend production build
- `node my-backend/tests/rate-limit.test.mjs` — rate-limit unit smoke

## Smoke checklist

1. Sign in → create resume (fails after free limit).
2. Edit personal + AI summary with a JD → pick an option.
3. Switch template → download PDF.
4. Copy share link in a private window → resume loads without sign-in.
5. Rotate share link → old URL 404s.

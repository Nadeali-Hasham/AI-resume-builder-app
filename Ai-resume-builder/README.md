# AI Resume Builder

React + Vite frontend, Strapi 5 backend, Clerk auth, server-side Gemini AI.

## Security model

- Browser sends **Clerk session JWT** (`Authorization: Bearer …`).
- Strapi middleware (`global::clerk-auth`) verifies the JWT via **JWKS** (from `CLERK_PUBLISHABLE_KEY`) and optionally enriches email with `CLERK_SECRET_KEY` (`sk_…`).
- Controllers enforce ownership by **`clerkUserId`** (plus verified / session email for legacy rows).
- Public share uses opaque **`shareToken` only** (document ids are not accepted).
- Soft limits: **AI resumes max 5** (`AI_RESUME_LIMIT`); **manual resumes unlimited**. Daily AI generations: `AI_DAILY_LIMIT` (default 20).

## Go live (checklist)

### A) Clerk (Live)

1. Switch to **Production** instance in Clerk.
2. Copy `pk_live_…` and `sk_live_…`.
3. Add domains: your frontend URL + Strapi admin if needed.
4. Allowed redirect URLs: `https://your-site.com/*`, `https://your-site.com/dashboard`, `https://your-site.com/auth/sign-in`.

### B) Backend (Strapi)

Set `my-backend/.env` (or host secrets):

```
HOST=0.0.0.0
PORT=1337
FRONTEND_URL=https://your-site.com
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
GOOGLE_AI_API_KEY=...
GOOGLE_AI_MODEL=gemini-2.0-flash
FREE_RESUME_LIMIT=5
AI_DAILY_LIMIT=20
APP_KEYS=...unique...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
ENCRYPTION_KEY=...
```

```bash
cd my-backend
npm install
npm run build
npm run start
```

Or Docker from repo root (copy `.env.docker.example` → `.env` first):

```bash
docker compose up --build -d
```

Create the first Strapi admin user once, then lock down `/admin`.

### C) Frontend (Vercel / Netlify)

Build-time env (must be set **before** `yarn build`):

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_STRAPI_URL=https://api.your-domain.com/api
VITE_BASE_URL=https://your-site.com
```

```bash
yarn install
yarn build
```

SPA rewrites are already in `vercel.json` and `public/_redirects`.

### D) Smoke test on live

1. Sign in → create resume (blocks after **5**).
2. Edit + AI summary → save.
3. Switch template → Download PDF.
4. Share link in private window → loads.
5. Rotate share → old link 404s.
6. Mobile: Form / Preview tabs work.

## Local setup

### 1) Frontend

`.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRAPI_URL=http://localhost:1337/api
VITE_BASE_URL=http://localhost:5173
```

```bash
yarn install
yarn dev
```

### 2) Backend (`my-backend/`)

See `my-backend/.env.example`, then:

```bash
cd my-backend
npm install
npm run develop
```

## Features

- Clerk JWT auth to Strapi
- Templates: classic / modern / ats
- Sections: experience, education, skills (levels), projects, certifications, languages, links
- JD-aware AI with multiple options
- Real PDF download (`html2canvas` + `jspdf`)
- Share link copy / rotate; duplicate & rename resumes
- Mobile Form | Preview tabs on edit
- Free plan: **5** resumes / account

## Scripts

- `yarn dev` — frontend
- `yarn dev:backend` — Strapi
- `yarn build` — frontend production build
- `npm test` (in `my-backend`) — rate-limit + public-strip smoke

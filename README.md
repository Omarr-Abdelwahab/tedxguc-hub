# TEDxGUC Hub

The project is split into two folders:

- [frontend](frontend) contains the Vite React app.
- [backend](backend) contains the Node.js API server.

## Run It

Start the frontend from [frontend/package.json](frontend/package.json) and the backend from [backend/package.json](backend/package.json).

From the repository root, you can also run:

- `npm run dev` to start frontend and backend together.
- `npm run dev:frontend` to run only frontend.
- `npm run dev:backend` to run only backend.
- `npm run lint:frontend` to lint the frontend.
- `npm run test:frontend` to run frontend tests.
- `npm run typecheck:frontend` to run the frontend TypeScript check.
- `npm run test:backend` to run backend tests.

The backend exposes:

- `GET /api/health`
- `GET /api/config`
- `POST /api/contact`
- `POST /api/newsletter`

The backend uses Supabase when `SUPABASE_URL` and a Supabase key are configured. Otherwise it falls back to the local SQLite database at [backend/data/tedxguc.sqlite](backend/data/tedxguc.sqlite).

## Vercel Deployment

The repository is configured for a single Vercel project from the repo root:

- the frontend builds from [frontend](frontend) into `frontend/dist`
- the API is exposed through the root [api/[...path].js](api/[...path].js) function
- SPA routes fall back to `frontend/dist/index.html`

For Vercel or any production deployment, point the backend at Supabase so write-backed data such as contact submissions and nominations persist outside the filesystem.

### Required Environment Variables (Vercel)

Set these in the Vercel project settings before redeploying:

- `SUPABASE_URL` (or `SUPABASE_PROJECT_URL`)
- `SUPABASE_SERVICE_ROLE_KEY` (recommended)
- `ADMIN_TOKEN` (required for `/api/submissions/*` and newsletter broadcast)

Optional SMTP variables (only needed for newsletter emails):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

### Redeploy Checklist

1. Ensure Supabase tables exist: `content_items`, `contact_submissions`, `newsletter_subscribers`, `speaker_nominations`.
2. Add the required environment variables in Vercel.
3. Trigger a new deploy from the latest commit.
4. Verify these endpoints after deploy:
	- `/api/health`
	- `/api/content`
	- `/api/talks`

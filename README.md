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

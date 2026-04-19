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

The SQLite database is created automatically at [backend/data/tedxguc.sqlite](backend/data/tedxguc.sqlite) the first time the backend starts.

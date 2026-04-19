# Backend

This folder contains the Node.js + SQLite backend for TEDxGUC Hub.

## Stack

- Runtime: Node.js (ES modules)
- Database: SQLite via `better-sqlite3`
- DB path: `backend/data/tedxguc.sqlite`

## Scripts

- `npm run dev` starts the API server.
- `npm run start` starts the API server.
- `npm run db:reset` removes the SQLite file so it can be recreated and reseeded.

## API Endpoints

- `GET /api/health`
- `GET /api/config`
- `GET /api/content`
- `GET /api/content/:key`
- `GET /api/talks`
- `GET /api/events`
- `GET /api/events/:eventId`
- `GET /api/sponsors`
- `GET /api/org-trees`
- `GET /api/upcoming`
- `POST /api/contact`
- `POST /api/newsletter`
- `POST /api/newsletter/broadcast`
- `GET /api/submissions/contact`
- `GET /api/submissions/newsletter`

`/api/submissions/*` endpoints require admin auth using one of:

- `x-admin-token: <token>` header
- `Authorization: Bearer <token>` header

Set `ADMIN_TOKEN` in your environment before starting the server.

To enable newsletter email delivery, configure SMTP environment variables:

- `SMTP_HOST`
- `SMTP_PORT` (for example `587`)
- `SMTP_SECURE` (`true` for implicit TLS, usually `false` for 587)
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM` (sender address, defaults to `SMTP_USER`)

`POST /api/newsletter/broadcast` body:

- `subject`: string
- `message`: string

Example admin request:

```bash
curl -X POST http://localhost:3001/api/newsletter/broadcast \
	-H "Content-Type: application/json" \
	-H "x-admin-token: <ADMIN_TOKEN>" \
	-d '{"subject":"New TEDxGUC update","message":"Tickets are now live."}'
```

## Notes

- Content is seeded from `backend/seed-content.json`.
- Contact submissions and newsletter subscriptions are persisted in SQLite.
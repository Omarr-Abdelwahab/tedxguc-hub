# Backend

This folder contains the Node.js API backend for TEDxGUC Hub.

The runtime entrypoint is [index.js](index.js), which can be started locally or reused by the root Vercel API function.

## Stack

- Runtime: Node.js (ES modules)
- Database: Supabase REST when configured, with SQLite fallback for local development and tests
- Local DB path: `backend/data/tedxguc.sqlite`

## Scripts

- `npm run dev` starts the API server.
- `npm run start` starts the API server.
- `npm run db:reset` removes the local SQLite file so it can be recreated and reseeded.

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
- `POST /api/nominations/speaker`
- `POST /api/newsletter/broadcast`
- `GET /api/submissions/contact`
- `GET /api/submissions/newsletter`
- `GET /api/submissions/nominations`

`/api/submissions/*` endpoints require admin auth using one of:

- `x-admin-token: <token>` header
- `Authorization: Bearer <token>` header

Set `ADMIN_TOKEN` in your environment before starting the server.

To use Supabase in production, configure:

- `SUPABASE_URL` or `SUPABASE_PROJECT_URL`
- `SUPABASE_SERVICE_ROLE_KEY` recommended, or `SUPABASE_ANON_KEY` if your Supabase policies allow the required reads and writes

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

`POST /api/nominations/speaker` body:

- `nominatorName`: string (nominator's full name)
- `nominatorEmail`: string (nominator's email address)
- `speakerName`: string (speaker's full name)
- `speakerEmail`: string (speaker's email address)
- `speakerTopic`: string (speaker's topic/area of expertise)
- `speakerBio`: string (speaker's background and achievements)
- `whyNominate`: string (why this person should speak)
- `speakerSocialLinks`: string (optional, social media profiles)

Example speaker nomination request:

```bash
curl -X POST http://localhost:3001/api/nominations/speaker \
	-H "Content-Type: application/json" \
	-d '{
		"nominatorName":"John Doe",
		"nominatorEmail":"john@example.com",
		"speakerName":"Jane Smith",
		"speakerEmail":"jane@example.com",
		"speakerTopic":"Social Impact",
		"speakerBio":"Jane is a social entrepreneur with 10 years of experience",
		"whyNominate":"Jane has a unique perspective on community-driven innovation",
		"speakerSocialLinks":"linkedin.com/in/jane-smith"
	}'
```

Example admin request:

```bash
curl -X POST http://localhost:3001/api/newsletter/broadcast \
	-H "Content-Type: application/json" \
	-H "x-admin-token: <ADMIN_TOKEN>" \
	-d '{"subject":"New TEDxGUC update","message":"Tickets are now live."}'
```

## Notes

- Content is seeded from `backend/seed-content.json`.
- Contact submissions, newsletter subscriptions, and speaker nominations are persisted in Supabase when configured, otherwise they use the local SQLite fallback.
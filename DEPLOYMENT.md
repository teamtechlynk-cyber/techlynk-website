# Deployment

## Environment variables

Copy `.env.example` to `.env.local` and set values. For production (e.g. Vercel), configure these in your project settings.

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes (for forms) | Resend API key for contact and journey email |
| `RESEND_FROM_EMAIL` | No | Sender address (default: Resend test domain) |
| `RESEND_TO_EMAIL` | No | Inbox for form submissions |
| `CONTACT_PHONE` | No | Shown by `/api/mail-info` |
| `CONTACT_LOCATION` | No | Shown by `/api/mail-info` |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for SEO (e.g. `https://your-domain.com`) |
| `ADMIN_PASSWORD` | No (required for `/admin`) | Gates the `/admin` job-openings panel. Unset = `/admin` returns 503. |
| `JOBS_DATA_FILE` | No | Path to the job-listings JSON file. **In production this must point outside the deployed code directory** (see below) — defaults to `./data/jobs.json`, which is only safe for local dev. |

## Managing job openings without a deploy

`/admin` lets you toggle roles on/off, edit them, or add new ones — the public site reads the same data file on every request (`app/api/jobs/route.ts` is `force-dynamic`), so changes show up immediately with no rebuild.

The data lives in a plain JSON file (`lib/jobs.ts`), auto-created with the current 5 roles on first read. **Set `JOBS_DATA_FILE` to a path outside the deployed app directory** (e.g. `/opt/techlynk-data/jobs.json` if the app itself lives in `/opt/techlynk`) — this deploy process replaces the whole app directory on every release, so a data file left inside it would be silently wiped on the next deploy. Set both `ADMIN_PASSWORD` and `JOBS_DATA_FILE` in `/etc/techlynk.env` (or your container's env), not in the repo.

## Build and run

Ensure network access when building (Next.js fetches Google Fonts at build time).

```bash
pnpm install
pnpm build
pnpm start
```

## Docker

The image does not include env files (they are in `.dockerignore`). For Resend to work in the container, pass env vars at runtime.

**Using Docker Compose** (recommended): create a `.env` in the project root and set `RESEND_API_KEY` (and optionally `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`). Compose will load it via `env_file: .env`.

```bash
cp .env.example .env
# Edit .env and set RESEND_API_KEY=re_your_key
docker compose up --build
```

**Using `docker run`:** pass the key explicitly or use an env file:

```bash
docker build -t oracle-fusion .
docker run -p 3000:3000 --env-file .env oracle-fusion
# or: docker run -p 3000:3000 -e RESEND_API_KEY=re_xxx -e RESEND_FROM_EMAIL="..." -e RESEND_TO_EMAIL="..." oracle-fusion
```

## Rate limiting

Contact and journey APIs are limited to 10 requests per minute per IP (in-memory). For multi-instance or high traffic, use a Redis-based limiter (e.g. `@upstash/ratelimit`).

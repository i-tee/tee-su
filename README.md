# tee-su

A full-stack web application built on a modern, production-ready stack. Designed as a clean, extensible foundation — easy to scale, customize, and deploy.

---

## Stack

### Frontend

| Technology | Version |
|---|---|
| [Next.js](https://nextjs.org/) | 16 |
| [React](https://react.dev/) | 19 |
| TypeScript | 5 |

### Backend

| Technology | Version |
|---|---|
| [NestJS](https://nestjs.com/) | 11 |
| [TypeORM](https://typeorm.io/) | 0.3 |
| [PostgreSQL](https://www.postgresql.org/) | 16 |
| [AdminJS](https://adminjs.co/) | 6 |
| TypeScript | 5.9 |

### Infrastructure

| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerized development & deployment |
| Beget S3 (S3-compatible) | Cloud object storage for media |

---

## Features

- **Profile** — personal info entity, served via REST API
- **Skills** — skill entries organized into groups
- **Education** — education history entries
- **Images** — media management with dual-storage support:
  - Local filesystem upload via AdminJS panel
  - Optional one-click migration to S3 — upload, get public URL, update DB, remove local file automatically
- **Admin Panel** — full CRUD via AdminJS at `/admin`
- **i18n ready** — Russian locale included, easy to extend

---

## Project Structure

```
tee-su/
├── frontend/          # Next.js app (App Router)
│   └── src/
│       ├── app/       # Pages and layouts
│       ├── components/
│       └── locales/   # i18n translation files
│
├── backend/           # NestJS app
│   └── src/
│       ├── admin/     # AdminJS panel configuration
│       ├── images/    # Image entity + S3 upload service
│       ├── profile/
│       ├── skills/
│       ├── skill-groups/
│       └── education/
│
├── nginx/
│   ├── nginx.conf         # Reverse proxy HTTP (dev/initial)
│   └── nginx.ssl.conf     # Reverse proxy HTTPS (production)
├── docker-compose.yml      # Development
├── docker-compose.prod.yml # Production
├── deploy.sh               # One-command deploy script
└── ssl-init.sh             # One-time SSL setup script
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### Run locally

```bash
git clone <repo-url>
cd tee-su
cp backend/.env.example backend/.env
# fill in backend/.env
docker compose up
```

| Service | URL |
|---|---|
| Frontend | <http://localhost:3000> |
| Backend API | <http://localhost:4000> |
| Admin Panel | <http://localhost:4000/admin> |

### Environment

Required variables in `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/teesu

# Admin panel
ADMIN_AUTH_ENABLED=false
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_COOKIE_SECRET=

# S3 Storage (optional — required only for S3 image upload)
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=
S3_PUBLIC_URL=
```

---

## S3 Image Upload

Images can be stored locally or pushed to any S3-compatible storage (AWS S3, Beget, MinIO, etc.).

In the admin panel, when creating or editing an image, check **Save To S3**. After the file is saved locally, the backend will automatically:

1. Read the file from local storage
2. Upload it to the configured S3 bucket
3. Retrieve the public URL
4. Update the database record
5. Delete the local file

All steps are logged via NestJS Logger for easy debugging.

---

## API

Base URL: `http://localhost:4000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get profile data |
| GET | `/skills` | List all skills |
| GET | `/skill-groups` | List skill groups with skills |
| GET | `/education` | List education entries |
| GET | `/images` | List all images |
| GET | `/images/:id` | Get image by ID |

---

## Extending

The project is intentionally minimal. Common extension points:

- **New entity** — add a module under `backend/src/`, register in `app.module.ts`, add to AdminJS resources in `admin.module.ts`
- **Auth** — enable `ADMIN_AUTH_ENABLED=true` and set credentials in `.env`
- **Frontend pages** — add routes under `frontend/src/app/`
- **Locales** — extend `frontend/src/locales/`

---

## Production Deployment

### Server requirements

- 1 CPU / 1 GB RAM minimum (2 GB RAM recommended)
- 20 GB disk
- Ubuntu 22.04+
- Docker installed
- Domain A-records pointed to the server IP

> **Note:** On 1 GB RAM servers, add swap before deploying:
>
> ```bash
> fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
> echo '/swapfile none swap sw 0 0' >> /etc/fstab
> ```

---

### Step 1 — Prepare the server

```bash
curl -fsSL https://get.docker.com | sh
```

---

### Step 2 — Clone and configure

```bash
git clone <repo-url> /var/www/tee-su
cd /var/www/tee-su
cp backend/.env.example backend/.env
nano backend/.env
```

---

### Step 3 — First deploy (HTTP)

```bash
bash deploy.sh
```

Verify the site is working over HTTP:

| Service | URL |
|---|---|
| Frontend | <http://yourdomain.com> |
| Admin Panel | <http://yourdomain.com/admin> |

---

### Step 4 — Enable HTTPS

> Run once, after the site is accessible over HTTP.

```bash
apt install -y certbot
bash ssl-init.sh
```

The script:

1. Stops nginx temporarily to free port 80
2. Obtains a Let's Encrypt certificate for your domain
3. Switches nginx config to the SSL version (`nginx/nginx.ssl.conf`)
4. Restarts nginx — HTTP redirects to HTTPS automatically

---

### Step 5 — SSL auto-renewal

```bash
crontab -e
```

Add:

```
0 3 * * * certbot renew --quiet && docker compose -f /var/www/tee-su/docker-compose.prod.yml restart nginx
```

---

### Subsequent deploys

```bash
bash deploy.sh
```

Pulls latest code, rebuilds images, restarts containers, removes old images.

---

### Useful commands

```bash
# View all logs
docker compose -f docker-compose.prod.yml logs -f

# View logs for a specific service
docker compose -f docker-compose.prod.yml logs -f backend

# Restart a specific service
docker compose -f docker-compose.prod.yml restart backend

# Stop everything
docker compose -f docker-compose.prod.yml down

# Check disk and image usage
docker system df
```

---

## Known Issues & Solutions

### AdminJS components.bundle.js — 404 in production

**Problem:** In production Docker, AdminJS shows `Component "ComponentX" has not been bundled` error. The bundle file exists at runtime but Express returns 404.

**Root cause:** Two issues combined:

1. Express `send` module ignores dotfile directories by default — returns 404 for any path containing a component starting with `.`. The default AdminJS tmp dir `.adminjs` triggered this.
2. `@adminjs/upload` registers components via `AdminJS.bundle()` only when `uploadFeature()` is called — not at import time, causing a race condition with `initializeAdmin()`.

**Solution:**

- Pre-generate the bundle during Docker build via `backend/scripts/pre-bundle.js`
- Set `ADMIN_JS_TMP_DIR=adminjs` (no leading dot) to bypass Express dotfile restriction
- Set `ADMIN_JS_SKIP_BUNDLE=true` to prevent runtime re-bundling

See: `backend/scripts/pre-bundle.js`, `backend/Dockerfile`, `docker-compose.prod.yml`

---

### Next.js Image Optimization — 400 Bad Request for external URLs

**Problem:** `/_next/image?url=https://...` returns 400 in production.

**Root cause:** `next.config.ts` was not copied to the runner stage in the frontend Dockerfile.

**Solution:** Added `COPY --from=builder /app/next.config.ts ./next.config.ts` to the runner stage in `frontend/Dockerfile`.

---

### Docker build OOM on 1 GB RAM

**Problem:** `nest build` crashes with `JavaScript heap out of memory` during Docker build.

**Solution:**

- Add 2 GB swap (see server requirements above)
- Switch NestJS compiler to SWC: set `"builder": "swc"` in `nest-cli.json`
- Install SWC: `npm install --save-dev @swc/cli @swc/core`

SWC is a Rust-based TypeScript compiler — 20x faster than `tsc` and uses ~10x less memory.

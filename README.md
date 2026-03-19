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
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### Run

```bash
git clone <repo-url>
cd tee-su
docker compose up
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Admin Panel | http://localhost:4000/admin |

### Environment

Copy and fill in the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Required variables:

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
| GET | `/skill-groups` | List skill groups |
| GET | `/education` | List education entries |
| GET | `/images` | List all images |
| GET | `/images/:id` | Get image by ID |

---

## Extending

The project is intentionally minimal. Common extension points:

- **New entity** — add a module under `backend/src/`, register in `app.module.ts`, add to AdminJS resources in `admin.module.ts`
- **Auth** — enable `ADMIN_AUTH_ENABLED=true` and set credentials in `.env`
- **Frontend pages** — add routes under `frontend/src/app/`
- **CI/CD** — add a `Dockerfile` for production builds alongside the existing `Dockerfile.dev`

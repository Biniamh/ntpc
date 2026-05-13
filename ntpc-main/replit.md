# Ethiopian New Testament Priests Church (NTPC) — Full Website

## Overview
A full-featured church website for Ethiopian New Testament Priests Church (NTPC) built with React + Vite (frontend) and Express 5 + PostgreSQL (backend) in a pnpm monorepo.

## Architecture

### Artifacts
- **`artifacts/ntpc-website`** — React + Vite frontend (`@workspace/ntpc-website`) at `/` (port from `$PORT`)
- **`artifacts/api-server`** — Express 5 API server (`@workspace/api-server`) at `/api` (port 8080)

### Shared Libraries
- **`lib/db`** — Drizzle ORM schema + PostgreSQL client (`@workspace/db`)
- **`lib/api-spec`** — OpenAPI 3.0 spec (`@workspace/api-spec`)
- **`lib/api-client-react`** — Auto-generated React Query hooks (`@workspace/api-client-react`)

## Tech Stack
- **Frontend**: React 18, Vite 7, TypeScript, Wouter routing, TanStack Query, shadcn/ui, Tailwind CSS v4, Zustand (auth state), react-hook-form + Zod, date-fns
- **Backend**: Express 5, Drizzle ORM, PostgreSQL, Zod validation, Pino logging, JWT-less token auth
- **Codegen**: Orval → generates React Query hooks + Zod schemas from OpenAPI spec

## Pages
| Route | Description |
|-------|-------------|
| `/` | Home — hero with Amharic slogan, recent posts, events, CTA |
| `/about` | About — vision, mission, core values, visionary section |
| `/departments` | Departments — collapsible accordion list of all 7 departments |
| `/departments/:id` | Department detail — full page per department |
| `/programs` | Programs — Friday (10AM) and Sunday (3PM) services |
| `/events` | Events — upcoming events from API |
| `/posts` | Weekly Posts — sermon highlights with Facebook/YouTube links |
| `/posts/:id` | Post detail page |
| `/youth` | Youth (Excellent Youth) — youth ministry + annual summer camp |
| `/support` | Support Ministry form (support submissions) |
| `/join` | Membership application form |
| `/contact` | Contact info + embedded Google Map |
| `/admin` | Admin panel — requires login (admin/admin). Manage posts, events, scripture, view submissions |
| `/members` | Members panel — requires login (members/members). View membership requests |

## Admin Credentials
- **Admin**: username `admin`, password `admin` (env vars: `ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- **Members**: username `members`, password `members` (env vars: `MEMBERS_USERNAME`, `MEMBERS_PASSWORD`)

## Features
- English / Amharic language toggle (persisted to localStorage)
- Dark / Light / System theme toggle
- Daily Scripture popup (appears 2s after load, dismissable)
- Admin panel with CRUD for posts, events, daily scripture; read-only for submissions
- Members panel showing membership requests table
- Responsive design, mobile menu
- Color palette: Deep Royal Purple `#6b21a8` + Dark Crimson `#8b0000`

## Database Tables
- `departments` — 7 seeded departments with name, description, activities, meeting_time, members[]
- `posts` — Weekly sermon posts with title, highlights, photoUrl, facebookUrl, youtubeUrl
- `events` — Upcoming events with title, description, date, imageUrl
- `scripture` — Daily scripture entries with verse + reference
- `support_submissions` — Ministry support form submissions
- `membership_requests` — Church membership application forms

## Asset Mapping (`@assets` alias → `../../attached_assets`)
- `photo_1_...jpg` — Church logo (circular in Navbar/Footer)
- `photo_2_...jpg` — Visionary/Pastor photo (About page)
- `photo_3_...jpg` — Congregation photo (hero background, multiple pages)
- `photo_4_...jpg` — Church building at night (About + Programs pages)
- `src/assets/youth-camp-1..4.png` — Youth camp photos
- `src/assets/dept-*.png` — Department photos

## API Routes
All routes prefixed with `/api`:
- `GET /health` — Health check
- `POST /api/auth/login` — Login (returns role + token)
- `GET/POST /api/support` — Support submissions
- `GET/POST /api/membership` — Membership requests
- `GET/POST /api/posts`, `GET/DELETE /api/posts/:id`
- `GET/POST /api/events`, `DELETE /api/events/:id`
- `GET /api/scripture`, `POST /api/scripture`
- `GET /api/departments`, `GET /api/departments/:id`

## Regenerating API Client
```bash
pnpm --filter @workspace/api-spec run codegen
```

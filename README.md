# DeskShare

DeskShare is a collaborative study platform where students can discover and join desks, share notebooks and materials, and engage with content through downloads and votes.

## Purpose

DeskShare helps users:

- Create or join desks around classes, clubs, or topics
- Upload and organize study materials inside notebooks
- Browse content quickly in a multi-column layout
- View creator profiles and activity without leaving context

## Implementation pattern

This project follows a layered, feature-oriented architecture:

- **Feature modules** (`src/features/*`) separate domain logic by business capability (desk, notebook, profile, auth, school)
- **Use cases** handle application workflows, business logic, and orchestrate repositories and storage
- **Repositories** encapsulate persistence with Prisma
- **Server actions** expose write operations to the UI
- **Composition layer** wires concrete infrastructure dependencies into use cases
- **React Query hooks** manage client-side data fetching, caching, and invalidation
- **Providers + URL state** coordinate app layout state (selected desk, item, profile, and panel mode)

## Tech stack

- Next.js (App Router)
- React + TypeScript
- React Query
- Prisma
- Supabase (auth + storage)
- Tailwind CSS + shadcn/ui

## Contributing

Commit style and pre-push checks are documented in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Environment

Create a `.env` in the project root (values come from your Supabase project and Postgres provider). The app expects at least:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string for Prisma |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (browser and server) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous/public key |

Optional:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. password-reset redirect fallback) |
| `NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET` | Storage bucket for avatars (default: `avatars`) |

Run migrations and generate the Prisma client after changing the schema:

```bash
npx prisma migrate dev
npx prisma generate
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Start production server (after `build`) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (watch) |
| `npm run test:unit` | Vitest single run |
| `npm run test:e2e` | Playwright |

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

# DeskShare

DeskShare is a collaborative study platform where students can discover and join desks, share notebooks and materials, and engage with content through downloads and votes.

## Purpose

DeskShare helps users:
- Create or join desks around classes, clubs or topics
- Upload and organize study materials inside notebooks
- Browse content quickly in a multi-column layout
- View creator profiles and activity without leaving context

## Implementation Pattern

This project follows a layered, feature-oriented architecture:

- **Feature modules** (`src/features/*`) separate domain logic by business capability (desk, notebook, profile, auth, school)
- **Use cases** handle application workflows, business logic and orchestrate repositories + storage
- **Repositories** encapsulate persistence with Prisma
- **Server actions** expose write operations to the UI
- **Composition layer** wires concrete infrastructure dependencies into use cases
- **React Query hooks** manage client-side data fetching, caching, and invalidation
- **Providers + URL state** coordinate app layout state (selected desk/item/profile and panel mode)

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- React Query
- Prisma
- Supabase (auth + storage)
- Tailwind CSS + shadcn/ui

## Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

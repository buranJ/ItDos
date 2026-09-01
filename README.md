# ItDos

Studio website with its own content database and admin panel — every page on the public site is
editable through the admin UI, and contact form submissions are stored as leads and pushed to Telegram.

Built with Next.js App Router, Drizzle ORM and a custom authentication layer. No CMS, no third-party
backend: the whole thing is one deployable Next.js application.

## Overview

The public site is a marketing site for a digital studio: services, portfolio, process, reviews,
blog, pricing plans, FAQ and a contact form. None of that content is hardcoded — it comes from the
database and is edited in `/admin`.

The problem the project solves is the usual one for a small studio site: content changes weekly,
and nobody wants to redeploy for a typo or ship a headless CMS for twelve tables. So the content
layer, the admin panel and the site live in the same codebase, with one schema as the contract
between them.

## Features

- **Content-driven pages** — services, projects (portfolio), blog posts, reviews, team members,
  pricing plans, FAQ items and process phases are all database-backed with per-entity detail routes.
- **Generic admin panel** — a single `[resource]` route pair renders list and edit views for every
  content type from a shared resource descriptor, with Zod schemas per resource.
- **Custom authentication** — email + password with `scrypt` hashing (`<salt-hex>:<derived-key-hex>`),
  server-side sessions, and two roles (`admin`, `editor`). No public sign-up: editors are added by hand.
- **Lead capture** — the contact form writes to a `leads` table and notifies a Telegram chat,
  so an enquiry does not depend on someone checking an inbox.
- **Motion layer** — GSAP-driven scroll animations with Lenis smooth scroll, isolated in
  `src/components/motion` and `src/components/visual` so page components stay readable.
- **Seed and prepare scripts** — `db:seed` fills a fresh database with realistic content;
  `prebuild` prepares the database file so a cold deploy does not start empty.

## Architecture

```
Browser
  │
  ├── Next.js App Router (RSC)  ──►  src/server/content   ──►  Drizzle ORM ──►  SQLite / libSQL
  │                                   (read queries)
  │
  ├── /admin (server actions)   ──►  src/server/admin     ──►  Drizzle ORM
  │                                   (Zod-validated writes)
  │                             ──►  src/server/auth      ──►  sessions, scrypt password hashing
  │
  └── /api/contact (route)      ──►  leads table
                                ──►  Telegram Bot API (notification)
```

Server-only code lives entirely under `src/server` and is never imported from a client component.
Everything the browser needs goes through server components or the single API route.

The schema deliberately stores list- and object-valued fields (features, tags, deliverables,
process steps) as JSON columns instead of normalising them into child tables: they are always read
whole with their parent row, never queried across rows and never joined. Fields that *are* queried
independently — `slug`, `category`, `published`, `position` — are real columns with indexes.
The reasoning is written down in `src/server/db/schema.ts`.

## Tech Stack

### Frontend
- Next.js 16 (App Router, React Server Components)
- React 19
- TypeScript (strict)
- Tailwind CSS v4 (design tokens in `src/app/globals.css`, no config file)
- GSAP + `@gsap/react`, Lenis
- lucide-react, `clsx` + `tailwind-merge`

### Backend
- Next.js server components, server actions and one route handler
- Custom auth: Node `scrypt`, server-side sessions
- Zod for admin write validation

### Database
- SQLite via `@libsql/client`
- Drizzle ORM + drizzle-kit for schema and migrations

### Integrations
- Telegram Bot API — new-lead notifications

## Project Structure

```
src/
  app/
    (public pages)      about, services, portfolio, blog, process, reviews, contact, privacy
    admin/
      login/            login form
      (panel)/          dashboard, leads, generic [resource] list + edit
    api/contact/        form submission handler
  components/
    layout/ sections/ ui/          page composition
    motion/ visual/ cursor/       animation layer
    portfolio/ seo/               feature-specific
  server/
    auth/               password hashing, sessions
    db/                 client, schema, queries
    content/            public read queries
    admin/              resource descriptors, write actions
  data/ hooks/ lib/ types/
drizzle/                generated migrations
docs/                   ARCHITECTURE, BACKEND, CODESTYLE, BUGS, QUESTIONS
scripts/                prepare-db.mjs, seed.ts
```

## Getting Started

Requirements: Node.js 20+, npm.

```bash
npm install
cp .env.example .env.local     # then fill in the values below
npm run db:migrate
npm run db:seed
npm run dev
```

The site is at `http://localhost:3000`, the admin panel at `http://localhost:3000/admin`
(sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Environment Variables

```
DATABASE_URL=
DATABASE_AUTH_TOKEN=
ADMIN_EMAIL=
ADMIN_PASSWORD=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
NEXT_PUBLIC_API_URL=
```

`DATABASE_AUTH_TOKEN` is only needed for a remote libSQL/Turso database; a local file needs just
`DATABASE_URL`. `ADMIN_EMAIL` / `ADMIN_PASSWORD` are used by the seed script to create the first
editor and should not be reused after that.

## Development

```bash
npm run dev          # dev server
npm run lint         # ESLint
npm run db:generate  # generate a migration from schema changes
npm run db:migrate   # apply migrations
npm run db:studio    # Drizzle Studio
npm run db:seed      # seed content
npm run build        # production build (runs prepare-db first)
```

## Tests

There is no test suite in this repository yet. The authentication and session code in
`src/server/auth` is the part that most needs coverage and is the next thing planned.

## Current Status

Active development. The public site and admin panel are functional; the content model is stable.
Open questions and known issues are tracked in `docs/QUESTIONS.md` and `docs/BUGS.md`.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

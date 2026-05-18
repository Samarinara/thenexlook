# The Nex Look — Makeup Artistry Portfolio

A makeup artistry portfolio built with [Next.js](https://nextjs.org) (16), [Tailwind CSS](https://tailwindcss.com) (v4), and [shadcn/ui](https://ui.shadcn.com).

## Features

- **Portfolio Grid** — Displays makeup looks with image carousels
- **Studio** — Authenticated dashboard to create, edit, and delete looks
- **Image Upload** — Powered by UploadThing
- **Dark Mode** — Theme toggle using `next-themes`
- **Animations** — Framer Motion, marquee ticker, floating decorations, scroll progress

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```
TURSO_DB_URL=...
TURSO_DB_AUTH_TOKEN=...
UPLOADTHING_TOKEN=...
AUTH_SECRET=...
```

## Scripts

| Command            | Description          |
| ------------------ | -------------------- |
| `pnpm dev`         | Start dev server     |
| `pnpm build`       | Production build     |
| `pnpm start`       | Start production     |
| `pnpm lint`        | Run ESLint           |
| `pnpm typecheck`   | Run TypeScript check |
| `pnpm format`      | Format with Prettier |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + tw-animate-css
- **UI:** shadcn/ui, Radix, Base UI, Lucide icons
- **Database:** Turso (libSQL)
- **Storage:** UploadThing
- **Animation:** Framer Motion, Embla Carousel

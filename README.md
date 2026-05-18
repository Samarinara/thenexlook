# The Nex Look

A makeup artistry portfolio site.

## Stack

- **Framework:** [Next.js](https://nextjs.org) 16 — App Router with server components for data fetching and client components for interactivity
- **Language:** TypeScript
- **Database:** [Turso](https://turso.tech) (edge-hosted libSQL / SQLite) via `@libsql/client`. Schema bootstrapped on first access. Raw SQL queries — no ORM.
- **Auth:** Custom HMAC‑SHA256 session tokens. Embedded via URL query param for the studio. 24‑hour expiry, symmetric signing with `AUTH_SECRET`. No third‑party auth provider.
- **Storage:** [UploadThing](https://uploadthing.com) for image uploads
- **Styling:** [Tailwind CSS](https://tailwindcss.com) v4 + `tw-animate-css`
- **UI Components:** [shadcn/ui](https://ui.shadcn.com) over [Radix](https://radix-ui.com) primitives (Dialog, Slot) and [Base UI](https://base-ui.com). Icons via [Lucide](https://lucide.dev).
- **Animation:** [Framer Motion](https://framer.com/motion), [Embla Carousel](https://www.embla-carousel.com)

## Notable Decisions

- **No ORM** — database access is a thin wrapper around raw SQL. Keeps the query surface explicit and minimal.
- **No auth library** — session tokens are HMAC‑signed JSON blobs. No OAuth, no JWTs, no database-backed sessions. Enough for a single‑editor portfolio.
- **Images as JSON** — image URLs stored as a `JSON.stringify`'d array in a `TEXT` column (Turso's libSQL supports `json_extract` when needed).
- **Server‑first rendering** — data is fetched in server components and passed down. Client components handle interactivity (carousels, dialogs, theme toggle).

## Layout

```
app/          — Next.js App Router pages & API routes
  api/        — REST endpoints (looks CRUD, auth, uploadthing)
  studio/     — Authenticated editor dashboard
components/   — Shared React components
data/         — Static JSON fallback
lib/          — DB client, auth, types, utilities
public/       — Static assets
```

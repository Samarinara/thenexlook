# The Nex Look

A Next.js makeup artistry portfolio with a password-protected studio at `/studio`.
Hosted on Netlify, with Netlify Blobs storing both portfolio records and uploaded photos.
No UploadThing, Turso, or Vercel account is required for the new application.

## Deploy a new Netlify site

1. In Netlify, choose **Add new project → Import an existing project → GitHub**, and select `Samarinara/thenexlook`.
2. Select the branch containing this migration. `netlify.toml` supplies the build command (`pnpm build`), publish directory (`.next`), and Node 22. Netlify automatically uses its Next.js adapter; do not configure a static export or SPA redirect.
3. Add these private environment variables with the **Functions** scope (or all scopes if scope controls are unavailable):
   - `STUDIO_PASSWORD`: a long, unique studio password.
   - `AUTH_SECRET`: at least 32 random characters. Generate one locally with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
4. Deploy. Open `/studio`, log in, create a look with photos, and check it on the home page. Refresh the studio and redeploy to verify persistence.
5. Import existing content using the migration instructions below before retiring any old services or moving a custom domain.

Netlify provides Blobs credentials automatically at runtime. Do **not** add a personal Netlify access token to the deployed site. Production stores are `thenexlook-looks` and `thenexlook-images`. Strong consistency makes saved changes immediately readable. Each look has its own blob; editing one look cannot overwrite another. Concurrent edits to the same look use the last write.

Deploy previews and branch deployments use separate namespaces in `netlify.toml` so they cannot change production records. Previews share a preview namespace; branch deployments share a branch namespace. They start empty and require studio environment variables if you want to test editing there.

## Existing looks and photos

The old live portfolio's records are in Turso, so the checked-in `data/looks.json` may be only an example. Before disconnecting the old site, open its `/api/looks` endpoint and save the JSON response as `looks-export.json`. Keep a backup of that export and the source photos.

After the new Netlify project exists, run locally:

```sh
corepack enable
pnpm install --frozen-lockfile
# Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN in your local shell, using the
# project's ID and a Netlify personal access token. Never commit credentials.
pnpm import:looks looks-export.json
```

The command downloads each HTTPS photo, stores a copy in Netlify Blobs, and writes the look with new same-site image URLs. It preserves IDs and creation dates, skips existing looks, and is safe to retry after a partial failure. JPEG, PNG, WebP, and GIF images up to 4 MB are supported; resize larger photos before importing. Only run with a trusted export file. Running `pnpm import:looks` without a filename imports the checked-in example instead.

Inspect every imported look on the new site, test creating/editing/deleting a look, and only then retire the old deployment, Turso database, and UploadThing account. The code migration does not delete any old data or service accounts.

## Development

Use Node 22. Copy `.env.example` to `.env.local` and fill in the studio values.

```sh
pnpm install --frozen-lockfile
pnpm --package=netlify-cli dlx netlify dev
```

Netlify Dev supplies a sandboxed local Blobs store. Plain `next dev` does not supply Blobs credentials. Local data is separate from production. The portfolio initially has no looks; add them through `/studio`.

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
# With Netlify Dev running and STUDIO_PASSWORD set in this shell:
pnpm test:netlify
```

Uploads are authenticated and sent one image per request, with a 4 MB limit to fit Netlify function payload limits. Photos are public portfolio assets served at `/api/images/<key>`. Removing an image or look removes its reference; the original blob is retained so other looks that reference it remain intact. Unreferenced blobs can be removed manually from Netlify's Blobs UI.

Stack: Next.js App Router, TypeScript, Netlify Blobs, custom HMAC sessions in HTTP-only cookies, Tailwind CSS, shadcn/Radix UI, Framer Motion, and Embla Carousel.

# Supabase (free): likes + subscribers on static hosting

Your site stays static on GitHub Pages. Likes and newsletter sign-ups are stored in **Supabase** (free tier). You view subscribers in the **Supabase dashboard** (Table Editor → `subscribers`).

## 1. Create a project

1. [Supabase](https://supabase.com) → New project (free).
2. **Settings → API**: copy **Project URL** and **anon public** key.

## 2. Apply the database schema

In Supabase: **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, then **Run**.

## 3. Configure your build

### Local

Copy `.env.example` to `.env` and fill in the two `PUBLIC_*` values.

### GitHub Pages

In the repo: **Settings → Secrets and variables → Actions → New repository secret** (or **Variables** if you prefer):

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

Use the same names as in `.env.example` so Astro embeds them at build time.

If you build with GitHub Actions, pass these as env to the `npm run build` step (or store in **Secrets** and map into the workflow `env`).

**Important:** `PUBLIC_` means these values are included in the client bundle (required for the browser to call Supabase). The **anon** key is safe *only* with the Row Level Security rules in `schema.sql` — do not use the service role key in the site.

## 4. (Optional) CORS

If the browser blocks requests, add your site under **Settings → API → CORS** (e.g. `https://afsalthaj.github.io`).

## 5. GitHub Pages: env must be in the *build*, not only local

The live site is built in **GitHub Actions**. If you only add a `.env` on your laptop, **Pages will not** get `PUBLIC_SUPABASE_*` until you add both as **Actions secrets** and the workflow passes them into `npm run build` (this repo’s `.github/workflows/deploy.yml` already does that).

After adding secrets, **re-run the workflow** or push a commit so the site is rebuilt. Then hard-refresh once to avoid an old HTML/JS cache.

## Troubleshooting

| Symptom | Likely cause |
|--------|----------------|
| **Subscribe jumps to the top** / no row in `subscribers` | The built site had no Supabase env — the form was doing a normal browser submit. Fixed in code: submit is always blocked; you must still **configure build secrets** and redeploy. |
| **401** on `/rest/v1/subscribers` in Network tab | Wrong key. Try the **Legacy** tab in Supabase → **anon** `eyJ...` JWT in `PUBLIC_SUPABASE_ANON_KEY` if the new publishable key fails. |
| **CORS error** in console | Add `https://afsalthaj.github.io` under CORS in Supabase. |

## What you get

- **Likes:** anonymous; total per post; one like per post per device (localStorage) to reduce double-clicks.
- **Subscribers:** email rows in `subscribers`; you read them in the Supabase **Table Editor** (no public list on the site).

## Email notifications (new posts → subscribers)

After each successful **GitHub Pages** deploy, the **`notify`** job in `.github/workflows/deploy.yml` runs `scripts/notify-subscribers.mjs`. It:

1. Detects **added or modified** files under `src/content/blog/*.md` or `*.mdx` between `BEFORE_SHA` and `AFTER_SHA` (from the push event), or the files in the commit when `before` is empty / all zeros.
2. Reads the **title** from the first changed post’s frontmatter.
3. Loads all emails from **`subscribers`** using the **service role** key (server-side only — never put this in the site bundle).
4. Sends one message per address via **[Resend](https://resend.com)**.

### Repository secrets (Actions)

Add these under **Settings → Secrets and variables → Actions** (in addition to `PUBLIC_SUPABASE_*` for the build):

| Secret | Purpose |
|--------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **Settings → API → service_role** JWT. Bypasses RLS so the script can `select` on `subscribers`. **Do not** expose as `PUBLIC_*`. |
| `RESEND_API_KEY` | Resend API key. |
| `NOTIFY_FROM` | (Optional) From header, e.g. `Your Name <newsletter@yourdomain.com>`. If omitted, the script uses `Afsal Thaj <onboarding@resend.dev>` until you verify a domain in Resend and set `NOTIFY_FROM`. |

The workflow sets `SITE_URL` to `https://afsalthaj.github.io`. If you use a custom domain, change that literal in `deploy.yml` or add a workflow variable.

### Dry run

Locally or in CI, set `NOTIFY_DRY_RUN=1` to log who would receive mail without calling Resend.

### Limits and follow-ups

- Only the **first** changed blog file in a push is used for title/link; multiple new posts in one push get one combined notification subject/body for that file.
- Re-running the workflow on the same commit may send duplicate mail unless you add deduplication later.
- Unsubscribe is a manual note in the email today; a proper link would need a small API or Edge Function.

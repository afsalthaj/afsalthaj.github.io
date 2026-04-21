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

## Email notifications

Not included. Check the Supabase table when you want, or add a free automation (e.g. trigger → external mailer) later if you need alerts.

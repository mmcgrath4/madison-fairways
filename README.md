# Madison Fairways

Beli for golf — rank US courses you have played, not 5-star ratings.

Madison Fairways is a public web app for golfers who want an ordered list of **courses they have actually played**, built the way [Beli](https://www.beliapp.com/) ranks restaurants: pairwise comparison, not stars, not Yelp scores. The GitHub repo name is historical; the product is **United States**, not Madison-only.

This is Week 1: a searchable US catalog, Google sign-in, and a Played flag. Pairwise ranking is not built yet.

## What’s in Week 1

- Browse ~14,500 US golf courses from a checked-in [OpenGolfAPI](https://github.com/opengolfapi/data) seed (ODbL). Search by name, city, or state. Filter public vs private.
- Course pages with name, city/state, holes, access (public / private / municipal / resort / etc.). **No star ratings.**
- Auth.js v5 with Google. The catalog is public without login. Marking **Played** requires sign-in.
- **My Courses** — the list of courses you have marked played. Data model already has nullable `rank_position` and `bucket` (`liked` / `fine` / `didnt_like`) for Week 2.

## What’s later (not built)

- **Week 2:** pairwise / binary-insert ranking of courses you have played
- Derived 0–10 scores
- Public `/u/[name]` profiles
- Want-to-play bookmarks, photos, tee times, AI golf coach, native mobile

## Local setup

Needs Node 20+ and npm.

```bash
cp .env.example .env.local
# fill in AUTH_SECRET, Google OAuth, and optionally DATABASE_URL
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Search and course pages work **without** Google or Postgres. Played / My Courses need both.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Auth.js secret. `npx auth secret` or `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_URL` | Site URL, e.g. `http://localhost:3000` or your Vercel URL |
| `DATABASE_URL` | Postgres connection string (Neon, Supabase, etc.) |

Google Cloud Console → APIs & Services → Credentials → OAuth client (Web):

- `http://localhost:3000/api/auth/callback/google`
- `https://YOUR-DOMAIN/api/auth/callback/google`

### Postgres (Played flags)

```bash
npx prisma migrate deploy
```

`played_courses` stores `user_id`, `course_id`, `played_at`, plus nullable `rank_position` and `bucket` for ranking later.

## Course data

`data/courses.json` is a compact US catalog derived from OpenGolfAPI’s public CSV.

Contains data from OpenGolfAPI (opengolfapi.org), ODbL 1.0.

Holes are inferred from published par when the upstream `holes` column is incomplete. Access is tagged public vs private from OpenGolf course type (municipal/resort/semi-private count as public-access; private/military as private). Refresh:

```bash
npm run courses:refresh
```

## Deploy (Vercel Hobby)

1. Import this GitHub repo in Vercel.
2. Set the env vars above (`AUTH_URL` = the Vercel URL).
3. Attach a Postgres database and run `npx prisma migrate deploy` against it (Vercel build already runs `prisma generate`).

`npm run build` does not require a live database.

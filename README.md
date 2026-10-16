# Nagpur Pandal Map

A map-first guide to verified Ganeshotsav and Durga Utsav pandal listings in Nagpur. Visitors choose one festival at a time, browse its locations, view details, and open directions.

Designed and developed by **Parth Armarkar**.

## Festivals

The `festival_id` column separates the listings:

| ID | Festival |
| --- | --- |
| `1` | Ganeshotsav |
| `2` | Durga Utsav |

The IDs are defined in `src/lib/festivals.ts`. Assign a distinct numeric ID if another festival is added later, and add its label to the same configuration.

## Features

- Nagpur-centered interactive map using Leaflet and OpenStreetMap
- One-at-a-time Ganeshotsav and Durga Utsav selection
- Festival-filtered pandal listings, location search, crowd indicators, and Google Maps directions
- Admin form that saves each pandal with its festival ID
- Responsive layout with map route suggestions generated from available listings
- Supabase database integration

No demo pandal records are bundled. Add and verify your own rows in Supabase or through the admin interface.

## Stack

- Next.js 14, React 18, TypeScript, Tailwind CSS
- Leaflet and OpenStreetMap
- Supabase PostgreSQL
- Vercel-compatible deployment

## Quick start

Requirements: Node.js 18+ and a Supabase project.

```bash
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ADMIN_PASSWORD=choose-a-local-admin-password
```

Create the table in the Supabase SQL editor:

```sql
CREATE TABLE public.pandals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id SMALLINT NOT NULL CHECK (festival_id IN (1, 2)),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  contact TEXT,
  website TEXT,
  timings TEXT NOT NULL,
  special_features TEXT[],
  image_url TEXT,
  rating NUMERIC(2, 1) CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pandals_location ON public.pandals (latitude, longitude);
CREATE INDEX idx_pandals_name ON public.pandals (name);
CREATE INDEX idx_pandals_festival_id ON public.pandals (festival_id);

ALTER TABLE public.pandals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public pandal reads" ON public.pandals
  FOR SELECT USING (true);
```

The current browser-based admin form inserts with the Supabase anon key. If you use it, configure a narrowly scoped insert policy and understand that a client-side password is not a production security boundary. For production writes, move admin authentication and inserts to a protected server endpoint; never expose a Supabase service-role key in `NEXT_PUBLIC_*` variables.

Check that the table is accessible, then start the app:

```bash
npm run setup-db
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The map remains empty until you add listings.

## Existing database migration

Run these steps in the Supabase SQL editor. The first statements add a nullable field so existing records can be classified before enforcing the constraint.

```sql
ALTER TABLE public.pandals
  ADD COLUMN IF NOT EXISTS festival_id SMALLINT;

-- Review unclassified rows before assigning each to the correct festival.
SELECT id, name, address
FROM public.pandals
WHERE festival_id IS NULL;

-- Replace the example names with your actual records.
UPDATE public.pandals
SET festival_id = 1
WHERE festival_id IS NULL
  AND name IN ('replace with a Ganeshotsav pandal name');

UPDATE public.pandals
SET festival_id = 2
WHERE festival_id IS NULL
  AND name IN ('replace with a Durga Utsav pandal name');

-- Confirm this returns no rows before applying NOT NULL.
SELECT id, name
FROM public.pandals
WHERE festival_id IS NULL;

ALTER TABLE public.pandals
  ALTER COLUMN festival_id SET NOT NULL;

ALTER TABLE public.pandals
  ADD CONSTRAINT pandals_festival_id_check
  CHECK (festival_id IN (1, 2));

CREATE INDEX IF NOT EXISTS idx_pandals_festival_id
  ON public.pandals (festival_id);
```

If all existing rows belong to a single festival, you can assign them together instead of using the name-based examples. Do not guess the festival for records; classify them from your source data first. If a check constraint already exists, skip the `ADD CONSTRAINT` statement.

## Add listings

Use `/admin` to add a listing and choose its festival. The saved row includes `festival_id` (`1` for Ganeshotsav or `2` for Durga Utsav). You can also insert directly in Supabase, for example:

```sql
INSERT INTO public.pandals (
  festival_id, name, description, address, latitude, longitude, timings
) VALUES (
  1,
  'Your verified pandal name',
  'Your description',
  'Nagpur, Maharashtra',
  21.1458,
  79.0882,
  'Confirm timings with the mandal'
);
```

Replace the example values with verified information before inserting. Select festival `2` for a Durga Utsav row.

## Commands

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run setup-db` checks Supabase connectivity and prints the table schema if the table is missing.
- `npm run seed` does not add records; no unverified demo listings are bundled.

## Project map

- `src/app/page.tsx` contains the festival selector and map homepage.
- `src/components/Map.tsx` loads data for the active festival.
- `src/components/Header.tsx` contains the compact hamburger navigation.
- `src/app/admin/page.tsx` adds festival-tagged pandals.
- `src/lib/festivals.ts` maps festival IDs to labels.
- `src/lib/pandalService.ts` queries and inserts Supabase rows.

## Author

**Parth Armarkar** developed this project, including the Nagpur festival map experience and its supporting UI and services.

## License

MIT. See [LICENSE](LICENSE).

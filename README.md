<p align="center">
  <img src="public/markers/img1.png" alt="marker" height="300"/>
</p>

# Nagpur Pandal Navigator

A map-first web app for devotees exploring **Ganeshotsav** and **Durga Utsav** pandals in **Nagpur**. Switch festivals one at a time, browse the city map, check crowd-aware details, and get directions.

Built by **Parth Armarkar** with Next.js, Supabase, and Leaflet.

## 🚀 Features

- **Interactive Map**: View all Ganapati and Durga pandals on an interactive OpenStreetMap
- **Location-based Search**: Find pandals near your current location
- **Detailed Information**: View pandal details, timings, contact info, and special features
- **Navigation**: Get directions to any pandal using Google Maps
- **Admin Panel**: Password-protected admin interface for adding new pandals
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Festival Theme**: Beautiful saffron and red themed UI celebrating Ganeshotsav and Durga-utsav
- **Free Database**: Uses Supabase PostgreSQL with generous free tier

Pandal listings in production should live in your Supabase database. You can add them yourself via the admin panel or SQL. Demo/fallback rows are only used when the database is not configured.

## Tech stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Maps**: Leaflet.js + OpenStreetMap
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (frontend) + Supabase (backend)

## Quick start

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project (optional for demo mode)

### 1. Install

```bash
git clone <your-repo-url>
cd Pandal-Exploration
npm install
```

### 2. Database (Supabase)

Create a project, copy the URL and anon key, then run this in the SQL editor:

```sql
CREATE TABLE pandals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  rating NUMERIC(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_pandals_location ON pandals (latitude, longitude);
CREATE INDEX idx_pandals_name ON pandals (name);
CREATE INDEX idx_pandals_rating ON pandals (rating DESC);

-- Enable Row Level Security
ALTER TABLE pandals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON pandals
  FOR SELECT USING (true);

-- Create policy to allow public insert (for demo purposes)
CREATE POLICY "Allow public insert" ON pandals
  FOR INSERT WITH CHECK (true);
```

### 3. Configure Environment

Create an environment file (`.env.local`) with content:

```bash
# Edit .env.local with your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Setup Database & Run

```bash
# Test database connection
npm run setup-db

# Add sample pandal data
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo mode (no database)

Create `.env.local` with:
```bash
# Demo mode - uses fallback data instead of database
NEXT_PUBLIC_SUPABASE_URL=demo-mode
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-mode
```

Fallback listings are Nagpur-only and split by festival. Use the header switcher to view Ganeshotsav or Durga Utsav.

## Admin panel

- URL: `http://localhost:3000/admin`
- Default password: `nagpur@2026`
- Each pandal must include address, timings, and a captured GPS location in Nagpur

Custom password:

```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
```

## Sample / fallback listings

These are for local demo only. Replace with your own database rows.

**Ganeshotsav (Nagpur)**

- Tekdi Ganesh Mandir
- Mahal, Sitabuldi, Dharampeth, Sadar, and Itwari community pandals

**Durga Utsav (Nagpur)**

- Abhyankar Nagar Durga Puja
- Ravi Nagar Ground
- Itwari
- Ambazari

## Usage

1. See **Ganeshotsav** or **Durga Utsav** Pandals in the header, whether if its **Ganeshotsav** or **Navratri**.
2. Optionally share your location to sort nearby stops
3. Tap markers for details, crowd hints, and directions
4. Use **Explore Routes** for a Nagpur circuit built from the loaded pandals

## Project structure

```
src/
├── app/                 # Next.js app router (home + admin)
├── components/          # Map, header, festival switcher, routes, crowd UI
├── lib/                 # festival config, pandal service, crowd, maps helpers
└── types/               # TypeScript models
```

Key pieces:

- `src/components/Map.tsx` — Leaflet map defaulting to Nagpur
- `src/lib/pandalService.ts` — fetch and filter pandals

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run seed` — insert sample Nagpur pandals
- `npm run setup-db` — print/check table setup
- `npm run fetch-google` — optional Places lookup (Nagpur queries)

## Author

**Parth Armarkar** designed and developed this project — from the Nagpur map experience and dual-festival flow to the admin workflow and supporting services.

## License

MIT. See [LICENSE](LICENSE) if present.

## Acknowledgments

- OpenStreetMap, Leaflet, Supabase, and Vercel
- Nagpur’s Ganeshotsav mandals and Durga Utsav committees, and the devotees who keep these festivals alive

---

🚩 **गणपती बाप्पा मोरया ! ·  जय माता दी !** 🚩

Built with devotion for the Ganapati and Durga festival.

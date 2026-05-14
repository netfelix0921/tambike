# RideFlow

A modern mobile cycling app for urban cyclists in Metro Manila. Plan routes, navigate safely, track rides, discover coffee stops and scenic Manila Bay sunset routes, and ride together with friends.

> Built with React Native (Expo), TypeScript, Mapbox, and Supabase.

---

## Try it in the browser (no setup)

The app ships a **demo mode** that works without Supabase or Mapbox — perfect for previewing the UI from your browser.

### Option A — GitHub Codespaces (easiest)

1. On the [repo page](https://github.com/netfelix0921/tambike), click **Code → Codespaces → Create codespace on this branch**.
2. When the container is ready, run:
   ```bash
   cd apps/mobile
   npm run web
   ```
3. Click the popup to **open the forwarded port 8081** in your browser. You're in.

You'll see the home dashboard, plan, profile, social, and settings screens. Auth is bypassed and the map area shows a styled placeholder (Mapbox is iOS/Android only).

### Option B — Local

```bash
git clone https://github.com/netfelix0921/tambike.git
cd tambike/apps/mobile
npm install
npm run web      # opens http://localhost:8081
```

### What works in demo mode

| Area              | Demo mode                              |
| ----------------- | -------------------------------------- |
| Auth              | Auto-signed-in as a stub rider         |
| Home dashboard    | Fully rendered with mock weekly stats  |
| Route planner     | UI shows; routing fetch is skipped     |
| Live tracker      | Shell + controls; GPS works on mobile  |
| Group rides       | Mock data renders the participant list |
| Profile / history | Two mock rides show in the list        |
| Map               | Placeholder (Mapbox is mobile-only)    |

---

## Full setup (real backend)

Add tokens in `apps/mobile/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token
```

Apply the SQL files in `supabase/migrations/` (in order), then `seed.sql`. See [`supabase/README.md`](./supabase/README.md).

---

## Monorepo Layout

```
tambike/
├── apps/
│   └── mobile/           # Expo React Native app (RideFlow)
├── supabase/             # Postgres schema, RLS, seed data
└── docs/                 # Architecture & API docs
```

## Tech Stack

| Layer        | Choice                                |
| ------------ | ------------------------------------- |
| Runtime      | Expo (React Native) + TypeScript      |
| Routing      | Expo Router (file-based)              |
| State        | Zustand + React Query                 |
| Maps         | Mapbox GL (`@rnmapbox/maps`)          |
| Location     | `expo-location` (foreground + bg)     |
| Backend      | Supabase (Auth + Postgres + Realtime) |
| Geo          | PostGIS                               |
| Auth         | Supabase Auth (email + OAuth)         |

## Features

- **Smart Cycling Navigation** — bike-friendly routing, lane preference, voice prompts, rerouting.
- **Live Ride Tracking** — speed, pace, distance, elevation, calories, history.
- **Route Planner** — Chill / Coffee / Sunset / Training ride profiles.
- **Group Rides** — live location sharing, meetup pins, invitations.
- **Local Discovery** — coffee stops, water refill points, hazard reports, flood-prone road warnings, Manila Bay sunset suggestions.

## Documentation

- [`docs/architecture.md`](./docs/architecture.md) — system design
- [`docs/api.md`](./docs/api.md) — backend API surface
- [`supabase/migrations`](./supabase/migrations) — database schema

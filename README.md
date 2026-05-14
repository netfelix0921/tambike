# RideFlow

A modern mobile cycling app for urban cyclists in Metro Manila. Plan routes, navigate safely, track rides, discover coffee stops and scenic Manila Bay sunset routes, and ride together with friends.

> Built with React Native (Expo), TypeScript, Mapbox, and Supabase.

---

## Monorepo Layout

```
tambike/
├── apps/
│   └── mobile/           # Expo React Native app (RideFlow)
├── supabase/             # Postgres schema, RLS, seed data
└── docs/                 # Architecture & API docs
```

## Quick Start

```bash
# Install
cd apps/mobile
npm install

# Configure env (see .env.example)
cp .env.example .env

# Run
npm run start
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

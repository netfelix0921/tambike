# RideFlow — Architecture

> A modern cycling app for Metro Manila. Ride tracking, navigation, and group
> rides; tuned for the realities of riding in Manila — bike lane scarcity,
> sudden rain, and an obsession with golden-hour bay rides.

---

## High-level

```
┌────────────────────────┐      ┌───────────────────────┐
│      Expo client       │      │        Mapbox         │
│  (iOS / Android / Web) │ ◀──▶ │  Directions, Tiles    │
└──────────┬─────────────┘      └───────────────────────┘
           │ HTTPS / WSS
           ▼
┌────────────────────────────────────────────────────────┐
│                       Supabase                         │
│  • Auth   • Postgres (PostGIS)   • Realtime  • Storage │
└────────────────────────────────────────────────────────┘
```

- **Mobile-first.** Built on Expo so we ship one codebase to iOS, Android, and
  the web preview without ejecting until we need to.
- **Edge-light.** No standalone backend service. Everything goes through
  Supabase or Mapbox. A future "matching" job (e.g., pairing nearby riders)
  can land as a Supabase Edge Function.
- **RLS by default.** No table is readable without a policy.

---

## Mobile architecture (Expo)

```
apps/mobile/
├── app/                         ← Expo Router (file-based routes)
│   ├── _layout.tsx              ← Providers + auth gate
│   ├── (auth)/                  ← Onboarding + Login + Register
│   ├── (tabs)/                  ← Home, Plan, Ride, Social, Profile
│   └── ride/                    ← Tracker, Navigation, Group ride
└── src/
    ├── components/              ← UI + map + ride primitives
    │   ├── ui/                  ← Themed atoms
    │   ├── map/                 ← RouteMap, MapPlaceholder
    │   └── ride/                ← LiveStatPanel, RideControls
    ├── theme/                   ← Design tokens
    ├── hooks/                   ← useAuth, useLocation, useRideTracker
    ├── stores/                  ← Zustand: authStore, rideStore
    ├── services/                ← Network layer (Supabase + Mapbox)
    ├── lib/                     ← Client initializers (supabase, mapbox, query)
    ├── types/                   ← Domain types
    └── utils/                   ← geo, format, calories
```

### Layered boundaries

| Layer       | Talks to                  | Knows about            |
| ----------- | ------------------------- | ---------------------- |
| `app/*`     | hooks, stores, components | UI/UX                  |
| `components`| theme, types              | Pure props             |
| `hooks`     | services, stores          | Lifecycle + side fx    |
| `stores`    | (nothing)                 | Slice of app state     |
| `services`  | `lib/supabase`, `fetch`   | Backend wire format    |
| `lib`       | env, third-party SDKs     | Initialization         |

Components never import services. Hooks orchestrate.

---

## Ride tracking pipeline

```
expo-location.watchPositionAsync
        ▼
useLocation (hook) ───────────┐
        ▼                     │
useRideTracker (hook)         │
   • appendPoint()            │
   • derive metrics every 1s  │
        ▼                     │
useRideStore  ◀───────────────┘
        ▼
LiveStatPanel  (UI subscribes to metrics slice)
```

When the user taps **End**, the recorded `track[]` is flushed to Supabase via
`ridesService.appendTrack` in batches, then `finalize()` writes the aggregates.
This pattern ensures we don't lose data if the app dies mid-ride.

> Background tracking is wired via `expo-location` task manager — not included
> in this scaffold but the client config (Info.plist + Android permissions)
> already declares the entitlements.

---

## Navigation

The MVP uses Mapbox Directions on the `cycling` profile. The adapter
in [`routingService`](../apps/mobile/src/services/routing.ts) layers our
Manila-specific preferences on top:

- **Bike lanes preferred** — the cycling profile already does this.
- **Avoid ferries** — irrelevant in Manila and a footgun.
- **Avoid flood-prone roads** — implemented as a future step that decorates the
  request with avoidance polygons sourced from `hazards` (type=flood).
- **Live rerouting** — when the user drifts >40m from the route polyline for
  >10s, the tracker re-requests directions from the current location.

Voice prompts are spoken via `expo-speech` so we don't pull a TTS dependency.

---

## Local features

| Feature                  | Implementation                                                  |
| ------------------------ | --------------------------------------------------------------- |
| Coffee stop suggestions  | `pois_near(type=coffee)` filtered by `recommended_for` rideType |
| Water stations           | `pois_near(type=water)`                                         |
| Hazard reports           | `hazards` table with auto-expiry (24h, except floods)           |
| Flood-prone road warnings| Long-lived `flood` hazards used in route avoidance              |
| Sunset ride suggestions  | Pre-curated routes flagged `ride_type=sunset`                   |

---

## Design system

Tokens live in `src/theme`. The palette is calibrated around two anchors:

- **Brand mint** (`brand500`) — energy, motion, "go" affordance.
- **Sunset** (`sunset500`) — Manila Bay, golden hour, social warmth.

All components consume `theme.*` directly — no styled-components dependency.
Every reusable atom is in `components/ui` and exported from a single barrel.

---

## State management

- **Server state:** React Query (queries + mutations + cache).
- **Local UI state:** Component-level `useState`.
- **Cross-screen state:** Zustand stores (`authStore`, `rideStore`).
- **Persistent session:** Supabase auth + AsyncStorage (configured in `lib/supabase`).

We deliberately avoid putting server data into Zustand — it stays in React
Query so we get caching, refetching, and optimistic updates for free.

---

## Permissions

iOS (`Info.plist` via `app.json`):
- `NSLocationWhenInUseUsageDescription` — foreground tracking.
- `NSLocationAlwaysAndWhenInUseUsageDescription` — background ride recording.
- `UIBackgroundModes: [location, fetch]`.

Android (`app.json`):
- `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`,
  `FOREGROUND_SERVICE`.

---

## What's intentionally out of scope (for the MVP)

- Background-location task implementation
- Strava/Garmin import
- Heart-rate / cadence sensor support
- Full offline route caching
- Edge functions (route matching, push notifications)
- Push notifications

These are scaffolded conceptually but not wired in — they're the next 1–2 iterations.

---

## Local development

1. `cp apps/mobile/.env.example apps/mobile/.env` and fill in Supabase + Mapbox tokens.
2. Apply `supabase/migrations/*.sql` and `seed.sql` against your project.
3. From `apps/mobile`, run `npm install` then `npm run start`.
4. Test on a physical device — the simulator does not provide real GPS samples.

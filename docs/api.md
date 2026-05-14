# API Surface

The mobile client talks to Supabase via the auto-generated PostgREST endpoints
plus a small set of custom RPCs. All access is gated by Row-Level Security; the
anon key is safe to ship in the bundle.

> The TypeScript types in [`apps/mobile/src/types`](../apps/mobile/src/types) are
> the canonical contract. Everything below mirrors them.

---

## Authentication

| Method                                 | Description                            |
| -------------------------------------- | -------------------------------------- |
| `auth.signInWithPassword({email,pw})`  | Email / password sign-in               |
| `auth.signUp({email, pw, options})`    | New account; `display_name` in metadata |
| `auth.signOut()`                       | Clears the session                     |
| `auth.getSession()`                    | Returns the persisted session          |
| `auth.onAuthStateChange(cb)`           | Live subscription used by `useAuthBootstrap` |

A new auth user automatically inserts a corresponding `profiles` row via the
`handle_new_user` trigger.

---

## Profiles

```
GET    /rest/v1/profiles?id=eq.<uid>
PATCH  /rest/v1/profiles?id=eq.<uid>
```

Encapsulated by [`authService`](../apps/mobile/src/services/auth.ts).
RLS: only the owner can read or update.

---

## Rides

```
GET    /rest/v1/rides?user_id=eq.<uid>&order=started_at.desc
GET    /rest/v1/rides?id=eq.<id>&select=*,track_points(*)
POST   /rest/v1/rides
PATCH  /rest/v1/rides?id=eq.<id>
POST   /rest/v1/track_points
```

Encapsulated by [`ridesService`](../apps/mobile/src/services/rides.ts).
Track points are batched and inserted incrementally during a ride.

---

## Planned Routes

```
GET    /rest/v1/planned_routes?owner_id=eq.<uid>&saved=eq.true
POST   /rest/v1/planned_routes
```

Encapsulated by [`routesService`](../apps/mobile/src/services/routes.ts).

---

## Routing (Mapbox Directions)

Not Supabase — calls Mapbox directly.

```
GET https://api.mapbox.com/directions/v5/mapbox/cycling/{coords}
   ?geometries=geojson
   &overview=full
   &steps=true
   &exclude=ferry
   &access_token=…
```

Adapter: [`routingService.planRoute`](../apps/mobile/src/services/routing.ts).
Returns a normalized `RouteResult { geometry, distanceM, durationS, steps }`.

---

## POIs (RPC)

```sql
select pois_near(lat, lng, radius_km, types);
```

Returns up to 100 POIs ordered by distance, optionally filtered by type
(`coffee`, `water`, `bike_shop`, `rest_stop`, `viewpoint`).

```sql
select hazards_near(lat, lng, radius_km);
select confirm_hazard(hazard_id);
```

Encapsulated by [`poisService`](../apps/mobile/src/services/pois.ts).

---

## Group Rides

```
GET    /rest/v1/group_rides
POST   /rest/v1/group_rides
GET    /rest/v1/group_participants?group_ride_id=eq.<id>
POST   /rest/v1/group_participants
PATCH  /rest/v1/group_participants
```

Realtime channel: `postgres_changes` on `group_participants` filtered by
`group_ride_id` — see `groupsService.subscribeToParticipants`.

Live location pings update `live_lat`, `live_lng`, `live_updated_at`.
The client throttles them at the rider's preferred frequency (default ~5s).

---

## Error Conventions

The mobile client treats any non-200 PostgREST response as a thrown `Error`
and bubbles the `message` to the UI. RLS violations surface as
`new row violates row-level security policy` — surface a user-friendly
message at the call site rather than rendering raw text.

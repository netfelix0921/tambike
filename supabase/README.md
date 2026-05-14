# Supabase setup

## Apply the schema

```bash
# 1. Create a new Supabase project at https://supabase.com
# 2. Apply migrations in order via the SQL editor or the Supabase CLI:

supabase db push                        # if using the CLI
# or paste each file in order:
#   migrations/0001_init.sql
#   migrations/0002_rls.sql
#   migrations/0003_rpc.sql
#   seed.sql
```

## Tables

| Table                | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `profiles`           | Rider profile, extends `auth.users`       |
| `rides`              | Recorded ride sessions + aggregates       |
| `track_points`       | GPS samples per ride (PostGIS geography)  |
| `planned_routes`     | Saved routes from the route planner       |
| `pois`               | Coffee stops, water stations, viewpoints  |
| `hazards`            | Flood/pothole/etc. with auto-expiry       |
| `group_rides`        | Scheduled rides hosted by a user          |
| `group_participants` | Members of a group ride + live location   |

## RPC

- `pois_near(lat, lng, radius_km, types)` — spatial query for POIs
- `hazards_near(lat, lng, radius_km)` — spatial query for active hazards
- `confirm_hazard(hazard_id)` — increment community confirmation count

## Realtime

Enable the `group_participants` table in the Realtime section of the Supabase
dashboard so the `groups.subscribeToParticipants` client can stream live
location pings.

## Notes on PostGIS

We store coordinates in two ways:
1. `lat` + `lng` plain columns — easy for the client to read.
2. A generated `geom geography(Point, 4326)` column — used by the GiST index
   so `ST_DWithin` queries are O(log n).

The mobile client reads/writes only `lat` and `lng`; the geography column is
maintained automatically.

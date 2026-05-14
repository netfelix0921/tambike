-- =============================================================
-- RideFlow — RPCs (spatial queries)
-- =============================================================

-- pois_near: returns POIs within `radius_km` of (lat, lng), optionally filtered.
create or replace function pois_near(
  lat        double precision,
  lng        double precision,
  radius_km  double precision default 5,
  types      poi_type[] default null
)
returns table (
  id uuid,
  type poi_type,
  name text,
  lat double precision,
  lng double precision,
  address text,
  notes text,
  rating numeric,
  hours text,
  recommended_for ride_type[]
)
language sql
stable
as $$
  select id, type, name, lat, lng, address, notes, rating, hours, recommended_for
  from pois
  where (types is null or type = any(types))
    and st_dwithin(
      geom,
      st_setsrid(st_makepoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
  order by st_distance(geom, st_setsrid(st_makepoint(lng, lat), 4326)::geography)
  limit 100;
$$;

-- hazards_near: same idea, but filters out expired hazards.
create or replace function hazards_near(
  lat        double precision,
  lng        double precision,
  radius_km  double precision default 10
)
returns table (
  id uuid,
  reporter_id uuid,
  type hazard_type,
  severity hazard_severity,
  lat double precision,
  lng double precision,
  description text,
  confirmations integer,
  reported_at timestamptz,
  expires_at timestamptz
)
language sql
stable
as $$
  select id, reporter_id, type, severity, lat, lng, description, confirmations, reported_at, expires_at
  from hazards
  where (expires_at is null or expires_at > now())
    and st_dwithin(
      geom,
      st_setsrid(st_makepoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
  order by reported_at desc
  limit 200;
$$;

-- confirm_hazard: increment the confirmation count on a hazard.
create or replace function confirm_hazard(hazard_id uuid)
returns void
language sql
security definer
as $$
  update hazards set confirmations = confirmations + 1 where id = hazard_id;
$$;

-- public_profiles view — a safe, public read of profile info for participant lists.
create or replace view public_profiles as
  select id, display_name, avatar_url, city
  from profiles;

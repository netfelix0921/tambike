-- =============================================================
-- RideFlow — Initial schema
--
-- Conventions:
--   * snake_case columns; UUID primary keys; timestamptz for time.
--   * Geographies use PostGIS `geography(Point, 4326)` for global indexing.
--   * RLS is enabled on every user-owned table.
--   * RPC functions wrap PostGIS spatial queries (`pois_near`, `hazards_near`).
-- =============================================================

create extension if not exists "uuid-ossp";
create extension if not exists postgis;

-- =============================================================
-- Enums
-- =============================================================
create type ride_type      as enum ('chill', 'coffee', 'sunset', 'training');
create type ride_status    as enum ('idle', 'recording', 'paused', 'completed');
create type bike_type      as enum ('road', 'mtb', 'gravel', 'commuter', 'folding', 'fixie');
create type unit_system    as enum ('metric', 'imperial');
create type poi_type       as enum ('coffee', 'water', 'bike_shop', 'rest_stop', 'viewpoint');
create type hazard_type    as enum ('flood', 'pothole', 'glass', 'construction', 'traffic', 'other');
create type hazard_severity as enum ('low', 'medium', 'high');
create type group_status   as enum ('scheduled', 'live', 'completed', 'cancelled');
create type group_role     as enum ('host', 'member');
create type participant_status as enum ('invited', 'going', 'maybe', 'declined');

-- =============================================================
-- profiles — extends auth.users with rider attributes
-- =============================================================
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  display_name    text not null,
  avatar_url      text,
  city            text default 'Metro Manila',
  bike_type       bike_type,
  weight_kg       numeric(5,2),
  unit_system     unit_system not null default 'metric',
  created_at      timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================
-- rides — completed/in-progress ride sessions
-- =============================================================
create table rides (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references profiles(id) on delete cascade,
  title               text,
  ride_type           ride_type not null default 'chill',
  status              ride_status not null default 'recording',
  started_at          timestamptz not null default now(),
  ended_at            timestamptz,
  distance_m          numeric(10,2) default 0,
  duration_s          integer default 0,
  moving_duration_s   integer default 0,
  avg_speed_kph       numeric(5,2) default 0,
  max_speed_kph       numeric(5,2) default 0,
  avg_pace_s_per_km   integer default 0,
  elevation_gain_m    numeric(8,2) default 0,
  calories            numeric(8,2) default 0,
  polyline            text,
  created_at          timestamptz not null default now()
);
create index rides_user_started_idx on rides (user_id, started_at desc);

-- =============================================================
-- track_points — GPS samples for a ride
-- =============================================================
create table track_points (
  id          bigserial primary key,
  ride_id     uuid not null references rides(id) on delete cascade,
  lat         double precision not null,
  lng         double precision not null,
  altitude    double precision,
  speed       double precision,
  heading     double precision,
  accuracy    double precision,
  ts          timestamptz not null,
  geom        geography(Point, 4326) generated always as
              (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored
);
create index track_points_ride_ts_idx on track_points (ride_id, ts);
create index track_points_geom_idx    on track_points using gist (geom);

-- =============================================================
-- planned_routes — saved routes from the planner
-- =============================================================
create table planned_routes (
  id                  uuid primary key default uuid_generate_v4(),
  owner_id            uuid not null references profiles(id) on delete cascade,
  name                text not null,
  ride_type           ride_type not null default 'chill',
  origin_lat          double precision not null,
  origin_lng          double precision not null,
  dest_lat            double precision not null,
  dest_lng            double precision not null,
  waypoints           jsonb default '[]'::jsonb,
  geometry            jsonb not null,                  -- GeoJSON LineString
  distance_m          numeric(10,2) default 0,
  duration_s          integer default 0,
  elevation_gain_m    numeric(8,2) default 0,
  elevation_profile   jsonb default '[]'::jsonb,
  saved               boolean not null default false,
  created_at          timestamptz not null default now()
);
create index planned_routes_owner_idx on planned_routes (owner_id, created_at desc);

-- =============================================================
-- pois — community-curated points of interest
-- =============================================================
create table pois (
  id              uuid primary key default uuid_generate_v4(),
  type            poi_type not null,
  name            text not null,
  lat             double precision not null,
  lng             double precision not null,
  geom            geography(Point, 4326) generated always as
                  (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  address         text,
  notes           text,
  rating          numeric(2,1),
  hours           text,
  recommended_for ride_type[] default '{}',
  created_by      uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);
create index pois_geom_idx on pois using gist (geom);
create index pois_type_idx on pois (type);

-- =============================================================
-- hazards — community-reported road conditions
-- =============================================================
create table hazards (
  id              uuid primary key default uuid_generate_v4(),
  reporter_id     uuid not null references profiles(id) on delete cascade,
  type            hazard_type not null,
  severity        hazard_severity not null default 'medium',
  lat             double precision not null,
  lng             double precision not null,
  geom            geography(Point, 4326) generated always as
                  (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  description     text,
  confirmations   integer not null default 0,
  reported_at     timestamptz not null default now(),
  -- Non-flood hazards are considered stale after 24h.
  expires_at      timestamptz generated always as
                  (case when type = 'flood' then null else reported_at + interval '24 hours' end) stored
);
create index hazards_geom_idx on hazards using gist (geom);

-- =============================================================
-- group_rides + group_participants
-- =============================================================
create table group_rides (
  id              uuid primary key default uuid_generate_v4(),
  host_id         uuid not null references profiles(id) on delete cascade,
  title           text not null,
  description     text,
  meetup_lat      double precision not null,
  meetup_lng      double precision not null,
  meetup_name     text not null,
  starts_at       timestamptz not null,
  ride_type       ride_type not null default 'chill',
  route_id        uuid references planned_routes(id) on delete set null,
  status          group_status not null default 'scheduled',
  invite_code     text not null default substr(md5(random()::text), 1, 8),
  created_at      timestamptz not null default now()
);
create unique index group_rides_invite_idx on group_rides (invite_code);

create table group_participants (
  group_ride_id   uuid not null references group_rides(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,
  role            group_role not null default 'member',
  status          participant_status not null default 'invited',
  live_lat        double precision,
  live_lng        double precision,
  live_updated_at timestamptz,
  primary key (group_ride_id, user_id)
);

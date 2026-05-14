-- =============================================================
-- RideFlow — Row Level Security
--
-- Default deny. Each policy is intentional.
-- =============================================================

-- profiles -----------------------------------------------------
alter table profiles enable row level security;

create policy "profiles_self_select"
  on profiles for select using (auth.uid() = id);

-- Public view of other riders' minimal info (display_name, avatar)
-- is exposed via the `public_profiles` view further down.

create policy "profiles_self_update"
  on profiles for update using (auth.uid() = id);

-- rides --------------------------------------------------------
alter table rides enable row level security;

create policy "rides_owner_all"
  on rides for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- track_points -------------------------------------------------
alter table track_points enable row level security;

create policy "track_points_owner_select"
  on track_points for select using (
    exists (select 1 from rides r where r.id = track_points.ride_id and r.user_id = auth.uid())
  );

create policy "track_points_owner_insert"
  on track_points for insert with check (
    exists (select 1 from rides r where r.id = track_points.ride_id and r.user_id = auth.uid())
  );

-- planned_routes ----------------------------------------------
alter table planned_routes enable row level security;

create policy "planned_routes_owner_all"
  on planned_routes for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- pois (community-curated, public read) ------------------------
alter table pois enable row level security;

create policy "pois_public_read" on pois for select using (true);
create policy "pois_authenticated_insert"
  on pois for insert with check (auth.uid() = created_by);

-- hazards ------------------------------------------------------
alter table hazards enable row level security;

create policy "hazards_public_read" on hazards for select using (true);
create policy "hazards_reporter_insert"
  on hazards for insert with check (auth.uid() = reporter_id);
create policy "hazards_reporter_update"
  on hazards for update using (auth.uid() = reporter_id);

-- group_rides --------------------------------------------------
alter table group_rides enable row level security;

-- A user can see group rides they host or participate in.
create policy "group_rides_visibility"
  on group_rides for select using (
    auth.uid() = host_id
    or exists (select 1 from group_participants p
               where p.group_ride_id = group_rides.id and p.user_id = auth.uid())
  );

create policy "group_rides_host_write"
  on group_rides for insert with check (auth.uid() = host_id);

create policy "group_rides_host_update"
  on group_rides for update using (auth.uid() = host_id);

-- group_participants ------------------------------------------
alter table group_participants enable row level security;

create policy "group_participants_visible_to_members"
  on group_participants for select using (
    user_id = auth.uid()
    or exists (select 1 from group_participants p
               where p.group_ride_id = group_participants.group_ride_id and p.user_id = auth.uid())
  );

create policy "group_participants_self_join"
  on group_participants for insert with check (auth.uid() = user_id);

create policy "group_participants_self_update"
  on group_participants for update using (auth.uid() = user_id);

create policy "group_participants_self_leave"
  on group_participants for delete using (auth.uid() = user_id);

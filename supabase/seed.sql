-- =============================================================
-- RideFlow — Seed data for Metro Manila
--
-- Run AFTER migrations. Coordinates are accurate enough for demos.
-- =============================================================

-- Coffee stops --------------------------------------------------
insert into pois (type, name, lat, lng, address, notes, rating, hours, recommended_for) values
  ('coffee', 'Yardstick Coffee',           14.5587, 121.0204, 'Legaspi Village, Makati',
   'Specialty third-wave; bike rack out front.', 4.7, '7am – 8pm', '{coffee,chill}'),
  ('coffee', 'Single Origin Salcedo',      14.5586, 121.0245, 'Salcedo Village, Makati',
   'Open-air seating, weekend market vibes.',    4.6, '7am – 6pm', '{coffee,chill}'),
  ('coffee', 'Magnolia Bakery & Cafe',     14.6342, 121.0437, 'Maginhawa, Quezon City',
   'Long ride pit stop near UP Diliman.',        4.5, '7am – 10pm','{coffee,chill,training}'),
  ('coffee', 'Kuppa Roastery',             14.5589, 121.0201, 'Bonifacio Global City',
   'Roastery + cafe, good post-ride food.',      4.6, '7am – 9pm', '{coffee,chill}');

-- Water stations ------------------------------------------------
insert into pois (type, name, lat, lng, notes, recommended_for) values
  ('water', 'Marikina River Park Refill',   14.6469, 121.1003,
   'Public refill near the bike loop.',  '{training,chill}'),
  ('water', 'BGC Bike Lane Hydration Hub', 14.5535, 121.0463,
   'Manned weekends only.',              '{training,chill,coffee}'),
  ('water', 'Roxas Blvd Baywalk Refill',   14.5718, 120.9788,
   'Useful before the sunset stretch.',  '{sunset,chill}');

-- Viewpoints (for sunset rides) --------------------------------
insert into pois (type, name, lat, lng, notes, recommended_for) values
  ('viewpoint', 'CCP Lagoon',              14.5546, 120.9802,
   'Classic Manila Bay sunset spot.',     '{sunset,chill}'),
  ('viewpoint', 'Manila Baywalk Esplanade',14.5832, 120.9762,
   'Wide path along the bay.',            '{sunset,chill}');

-- Bike shops ---------------------------------------------------
insert into pois (type, name, lat, lng, notes, recommended_for) values
  ('bike_shop', 'Cartimar Bike District',  14.5610, 120.9908,
   'Rows of shops; cheapest tubes in the city.', '{training,chill,coffee}'),
  ('bike_shop', 'Velo Manila BGC',         14.5495, 121.0462,
   'Fits, repairs, and demo bikes.',             '{training,chill}');

-- A couple of long-running flood-prone hazards ------------------
-- (real reporter_id will be assigned in production; using NULL safety placeholder won't
--  satisfy the not-null constraint, so omit hazards from the seed unless you have a
--  test user. See README for instructions.)

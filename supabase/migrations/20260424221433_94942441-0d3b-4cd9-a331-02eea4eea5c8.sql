-- Drop all anon SELECT policies on base tables
DROP POLICY IF EXISTS "Anon read approved farm workers via view" ON public.service_applications;
DROP POLICY IF EXISTS "Anon read approved drivers via view" ON public.service_applications;
DROP POLICY IF EXISTS "Anon read approved vehicles via view" ON public.vehicle_registrations;

-- Revoke ALL grants from anon on base tables
REVOKE ALL ON public.service_applications FROM anon;
REVOKE ALL ON public.vehicle_registrations FROM anon;

-- Switch the views back to security definer so they can read base tables
-- on behalf of anonymous callers (only safe columns are exposed).
DROP VIEW IF EXISTS public.public_farm_workers;
DROP VIEW IF EXISTS public.public_drivers;
DROP VIEW IF EXISTS public.public_vehicles;

CREATE VIEW public.public_farm_workers AS
SELECT
  id, first_name, gender, age, state, district, mandal, village,
  skills, availability, expected_wage, wage_type, category,
  group_count, experience_years, profile_photo_url, created_at
FROM public.service_applications
WHERE service_type = 'farm_maker' AND status = 'approved';

CREATE VIEW public.public_drivers AS
SELECT
  id, first_name, gender, age, state, district, mandal, village,
  vehicle_type, work_duration, preferred_location, profile_photo_url, created_at
FROM public.service_applications
WHERE service_type = 'agrizin_driver' AND status = 'approved';

CREATE VIEW public.public_vehicles AS
SELECT
  id, full_name, gender, age, state, district, mandal, village,
  vehicle_usage_type, vehicle_image_urls, profile_photo_url, created_at
FROM public.vehicle_registrations
WHERE status = 'approved';

-- Force the views to run as their owner (postgres) so they can bypass RLS
-- and read approved rows even though anon has no access to the base tables.
ALTER VIEW public.public_farm_workers OWNER TO postgres;
ALTER VIEW public.public_drivers OWNER TO postgres;
ALTER VIEW public.public_vehicles OWNER TO postgres;

GRANT SELECT ON public.public_farm_workers TO anon, authenticated;
GRANT SELECT ON public.public_drivers TO anon, authenticated;
GRANT SELECT ON public.public_vehicles TO anon, authenticated;
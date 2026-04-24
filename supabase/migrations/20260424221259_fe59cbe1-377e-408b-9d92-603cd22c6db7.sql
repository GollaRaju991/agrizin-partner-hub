-- Remove the broad anon SELECT policies; we'll rely on the views only
DROP POLICY IF EXISTS "Views read approved farm workers" ON public.service_applications;
DROP POLICY IF EXISTS "Views read approved drivers" ON public.service_applications;
DROP POLICY IF EXISTS "Views read approved vehicles" ON public.vehicle_registrations;

-- Recreate the views as SECURITY DEFINER (default) so they bypass RLS.
-- They still only project safe columns and filter to approved rows.
DROP VIEW IF EXISTS public.public_farm_workers;
DROP VIEW IF EXISTS public.public_drivers;
DROP VIEW IF EXISTS public.public_vehicles;

CREATE VIEW public.public_farm_workers AS
SELECT
  id, first_name, gender, age, state, district, mandal, village,
  skills, availability, expected_wage, wage_type, category,
  group_count, experience_years, profile_photo_url,
  created_at
FROM public.service_applications
WHERE service_type = 'farm_maker' AND status = 'approved';

CREATE VIEW public.public_drivers AS
SELECT
  id, first_name, gender, age, state, district, mandal, village,
  vehicle_type, work_duration, preferred_location, profile_photo_url,
  created_at
FROM public.service_applications
WHERE service_type = 'agrizin_driver' AND status = 'approved';

CREATE VIEW public.public_vehicles AS
SELECT
  id, full_name, gender, age, state, district, mandal, village,
  vehicle_usage_type, vehicle_image_urls, profile_photo_url,
  created_at
FROM public.vehicle_registrations
WHERE status = 'approved';

GRANT SELECT ON public.public_farm_workers TO anon, authenticated;
GRANT SELECT ON public.public_drivers TO anon, authenticated;
GRANT SELECT ON public.public_vehicles TO anon, authenticated;
-- Recreate views with security_invoker = on (recommended)
DROP VIEW IF EXISTS public.public_farm_workers;
DROP VIEW IF EXISTS public.public_drivers;
DROP VIEW IF EXISTS public.public_vehicles;

CREATE VIEW public.public_farm_workers
WITH (security_invoker = on) AS
SELECT
  id, first_name, gender, age, state, district, mandal, village,
  skills, availability, expected_wage, wage_type, category,
  group_count, experience_years, profile_photo_url, created_at
FROM public.service_applications
WHERE service_type = 'farm_maker' AND status = 'approved';

CREATE VIEW public.public_drivers
WITH (security_invoker = on) AS
SELECT
  id, first_name, gender, age, state, district, mandal, village,
  vehicle_type, work_duration, preferred_location, profile_photo_url, created_at
FROM public.service_applications
WHERE service_type = 'agrizin_driver' AND status = 'approved';

CREATE VIEW public.public_vehicles
WITH (security_invoker = on) AS
SELECT
  id, full_name, gender, age, state, district, mandal, village,
  vehicle_usage_type, vehicle_image_urls, profile_photo_url, created_at
FROM public.vehicle_registrations
WHERE status = 'approved';

GRANT SELECT ON public.public_farm_workers TO anon, authenticated;
GRANT SELECT ON public.public_drivers TO anon, authenticated;
GRANT SELECT ON public.public_vehicles TO anon, authenticated;

-- Re-add narrow RLS so the views can read base tables when called by anon
CREATE POLICY "Anon read approved farm workers via view"
ON public.service_applications FOR SELECT
TO anon
USING (service_type = 'farm_maker' AND status = 'approved');

CREATE POLICY "Anon read approved drivers via view"
ON public.service_applications FOR SELECT
TO anon
USING (service_type = 'agrizin_driver' AND status = 'approved');

CREATE POLICY "Anon read approved vehicles via view"
ON public.vehicle_registrations FOR SELECT
TO anon
USING (status = 'approved');

-- Restore SELECT grant on tables for anon (RLS still gates row access),
-- but we revoke direct column SELECT on sensitive columns instead via column-level grants.
GRANT SELECT (
  id, first_name, gender, age, state, district, mandal, village,
  service_type, status, skills, availability, expected_wage, wage_type,
  category, group_count, experience_years, profile_photo_url,
  vehicle_type, work_duration, preferred_location, created_at
) ON public.service_applications TO anon;

GRANT SELECT (
  id, full_name, gender, age, state, district, mandal, village,
  vehicle_usage_type, vehicle_image_urls, profile_photo_url,
  status, created_at
) ON public.vehicle_registrations TO anon;
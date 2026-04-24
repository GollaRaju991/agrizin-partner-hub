-- Drop the views (replaced by functions)
DROP VIEW IF EXISTS public.public_farm_workers;
DROP VIEW IF EXISTS public.public_drivers;
DROP VIEW IF EXISTS public.public_vehicles;

-- Safe public function: farm workers
CREATE OR REPLACE FUNCTION public.get_public_farm_workers()
RETURNS TABLE (
  id uuid, first_name text, gender text, age int,
  state text, district text, mandal text, village text,
  skills text[], availability text, expected_wage numeric, wage_type text,
  category text, group_count int, experience_years int,
  profile_photo_url text, created_at timestamptz
)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT id, first_name, gender, age, state, district, mandal, village,
         skills, availability, expected_wage, wage_type, category,
         group_count, experience_years, profile_photo_url, created_at
  FROM public.service_applications
  WHERE service_type = 'farm_maker' AND status = 'approved';
$$;

-- Safe public function: drivers
CREATE OR REPLACE FUNCTION public.get_public_drivers()
RETURNS TABLE (
  id uuid, first_name text, gender text, age int,
  state text, district text, mandal text, village text,
  vehicle_type text, work_duration text, preferred_location text,
  profile_photo_url text, created_at timestamptz
)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT id, first_name, gender, age, state, district, mandal, village,
         vehicle_type, work_duration, preferred_location,
         profile_photo_url, created_at
  FROM public.service_applications
  WHERE service_type = 'agrizin_driver' AND status = 'approved';
$$;

-- Safe public function: vehicles
CREATE OR REPLACE FUNCTION public.get_public_vehicles()
RETURNS TABLE (
  id uuid, full_name text, gender text, age int,
  state text, district text, mandal text, village text,
  vehicle_usage_type text, vehicle_image_urls text[],
  profile_photo_url text, created_at timestamptz
)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT id, full_name, gender, age, state, district, mandal, village,
         vehicle_usage_type, vehicle_image_urls, profile_photo_url, created_at
  FROM public.vehicle_registrations
  WHERE status = 'approved';
$$;

GRANT EXECUTE ON FUNCTION public.get_public_farm_workers() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_drivers() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_vehicles() TO anon, authenticated;
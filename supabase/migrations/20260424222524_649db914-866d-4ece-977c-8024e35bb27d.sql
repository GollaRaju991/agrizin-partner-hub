-- 1. Recreate safe public views (security_invoker so anon hits via SECURITY DEFINER fns below)
DROP VIEW IF EXISTS public.public_farm_workers;
DROP VIEW IF EXISTS public.public_drivers;
DROP VIEW IF EXISTS public.public_vehicles;

CREATE VIEW public.public_farm_workers
WITH (security_invoker = on) AS
SELECT id, first_name, gender, age, state, district, mandal, village,
       skills, availability, expected_wage, wage_type, category,
       group_count, experience_years, profile_photo_url, created_at
FROM public.service_applications
WHERE service_type = 'farm_maker' AND status = 'approved';

CREATE VIEW public.public_drivers
WITH (security_invoker = on) AS
SELECT id, first_name, gender, age, state, district, mandal, village,
       vehicle_type, work_duration, preferred_location, profile_photo_url, created_at
FROM public.service_applications
WHERE service_type = 'agrizin_driver' AND status = 'approved';

CREATE VIEW public.public_vehicles
WITH (security_invoker = on) AS
SELECT id, full_name, gender, age, state, district, mandal, village,
       vehicle_usage_type, vehicle_image_urls, profile_photo_url, created_at
FROM public.vehicle_registrations
WHERE status = 'approved';

GRANT SELECT ON public.public_farm_workers TO anon, authenticated;
GRANT SELECT ON public.public_drivers TO anon, authenticated;
GRANT SELECT ON public.public_vehicles TO anon, authenticated;

-- Re-add narrow anon read on base tables so security_invoker views work
DROP POLICY IF EXISTS "Anon read approved farm workers via view" ON public.service_applications;
DROP POLICY IF EXISTS "Anon read approved drivers via view" ON public.service_applications;
DROP POLICY IF EXISTS "Anon read approved vehicles via view" ON public.vehicle_registrations;

-- Use column-level grants so anon can only project safe columns
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

CREATE POLICY "Anon read approved farm workers via view"
ON public.service_applications FOR SELECT TO anon
USING (service_type = 'farm_maker' AND status = 'approved');

CREATE POLICY "Anon read approved drivers via view"
ON public.service_applications FOR SELECT TO anon
USING (service_type = 'agrizin_driver' AND status = 'approved');

CREATE POLICY "Anon read approved vehicles via view"
ON public.vehicle_registrations FOR SELECT TO anon
USING (status = 'approved');

-- 2. Search functions with location + work filters (no phone returned)
CREATE OR REPLACE FUNCTION public.search_farm_workers(
  _state text DEFAULT NULL, _district text DEFAULT NULL,
  _mandal text DEFAULT NULL, _village text DEFAULT NULL,
  _skill text DEFAULT NULL, _limit int DEFAULT 20, _offset int DEFAULT 0
)
RETURNS SETOF public.public_farm_workers
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.public_farm_workers
  WHERE (_state    IS NULL OR state    ILIKE '%'||_state||'%')
    AND (_district IS NULL OR district ILIKE '%'||_district||'%')
    AND (_mandal   IS NULL OR mandal   ILIKE '%'||_mandal||'%')
    AND (_village  IS NULL OR village  ILIKE '%'||_village||'%')
    AND (_skill    IS NULL OR _skill = ANY(skills))
  ORDER BY created_at DESC
  LIMIT _limit OFFSET _offset;
$$;

CREATE OR REPLACE FUNCTION public.search_drivers(
  _state text DEFAULT NULL, _district text DEFAULT NULL,
  _mandal text DEFAULT NULL, _village text DEFAULT NULL,
  _vehicle_type text DEFAULT NULL, _limit int DEFAULT 20, _offset int DEFAULT 0
)
RETURNS SETOF public.public_drivers
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.public_drivers
  WHERE (_state        IS NULL OR state        ILIKE '%'||_state||'%')
    AND (_district     IS NULL OR district     ILIKE '%'||_district||'%')
    AND (_mandal       IS NULL OR mandal       ILIKE '%'||_mandal||'%')
    AND (_village      IS NULL OR village      ILIKE '%'||_village||'%')
    AND (_vehicle_type IS NULL OR vehicle_type ILIKE '%'||_vehicle_type||'%')
  ORDER BY created_at DESC
  LIMIT _limit OFFSET _offset;
$$;

CREATE OR REPLACE FUNCTION public.search_vehicles(
  _state text DEFAULT NULL, _district text DEFAULT NULL,
  _mandal text DEFAULT NULL, _village text DEFAULT NULL,
  _vehicle_type text DEFAULT NULL, _limit int DEFAULT 20, _offset int DEFAULT 0
)
RETURNS SETOF public.public_vehicles
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.public_vehicles
  WHERE (_state        IS NULL OR state              ILIKE '%'||_state||'%')
    AND (_district     IS NULL OR district           ILIKE '%'||_district||'%')
    AND (_mandal       IS NULL OR mandal             ILIKE '%'||_mandal||'%')
    AND (_village      IS NULL OR village            ILIKE '%'||_village||'%')
    AND (_vehicle_type IS NULL OR vehicle_usage_type ILIKE '%'||_vehicle_type||'%')
  ORDER BY created_at DESC
  LIMIT _limit OFFSET _offset;
$$;

GRANT EXECUTE ON FUNCTION public.search_farm_workers(text,text,text,text,text,int,int) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_drivers(text,text,text,text,text,int,int)      TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_vehicles(text,text,text,text,text,int,int)     TO anon, authenticated;

-- 3. Contact reveal — only for AUTHENTICATED users (logs the request too)
CREATE TABLE IF NOT EXISTS public.contact_reveals (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null,
  listing_kind text not null,
  listing_id uuid not null,
  created_at timestamptz not null default now()
);
ALTER TABLE public.contact_reveals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see their own reveals"
  ON public.contact_reveals FOR SELECT TO authenticated
  USING (auth.uid() = requester_user_id);

CREATE OR REPLACE FUNCTION public.get_contact_info(_kind text, _listing_id uuid)
RETURNS TABLE (name text, phone text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _phone text; _name text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Login required to view contact';
  END IF;

  IF _kind = 'vehicle' THEN
    SELECT full_name, mobile INTO _name, _phone
    FROM public.vehicle_registrations
    WHERE id = _listing_id AND status = 'approved';
  ELSIF _kind IN ('farm_worker','driver') THEN
    SELECT first_name, phone INTO _name, _phone
    FROM public.service_applications
    WHERE id = _listing_id AND status = 'approved';
  ELSE
    RAISE EXCEPTION 'Invalid kind';
  END IF;

  IF _phone IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  INSERT INTO public.contact_reveals (requester_user_id, listing_kind, listing_id)
  VALUES (auth.uid(), _kind, _listing_id);

  RETURN QUERY SELECT _name, _phone;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_contact_info(text, uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_contact_info(text, uuid) FROM anon, public;
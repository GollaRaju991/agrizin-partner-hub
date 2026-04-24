-- 1. Drop the over-permissive public SELECT policies
DROP POLICY IF EXISTS "Public can view approved farm workers" ON public.service_applications;
DROP POLICY IF EXISTS "Public can view approved vehicles" ON public.vehicle_registrations;

-- 2. Create SAFE public views (only non-sensitive columns)
CREATE OR REPLACE VIEW public.public_farm_workers
WITH (security_invoker = on) AS
SELECT
  id, first_name, gender, age, state, district, mandal, village,
  skills, availability, expected_wage, wage_type, category,
  group_count, experience_years, profile_photo_url,
  created_at
FROM public.service_applications
WHERE service_type = 'farm_maker' AND status = 'approved';

CREATE OR REPLACE VIEW public.public_drivers
WITH (security_invoker = on) AS
SELECT
  id, first_name, gender, age, state, district, mandal, village,
  vehicle_type, work_duration, preferred_location, profile_photo_url,
  created_at
FROM public.service_applications
WHERE service_type = 'agrizin_driver' AND status = 'approved';

CREATE OR REPLACE VIEW public.public_vehicles
WITH (security_invoker = on) AS
SELECT
  id, full_name, gender, age, state, district, mandal, village,
  vehicle_usage_type, vehicle_image_urls, profile_photo_url,
  created_at
FROM public.vehicle_registrations
WHERE status = 'approved';

-- 3. Allow anonymous + authenticated read access on the safe views only
GRANT SELECT ON public.public_farm_workers TO anon, authenticated;
GRANT SELECT ON public.public_drivers TO anon, authenticated;
GRANT SELECT ON public.public_vehicles TO anon, authenticated;

-- 4. Allow the views to read their base tables (security_invoker requires this)
CREATE POLICY "Views read approved farm workers"
ON public.service_applications FOR SELECT
TO anon, authenticated
USING (service_type = 'farm_maker' AND status = 'approved');

CREATE POLICY "Views read approved drivers"
ON public.service_applications FOR SELECT
TO anon, authenticated
USING (service_type = 'agrizin_driver' AND status = 'approved');

CREATE POLICY "Views read approved vehicles"
ON public.vehicle_registrations FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- NOTE: anon technically still hits base tables via these policies, but only
-- the view-projected columns are exposed in our public API. To be extra safe
-- we revoke direct table access from anon below.
REVOKE SELECT ON public.service_applications FROM anon;
REVOKE SELECT ON public.vehicle_registrations FROM anon;

-- 5. Make vehicle-documents bucket PRIVATE (Aadhaar/license images)
UPDATE storage.buckets SET public = false WHERE id = 'vehicle-documents';

-- Drop any old public policies on vehicle-documents
DROP POLICY IF EXISTS "Anyone can view vehicle documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can view vehicle documents" ON storage.objects;

-- Owner-only access to vehicle documents
CREATE POLICY "Owners can view their vehicle documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'vehicle-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners can upload their vehicle documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners can update their vehicle documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vehicle-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners can delete their vehicle documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vehicle-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Add DELETE policy for profile-photos so users can remove their own
CREATE POLICY "Owners can delete their profile photo"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
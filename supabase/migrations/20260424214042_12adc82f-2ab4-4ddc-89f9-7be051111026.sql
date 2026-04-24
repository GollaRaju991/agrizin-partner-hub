-- Add fields for Farm Worker registration
ALTER TABLE public.service_applications
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS group_count integer;

-- Add fields for Agrizin Driver document/vehicle data
ALTER TABLE public.service_applications
  ADD COLUMN IF NOT EXISTS aadhaar_pan text,
  ADD COLUMN IF NOT EXISTS aadhaar_front_url text,
  ADD COLUMN IF NOT EXISTS aadhaar_back_url text,
  ADD COLUMN IF NOT EXISTS driving_license_number text,
  ADD COLUMN IF NOT EXISTS license_front_url text,
  ADD COLUMN IF NOT EXISTS license_back_url text,
  ADD COLUMN IF NOT EXISTS rc_image_url text,
  ADD COLUMN IF NOT EXISTS vehicle_number text,
  ADD COLUMN IF NOT EXISTS vehicle_image_urls text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS work_duration text,
  ADD COLUMN IF NOT EXISTS preferred_location text;
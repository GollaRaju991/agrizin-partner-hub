
-- Add new columns to service_applications for farm worker registration
ALTER TABLE public.service_applications
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS district text,
  ADD COLUMN IF NOT EXISTS mandal text,
  ADD COLUMN IF NOT EXISTS village text,
  ADD COLUMN IF NOT EXISTS profile_photo_url text,
  ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS availability text,
  ADD COLUMN IF NOT EXISTS expected_wage numeric,
  ADD COLUMN IF NOT EXISTS wage_type text DEFAULT 'per_day';

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('profile-photos', 'profile-photos', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile photos
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

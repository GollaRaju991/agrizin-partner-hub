
-- Create vehicle_registrations table
CREATE TABLE public.vehicle_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Personal details
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  aadhaar_pan TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  state TEXT,
  district TEXT,
  mandal TEXT,
  village TEXT,
  
  -- Document URLs
  profile_photo_url TEXT,
  aadhaar_front_url TEXT,
  aadhaar_back_url TEXT,
  
  -- Vehicle details
  vehicle_number TEXT NOT NULL,
  driving_license_number TEXT NOT NULL,
  license_front_url TEXT,
  license_back_url TEXT,
  rc_image_url TEXT,
  vehicle_image_urls TEXT[] DEFAULT '{}',
  
  -- Vehicle usage
  vehicle_usage_type TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicle_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can insert their own vehicle registration"
ON public.vehicle_registrations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own vehicle registration"
ON public.vehicle_registrations FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicle registration"
ON public.vehicle_registrations FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_vehicle_registrations_updated_at
  BEFORE UPDATE ON public.vehicle_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for vehicle documents
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-documents', 'vehicle-documents', true);

-- Storage RLS policies
CREATE POLICY "Authenticated users can upload vehicle documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view vehicle documents"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'vehicle-documents');

CREATE POLICY "Users can update their own vehicle documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'vehicle-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own vehicle documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'vehicle-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

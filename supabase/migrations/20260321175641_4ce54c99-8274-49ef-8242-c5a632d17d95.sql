
-- Allow anonymous users to view approved vehicle registrations (for search)
CREATE POLICY "Public can view approved vehicles"
ON public.vehicle_registrations
FOR SELECT
TO anon
USING (status = 'approved');

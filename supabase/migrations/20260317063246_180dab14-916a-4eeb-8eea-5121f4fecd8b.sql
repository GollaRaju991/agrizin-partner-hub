CREATE POLICY "Public can view approved farm workers"
ON public.service_applications
FOR SELECT
TO anon
USING (service_type = 'farm_maker' AND status = 'approved');
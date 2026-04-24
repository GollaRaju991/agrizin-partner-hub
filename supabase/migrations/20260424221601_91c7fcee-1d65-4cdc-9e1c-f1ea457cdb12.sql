-- 1. Referral earnings: block all client writes (server-only via SECURITY DEFINER fn)
CREATE POLICY "No client inserts on referral_earnings"
ON public.referral_earnings FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "No client updates on referral_earnings"
ON public.referral_earnings FOR UPDATE TO authenticated USING (false);
CREATE POLICY "No client deletes on referral_earnings"
ON public.referral_earnings FOR DELETE TO authenticated USING (false);

-- 2. Withdrawal requests: block updates and deletes from clients
CREATE POLICY "No client updates on withdrawal_requests"
ON public.withdrawal_requests FOR UPDATE TO authenticated USING (false);
CREATE POLICY "No client deletes on withdrawal_requests"
ON public.withdrawal_requests FOR DELETE TO authenticated USING (false);

-- 3. Tighten profiles: change public -> authenticated
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. Tighten service_applications: change public -> authenticated
DROP POLICY IF EXISTS "Users can view their own applications" ON public.service_applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON public.service_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.service_applications;

CREATE POLICY "Users can view their own applications"
ON public.service_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own applications"
ON public.service_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications"
ON public.service_applications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
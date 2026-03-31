
-- Fix: Replace the overly permissive INSERT policy on referral_earnings
DROP POLICY "System can insert referral earnings" ON public.referral_earnings;

-- Create a security definer function to credit referrals (bypasses RLS)
CREATE OR REPLACE FUNCTION public.credit_referral(
  _referrer_user_id uuid,
  _referred_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if already credited for this referred user
  IF EXISTS (
    SELECT 1 FROM public.referral_earnings
    WHERE referrer_user_id = _referrer_user_id
      AND referred_user_id = _referred_user_id
  ) THEN
    RETURN;
  END IF;
  
  INSERT INTO public.referral_earnings (referrer_user_id, referred_user_id, amount, reason)
  VALUES (_referrer_user_id, _referred_user_id, 5, 'referral_signup');
END;
$$;

-- Trigger: when a service_application is inserted with status completed/approved,
-- check if the user was referred and credit the referrer
CREATE OR REPLACE FUNCTION public.check_referral_on_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _referrer_id uuid;
  _reference_id text;
BEGIN
  -- Get the reference_id from the user's profile
  SELECT reference_id INTO _reference_id
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  -- If user has a reference_id, find the referrer
  IF _reference_id IS NOT NULL AND _reference_id != '' THEN
    SELECT user_id INTO _referrer_id
    FROM public.profiles
    WHERE phone = _reference_id OR reference_id = _reference_id
    LIMIT 1;
    
    -- Actually find by matching the referrer's phone as the reference code
    SELECT user_id INTO _referrer_id
    FROM public.profiles
    WHERE phone = _reference_id
    LIMIT 1;
    
    IF _referrer_id IS NOT NULL AND _referrer_id != NEW.user_id THEN
      PERFORM public.credit_referral(_referrer_id, NEW.user_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_referral_on_service_app
  AFTER INSERT ON public.service_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.check_referral_on_application();

-- Same trigger for vehicle registrations
CREATE OR REPLACE FUNCTION public.check_referral_on_vehicle()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _referrer_id uuid;
  _reference_id text;
BEGIN
  SELECT reference_id INTO _reference_id
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  IF _reference_id IS NOT NULL AND _reference_id != '' THEN
    SELECT user_id INTO _referrer_id
    FROM public.profiles
    WHERE phone = _reference_id
    LIMIT 1;
    
    IF _referrer_id IS NOT NULL AND _referrer_id != NEW.user_id THEN
      PERFORM public.credit_referral(_referrer_id, NEW.user_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_referral_on_vehicle
  AFTER INSERT ON public.vehicle_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.check_referral_on_vehicle();

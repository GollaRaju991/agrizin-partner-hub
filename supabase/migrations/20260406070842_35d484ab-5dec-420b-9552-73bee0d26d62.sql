
DROP TRIGGER IF EXISTS trg_check_referral_on_vehicle ON public.vehicle_registrations;
CREATE TRIGGER trg_check_referral_on_vehicle
  AFTER INSERT ON public.vehicle_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.check_referral_on_vehicle();

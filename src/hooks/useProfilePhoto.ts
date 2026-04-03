import { useUserApplications } from "@/hooks/useUserApplications";

export const useProfilePhoto = (): string | null => {
  const { applications, vehicleRegs } = useUserApplications();

  // Check service applications for profile photo
  for (const app of applications) {
    if (app.profile_photo_url) return app.profile_photo_url;
  }
  // Check vehicle registrations for profile photo
  for (const reg of vehicleRegs) {
    if (reg.profile_photo_url) return reg.profile_photo_url;
  }
  return null;
};

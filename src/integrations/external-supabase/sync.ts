import { externalSupabase } from "@/integrations/external-supabase/client";

/**
 * Sync a profile record to the external Supabase database.
 * Fires and forgets — errors are logged but don't block the main flow.
 */
export const syncProfileToExternal = async (profile: {
  user_id: string;
  first_name: string;
  phone: string;
  reference_id?: string | null;
  is_online?: boolean;
}) => {
  try {
    const { error } = await externalSupabase.from("profiles").upsert(
      {
        user_id: profile.user_id,
        first_name: profile.first_name,
        phone: profile.phone,
        reference_id: profile.reference_id || null,
        is_online: profile.is_online ?? false,
      },
      { onConflict: "user_id" }
    );
    if (error) console.error("External sync (profile) error:", error);
  } catch (err) {
    console.error("External sync (profile) failed:", err);
  }
};

/**
 * Sync a service application record to the external Supabase database.
 */
export const syncApplicationToExternal = async (application: Record<string, any>) => {
  try {
    const { error } = await externalSupabase
      .from("service_applications")
      .upsert(application, { onConflict: "id" });
    if (error) console.error("External sync (application) error:", error);
  } catch (err) {
    console.error("External sync (application) failed:", err);
  }
};

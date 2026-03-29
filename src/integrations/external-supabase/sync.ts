import { supabase } from "@/integrations/supabase/client";

/**
 * Sync a profile record to the external database via edge function.
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
    const { error } = await supabase.functions.invoke("sync-external", {
      body: {
        action: "sync_profile",
        data: {
          user_id: profile.user_id,
          first_name: profile.first_name,
          phone: profile.phone,
          reference_id: profile.reference_id || null,
          is_online: profile.is_online ?? false,
        },
      },
    });
    if (error) console.error("External sync (profile) error:", error);
  } catch (err) {
    console.error("External sync (profile) failed:", err);
  }
};

/**
 * Sync a service application record to the external database via edge function.
 */
export const syncApplicationToExternal = async (application: Record<string, any>) => {
  try {
    const { error } = await supabase.functions.invoke("sync-external", {
      body: {
        action: "sync_application",
        data: application,
      },
    });
    if (error) console.error("External sync (application) error:", error);
  } catch (err) {
    console.error("External sync (application) failed:", err);
  }
};

/**
 * Sync a vehicle registration record to the external database via edge function.
 */
export const syncVehicleToExternal = async (vehicle: Record<string, any>) => {
  try {
    const { error } = await supabase.functions.invoke("sync-external", {
      body: {
        action: "sync_vehicle",
        data: vehicle,
      },
    });
    if (error) console.error("External sync (vehicle) error:", error);
  } catch (err) {
    console.error("External sync (vehicle) failed:", err);
  }
};

/**
 * Sync vehicle registration data to the Agrizin app's vehicle_listings table.
 */
export const syncVehicleToAgrizin = async (vehicle: Record<string, any>) => {
  try {
    const { error } = await supabase.functions.invoke("sync-vehicle-to-agrizin", {
      body: { data: vehicle },
    });
    if (error) console.error("Agrizin sync (vehicle) error:", error);
  } catch (err) {
    console.error("Agrizin sync (vehicle) failed:", err);
  }
};

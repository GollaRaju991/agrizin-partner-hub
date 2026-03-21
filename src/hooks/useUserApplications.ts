import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ApplicationInfo {
  id: string;
  service_type: "rent_vehicle" | "farm_maker" | "agrizin_driver";
  status: string;
  first_name: string;
  phone: string;
  skills: string[] | null;
  experience_years: number | null;
  state: string | null;
  district: string | null;
  mandal: string | null;
  village: string | null;
  availability: string | null;
  expected_wage: number | null;
  wage_type: string | null;
  profile_photo_url: string | null;
  vehicle_type: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  registration_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleRegInfo {
  id: string;
  status: string;
  full_name: string;
  mobile: string;
  vehicle_number: string;
  vehicle_usage_type: string;
  driving_license_number: string;
  state: string | null;
  district: string | null;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationInfo[]>([]);
  const [vehicleRegs, setVehicleRegs] = useState<VehicleRegInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) { setApplications([]); setVehicleRegs([]); setLoading(false); return; }
    setLoading(true);
    const [appsRes, vehRes] = await Promise.all([
      supabase.from("service_applications").select("*").eq("user_id", user.id),
      supabase.from("vehicle_registrations").select("*").eq("user_id", user.id),
    ]);
    setApplications((appsRes.data as ApplicationInfo[]) || []);
    setVehicleRegs((vehRes.data as VehicleRegInfo[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Auto-complete: update pending/in_progress apps to completed after 1 min
  useEffect(() => {
    if (!applications.length && !vehicleRegs.length) return;
    const timers: NodeJS.Timeout[] = [];

    applications.forEach((app) => {
      if (app.status === "pending" || app.status === "in_progress") {
        const created = new Date(app.created_at).getTime();
        const elapsed = Date.now() - created;
        const remaining = Math.max(0, 60_000 - elapsed);
        const t = setTimeout(async () => {
          await supabase.from("service_applications").update({ status: "completed" }).eq("id", app.id);
          fetchAll();
        }, remaining);
        timers.push(t);
      }
    });

    vehicleRegs.forEach((v) => {
      if (v.status === "pending" || v.status === "in_progress") {
        const created = new Date(v.created_at).getTime();
        const elapsed = Date.now() - created;
        const remaining = Math.max(0, 60_000 - elapsed);
        const t = setTimeout(async () => {
          await supabase.from("vehicle_registrations").update({ status: "completed" }).eq("id", v.id);
          fetchAll();
        }, remaining);
        timers.push(t);
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [applications, vehicleRegs, fetchAll]);

  const getStatusForService = (serviceType: string): string | null => {
    if (serviceType === "rent_vehicle") {
      const vr = vehicleRegs[0];
      if (vr) return vr.status;
      const app = applications.find((a) => a.service_type === "rent_vehicle");
      return app?.status ?? null;
    }
    const app = applications.find((a) => a.service_type === serviceType);
    return app?.status ?? null;
  };

  return { applications, vehicleRegs, loading, refetch: fetchAll, getStatusForService };
}

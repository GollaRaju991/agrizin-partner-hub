import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AGRIZIN_URL = "https://vxbzggftzldttlhtvcej.supabase.co";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const agrizinKey = Deno.env.get("AGRIZIN_SUPABASE_KEY");
    if (!agrizinKey) {
      throw new Error("AGRIZIN_SUPABASE_KEY is not configured");
    }

    const agrizinClient = createClient(AGRIZIN_URL, agrizinKey);
    const body = await req.json();
    const kind: string = body.kind || "vehicle";
    const data = body.data;

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Missing data payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const locationAddress = (...parts: (string | null | undefined)[]) =>
      parts.filter(Boolean).join(", ") || null;

    // ---------- VEHICLE REGISTRATION ----------
    if (kind === "vehicle") {
      const listing = {
        source_id: data.id,
        user_id: data.user_id,
        owner_name: data.full_name,
        owner_phone: "HIDDEN",
        vehicle_type: data.vehicle_usage_type || null,
        vehicle_name: data.vehicle_number || null,
        condition: "good",
        availability: data.status === "approved" ? "available" : "pending",
        state: data.state || null,
        district: data.district || null,
        mandal: data.mandal || null,
        village: data.village || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        location_address: locationAddress(data.village, data.mandal, data.district, data.state),
        description: `Vehicle type: ${data.vehicle_usage_type || ""}`,
        vehicle_images: data.vehicle_image_urls || [],
        updated_at: new Date().toISOString(),
      };

      const { error } = await agrizinClient
        .from("vehicle_listings")
        .upsert(listing, { onConflict: "source_id" });
      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, table: "vehicle_listings", kind }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ---------- FARM WORKER ----------
    if (kind === "farm_worker") {
      const listing = {
        source_id: data.id,
        user_id: data.user_id,
        worker_name: data.first_name,
        phone: "HIDDEN",
        gender: data.gender || null,
        age: data.age || null,
        skills: data.skills || [],
        experience_years: data.experience_years || null,
        availability: data.availability || null,
        expected_wage: data.expected_wage || null,
        wage_type: data.wage_type || null,
        category: data.category || null,
        group_count: data.group_count || null,
        state: data.state || null,
        district: data.district || null,
        mandal: data.mandal || null,
        village: data.village || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        location_address: locationAddress(data.village, data.mandal, data.district, data.state),
        profile_photo_url: data.profile_photo_url || null,
        status: data.status || "approved",
        updated_at: new Date().toISOString(),
      };

      const { error } = await agrizinClient
        .from("farm_worker_listings")
        .upsert(listing, { onConflict: "source_id" });
      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, table: "farm_worker_listings", kind }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ---------- AGRIZIN DRIVER ----------
    if (kind === "agrizin_driver") {
      const listing = {
        source_id: data.id,
        user_id: data.user_id,
        driver_name: data.first_name,
        phone: "HIDDEN",
        gender: data.gender || null,
        age: data.age || null,
        vehicle_type: data.vehicle_type || null,
        work_duration: data.work_duration || data.availability || null,
        preferred_location: data.preferred_location || data.farm_location || null,
        state: data.state || null,
        district: data.district || null,
        mandal: data.mandal || null,
        village: data.village || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        location_address: locationAddress(data.village, data.mandal, data.district, data.state),
        profile_photo_url: data.profile_photo_url || null,
        status: data.status || "approved",
        updated_at: new Date().toISOString(),
      };

      const { error } = await agrizinClient
        .from("driver_listings")
        .upsert(listing, { onConflict: "source_id" });
      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, table: "driver_listings", kind }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown kind: ${kind}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sync to Agrizin error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

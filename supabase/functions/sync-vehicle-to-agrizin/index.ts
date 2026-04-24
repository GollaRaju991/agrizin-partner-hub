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
    const { data } = await req.json();

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Missing data payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map vehicle_registrations fields to vehicle_listings columns
    const listing = {
      user_id: data.user_id,
      owner_name: data.full_name,
      owner_phone: data.mobile,
      vehicle_type: data.vehicle_usage_type || null,
      vehicle_name: data.vehicle_number || null,
      model_year: null,
      daily_rate: null,
      condition: "good",
      availability: "available",
      state: data.state || null,
      district: data.district || null,
      mandal: data.mandal || null,
      village: data.village || null,
      latitude: null,
      longitude: null,
      location_address: [data.village, data.mandal, data.district, data.state]
        .filter(Boolean)
        .join(", ") || null,
      description: `Vehicle: ${data.vehicle_number || ""} | License: ${data.driving_license_number || ""}`,
      vehicle_images: data.vehicle_image_urls || [],
    };

    const { error } = await agrizinClient
      .from("vehicle_listings")
      .insert(listing);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, table: "vehicle_listings" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const externalUrl = "https://fytnskpijohbxgtngkhj.supabase.co";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const externalKey = Deno.env.get("EXTERNAL_SUPABASE_KEY");
    if (!externalKey) {
      throw new Error("EXTERNAL_SUPABASE_KEY is not configured");
    }

    const externalClient = createClient(externalUrl, externalKey);
    const { action, data } = await req.json();

    if (action === "sync_profile") {
      const { error } = await externalClient
        .from("profiles")
        .upsert(data, { onConflict: "user_id" });
      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, table: "profiles" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "sync_application") {
      const { error } = await externalClient
        .from("service_applications")
        .upsert(data, { onConflict: "id" });
      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, table: "service_applications" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "sync_vehicle") {
      // Vehicle registrations are synced to the Agrizin project via sync-vehicle-to-agrizin function
      // The external DB does not have a vehicle_registrations table
      console.log("Skipping vehicle sync to external DB — handled by sync-vehicle-to-agrizin");
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "vehicle sync handled by dedicated function" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use: sync_profile, sync_application, sync_vehicle" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

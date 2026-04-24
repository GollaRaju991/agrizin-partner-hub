import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const externalUrl = "https://fytnskpijohbxgtngkhj.supabase.co";

// The external Supabase project is no longer reachable (DNS no longer resolves).
// Set this to false if/when the external project is restored.
const EXTERNAL_DISABLED = true;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const externalKey = Deno.env.get("EXTERNAL_SUPABASE_KEY");
    const { action, data } = await req.json();

    // Skip gracefully — never throw — so client flows aren't blocked.
    if (EXTERNAL_DISABLED || !externalKey) {
      console.log(`Skipping ${action} — external project disabled/unavailable.`);
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "external project unavailable" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const externalClient = createClient(externalUrl, externalKey);

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
    // Return 200 with skipped flag so client never sees a hard failure on sync.
    return new Response(
      JSON.stringify({ success: false, skipped: true, error: (error as Error).message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

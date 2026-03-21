import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Lovable Cloud (source)
const sourceUrl = Deno.env.get("SUPABASE_URL")!;
const sourceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// External Supabase (destination)
const externalUrl = "https://fytnskpijohbxgtngkhj.supabase.co";
const externalKey = Deno.env.get("EXTERNAL_SUPABASE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sourceClient = createClient(sourceUrl, sourceKey);
    const externalClient = createClient(externalUrl, externalKey);

    const { action } = await req.json();

    if (action === "sync_profiles") {
      const { data: profiles, error: fetchErr } = await sourceClient
        .from("profiles")
        .select("*");
      if (fetchErr) throw fetchErr;

      for (const profile of profiles || []) {
        const { error: upsertErr } = await externalClient
          .from("profiles")
          .upsert(profile, { onConflict: "user_id" });
        if (upsertErr) console.error("Profile upsert error:", upsertErr);
      }

      return new Response(
        JSON.stringify({ success: true, synced: profiles?.length || 0, table: "profiles" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "sync_service_applications") {
      const { data: apps, error: fetchErr } = await sourceClient
        .from("service_applications")
        .select("*");
      if (fetchErr) throw fetchErr;

      for (const app of apps || []) {
        const { error: upsertErr } = await externalClient
          .from("service_applications")
          .upsert(app, { onConflict: "id" });
        if (upsertErr) console.error("Application upsert error:", upsertErr);
      }

      return new Response(
        JSON.stringify({ success: true, synced: apps?.length || 0, table: "service_applications" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "read_external_tables") {
      // Read profiles from external DB
      const { data: extProfiles } = await externalClient
        .from("profiles")
        .select("*")
        .limit(50);

      const { data: extApps } = await externalClient
        .from("service_applications")
        .select("*")
        .limit(50);

      return new Response(
        JSON.stringify({ profiles: extProfiles, service_applications: extApps }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use: sync_profiles, sync_service_applications, read_external_tables" }),
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

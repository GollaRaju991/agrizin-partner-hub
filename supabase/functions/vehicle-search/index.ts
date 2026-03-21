import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const state = url.searchParams.get("state") || "";
    const district = url.searchParams.get("district") || "";
    const mandal = url.searchParams.get("mandal") || "";
    const village = url.searchParams.get("village") || "";
    const vehicleType = url.searchParams.get("vehicle_type") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("vehicle_registrations")
      .select(
        "id, full_name, mobile, vehicle_number, vehicle_usage_type, state, district, mandal, village, profile_photo_url, vehicle_image_urls, status, created_at",
        { count: "exact" }
      )
      .eq("status", "approved")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,district.ilike.%${search}%,village.ilike.%${search}%,mandal.ilike.%${search}%,vehicle_usage_type.ilike.%${search}%`
      );
    }
    if (state) query = query.ilike("state", `%${state}%`);
    if (district) query = query.ilike("district", `%${district}%`);
    if (mandal) query = query.ilike("mandal", `%${mandal}%`);
    if (village) query = query.ilike("village", `%${village}%`);
    if (vehicleType) query = query.ilike("vehicle_usage_type", `%${vehicleType}%`);

    const { data, error, count } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        vehicles: data,
        total: count,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

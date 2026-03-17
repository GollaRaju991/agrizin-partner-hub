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
    const skill = url.searchParams.get("skill")?.toLowerCase() || "";
    const state = url.searchParams.get("state") || "";
    const district = url.searchParams.get("district") || "";
    const availability = url.searchParams.get("availability") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("service_applications")
      .select(
        "id, first_name, phone, gender, age, country, state, district, mandal, village, profile_photo_url, skills, experience_years, availability, expected_wage, wage_type, created_at",
        { count: "exact" }
      )
      .eq("service_type", "farm_maker")
      .eq("status", "approved")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,district.ilike.%${search}%,village.ilike.%${search}%,mandal.ilike.%${search}%`
      );
    }
    if (state) query = query.ilike("state", `%${state}%`);
    if (district) query = query.ilike("district", `%${district}%`);
    if (availability) query = query.eq("availability", availability);
    if (skill) query = query.contains("skills", [skill]);

    const { data, error, count } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        workers: data,
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

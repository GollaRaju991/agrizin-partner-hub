import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStates, getDistricts, getMandals } from "@/data/indianLocations";
import { supabase } from "@/integrations/supabase/client";
import { Search, ArrowLeft, Filter, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkerCard from "@/components/search/WorkerCard";
import VehicleCard from "@/components/search/VehicleCard";

type SearchType = "farm_worker" | "vehicle";

interface Worker {
  id: string;
  first_name: string;
  phone: string;
  gender: string | null;
  age: number | null;
  state: string | null;
  district: string | null;
  mandal: string | null;
  village: string | null;
  profile_photo_url: string | null;
  skills: string[] | null;
  experience_years: number | null;
  availability: string | null;
  expected_wage: number | null;
  wage_type: string | null;
}

interface Vehicle {
  id: string;
  full_name: string;
  mobile: string;
  vehicle_number: string;
  vehicle_usage_type: string;
  state: string | null;
  district: string | null;
  mandal: string | null;
  village: string | null;
  profile_photo_url: string | null;
  vehicle_image_urls: string[] | null;
}

const SearchServices = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [searchType, setSearchType] = useState<SearchType>("farm_worker");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [mandal, setMandal] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const states = getStates();
  const districts = state ? getDistricts(state) : [];
  const mandals = district ? getMandals(state, district) : [];

  const handleSearch = async (pageNum = 1) => {
    if (!state) return;
    setLoading(true);
    setSearched(true);
    setPage(pageNum);

    try {
      if (searchType === "farm_worker") {
        const params = new URLSearchParams();
        if (state) params.set("state", state);
        if (district) params.set("district", district);
        if (mandal) params.set("skill", ""); // clear
        params.set("page", String(pageNum));
        params.set("limit", "20");

        // Use the edge function
        const { data, error } = await supabase.functions.invoke("farm-workers", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: undefined,
        });

        // Direct query instead for more flexibility
        let query = supabase
          .from("service_applications")
          .select("id, first_name, phone, gender, age, state, district, mandal, village, profile_photo_url, skills, experience_years, availability, expected_wage, wage_type", { count: "exact" })
          .eq("service_type", "farm_maker")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .range((pageNum - 1) * 20, pageNum * 20 - 1);

        if (state) query = query.ilike("state", `%${state}%`);
        if (district) query = query.ilike("district", `%${district}%`);
        if (mandal) query = query.ilike("mandal", `%${mandal}%`);
        if (village) query = query.ilike("village", `%${village}%`);

        const result = await query;
        setWorkers((result.data as Worker[]) || []);
        setTotalResults(result.count || 0);
        setTotalPages(Math.ceil((result.count || 0) / 20));
      } else {
        let query = supabase
          .from("vehicle_registrations")
          .select("id, full_name, mobile, vehicle_number, vehicle_usage_type, state, district, mandal, village, profile_photo_url, vehicle_image_urls", { count: "exact" })
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .range((pageNum - 1) * 20, pageNum * 20 - 1);

        if (state) query = query.ilike("state", `%${state}%`);
        if (district) query = query.ilike("district", `%${district}%`);
        if (mandal) query = query.ilike("mandal", `%${mandal}%`);
        if (village) query = query.ilike("village", `%${village}%`);

        const result = await query;
        setVehicles((result.data as Vehicle[]) || []);
        setTotalResults(result.count || 0);
        setTotalPages(Math.ceil((result.count || 0) / 20));
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setState("");
    setDistrict("");
    setMandal("");
    setVillage("");
    setSearched(false);
    setWorkers([]);
    setVehicles([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-heading font-bold text-lg">Search Services</h1>
        </div>

        {/* Type Toggle */}
        <div className="flex mx-4 mb-3 bg-primary-foreground/20 rounded-xl p-1">
          <button
            onClick={() => { setSearchType("farm_worker"); setSearched(false); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              searchType === "farm_worker" ? "bg-primary-foreground text-primary" : "text-primary-foreground/80"
            }`}
          >
            👨‍🌾 Farm Workers
          </button>
          <button
            onClick={() => { setSearchType("vehicle"); setSearched(false); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              searchType === "vehicle" ? "bg-primary-foreground text-primary" : "text-primary-foreground/80"
            }`}
          >
            🚜 Vehicles
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-card border-b border-border space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Filter by Location</span>
          {searched && (
            <button onClick={resetFilters} className="ml-auto text-xs text-primary font-medium">
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* State */}
          <select
            value={state}
            onChange={(e) => { setState(e.target.value); setDistrict(""); setMandal(""); setVillage(""); }}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground"
          >
            <option value="">Select State</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* District */}
          <select
            value={district}
            onChange={(e) => { setDistrict(e.target.value); setMandal(""); setVillage(""); }}
            disabled={!state}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-50"
          >
            <option value="">Select District</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Mandal */}
          <select
            value={mandal}
            onChange={(e) => { setMandal(e.target.value); setVillage(""); }}
            disabled={!district}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-50"
          >
            <option value="">Select Mandal</option>
            {mandals.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* Village (free text) */}
          <input
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="Village (optional)"
            disabled={!mandal}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-50"
          />
        </div>

        <button
          onClick={() => handleSearch(1)}
          disabled={!state || loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      <div className="p-4 pb-24">
        {searched && !loading && (
          <p className="text-sm text-muted-foreground mb-4">
            {totalResults} {totalResults === 1 ? "result" : "results"} found
            {district && ` in ${district}`}
            {mandal && `, ${mandal}`}
          </p>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-muted-foreground text-sm">Searching...</p>
          </div>
        )}

        {searched && !loading && totalResults === 0 && (
          <div className="text-center py-16">
            <Search size={48} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-semibold mb-1">No results found</p>
            <p className="text-sm text-muted-foreground">
              Try broadening your search with a different location
            </p>
          </div>
        )}

        {!loading && searchType === "farm_worker" && workers.length > 0 && (
          <div className="space-y-3">
            {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
          </div>
        )}

        {!loading && searchType === "vehicle" && vehicles.length > 0 && (
          <div className="space-y-3">
            {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => handleSearch(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handleSearch(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {!searched && (
          <div className="text-center py-16">
            <Search size={48} className="text-primary/20 mx-auto mb-3" />
            <p className="text-foreground font-semibold mb-1">Find Services Near You</p>
            <p className="text-sm text-muted-foreground">
              Select a location above and search for farm workers or vehicles in your area
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchServices;

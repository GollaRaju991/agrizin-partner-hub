import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ServiceRegistrationForm from "@/components/ServiceRegistrationForm";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ServiceApplication = Database["public"]["Tables"]["service_applications"]["Row"];

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get("service") as "rent_vehicle" | "farm_maker" | "agrizin_driver" | null;
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [showForm, setShowForm] = useState(!!serviceType && serviceType !== "farm_maker");

  // Redirect farm_maker and rent_vehicle to dedicated registration pages
  useEffect(() => {
    if (serviceType === "farm_maker" && user) {
      navigate("/register/farm-worker", { replace: true });
    }
    if (serviceType === "rent_vehicle" && user) {
      navigate("/register/vehicle", { replace: true });
    }
  }, [serviceType, user, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("service_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setApplications(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const serviceLabels: Record<string, string> = {
    rent_vehicle: "Rent Vehicle",
    farm_maker: "Farm Maker",
    agrizin_driver: "Agrizin Driver",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Welcome, {profile?.first_name || "Partner"}!
        </h1>
        <p className="text-muted-foreground mb-8">Manage your service applications</p>

        {showForm && serviceType ? (
          <ServiceRegistrationForm
            serviceType={serviceType}
            onComplete={() => {
              setShowForm(false);
              fetchApplications();
            }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            {/* Service selection cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {(["rent_vehicle", "farm_maker", "agrizin_driver"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    navigate(`/dashboard?service=${type}`);
                    setShowForm(true);
                  }}
                  className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-card-hover hover:border-primary/30 transition-all"
                >
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {serviceLabels[type]}
                  </h3>
                  <p className="text-sm text-muted-foreground">Register as a {serviceLabels[type].toLowerCase()} partner</p>
                </button>
              ))}
            </div>

            {/* Existing applications */}
            {applications.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">Your Applications</h2>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-heading font-semibold text-foreground">
                          {serviceLabels[app.service_type]}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {app.first_name} {app.last_name} • {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === "approved" ? "bg-primary/10 text-primary" :
                        app.status === "rejected" ? "bg-destructive/10 text-destructive" :
                        "bg-secondary/10 text-secondary"
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

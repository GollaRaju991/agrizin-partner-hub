import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Bell, Clock, CheckCircle2 } from "lucide-react";
import { useUserApplications } from "@/hooks/useUserApplications";
import rentVehicleImg from "@/assets/rent-vehicle.png";
import farmWorkerImg from "@/assets/farm-worker.png";
import agrizinDriverImg from "@/assets/agrizin-driver.png";

const categories = [
  {
    title: "Farm Worker",
    subtitle: "Find Labor Jobs",
    icon: "👨‍🌾",
    image: farmWorkerImg,
    serviceType: "farm_maker" as const,
    route: "/register/farm-worker",
  },
  {
    title: "Rent Vehicles",
    subtitle: "Hire Cars & Bikes",
    icon: "🚗",
    image: rentVehicleImg,
    serviceType: "rent_vehicle" as const,
    route: "/register/vehicle",
  },
  {
    title: "Agrizin Driver",
    subtitle: "Agricultural Transport",
    icon: "🚚",
    image: agrizinDriverImg,
    serviceType: "agrizin_driver" as const,
    route: "/dashboard",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "completed" || status === "approved") {
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--status-completed))] text-[hsl(var(--status-completed-foreground))]">
        <CheckCircle2 size={12} /> Completed
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--status-pending))] text-[hsl(var(--status-pending-foreground))]">
      <Clock size={12} /> In Progress
    </span>
  );
};

const CategoriesTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStatusForService } = useUserApplications();

  const handleSelect = (cat: (typeof categories)[0]) => {
    if (!user) {
      navigate(`/login?redirect=${cat.route}`);
    } else {
      navigate(cat.route);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="w-8" />
        <h1 className="font-heading font-bold text-lg text-foreground">Categories</h1>
        <button className="p-2">
          <Bell size={20} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {categories.map((cat) => {
          const status = user ? getStatusForService(cat.serviceType) : null;
          return (
            <button
              key={cat.serviceType}
              onClick={() => handleSelect(cat)}
              className="w-full relative h-40 rounded-2xl overflow-hidden group"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
              {/* Status badge */}
              {status && (
                <div className="absolute top-3 right-3 z-10">
                  <StatusBadge status={status} />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <h3 className="font-heading font-bold text-lg text-background">{cat.title}</h3>
                  </div>
                  <p className="text-background/70 text-sm">{cat.subtitle}</p>
                </div>
                <ChevronRight size={24} className="text-background/80" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesTab;

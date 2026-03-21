import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Bell, ArrowLeft } from "lucide-react";
import rentVehicleImg from "@/assets/rent-vehicle.png";
import farmWorkerImg from "@/assets/farm-worker.png";
import agrizinDriverImg from "@/assets/agrizin-driver.png";

const categories = [
  {
    title: "Farm Worker",
    subtitle: "Find Labor Jobs",
    image: farmWorkerImg,
    serviceType: "farm_maker" as const,
    route: "/register/farm-worker",
  },
  {
    title: "Rent Vehicles",
    subtitle: "Hire Cars & Bikes",
    image: rentVehicleImg,
    serviceType: "rent_vehicle" as const,
    route: "/register/vehicle",
  },
  {
    title: "Agrizin Driver",
    subtitle: "Agricultural Transport",
    image: agrizinDriverImg,
    serviceType: "agrizin_driver" as const,
    route: "/dashboard",
  },
];

const CategoriesTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelect = (cat: typeof categories[0]) => {
    if (!user) {
      navigate(`/login?redirect=${cat.route}`);
    } else {
      navigate(cat.route);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="w-8" />
        <h1 className="font-heading font-bold text-lg text-foreground">Categories</h1>
        <button className="p-2">
          <Bell size={20} className="text-foreground" />
        </button>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {categories.map((cat) => (
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
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <div className="text-left">
                <h3 className="font-heading font-bold text-lg text-background">{cat.title}</h3>
                <p className="text-background/70 text-sm">{cat.subtitle}</p>
              </div>
              <ChevronRight size={24} className="text-background/80" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;

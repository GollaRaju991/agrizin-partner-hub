import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { MapPin, Bell } from "lucide-react";

const HomeTab = () => {
  const { user, profile, toggleOnline } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleOnline();
  };

  const isOnline = !!(user && profile?.is_online);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isOnline
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted border-border text-muted-foreground"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-primary" : "bg-muted-foreground"}`} />
            Online
          </button>
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              !isOnline
                ? "bg-muted border-border text-foreground"
                : "border-border text-muted-foreground"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${!isOnline ? "bg-muted-foreground" : "bg-transparent"}`} />
            Offline
          </button>
        </div>
        <button className="relative p-2">
          <Bell size={20} className="text-foreground" />
        </button>
      </div>

      {/* Map placeholder */}
      <div className="flex-1 bg-accent/30 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-accent/20" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <MapPin size={48} className="text-primary" />
          <p className="text-muted-foreground text-sm">Map view coming soon</p>
        </div>

        {/* Go Online button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleToggle}
            className={`w-full py-3.5 rounded-xl font-heading font-bold text-base transition-colors ${
              isOnline
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { MapPin, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const defaultCenter = { lat: 17.385, lng: 78.4867 };

const HomeTab = () => {
  const { user, profile, toggleOnline } = useAuth();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch Google Maps API key
  useEffect(() => {
    supabase.functions.invoke("get-maps-key").then(({ data }) => {
      if (data?.apiKey) setApiKey(data.apiKey);
    });
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  // Load Google Maps script manually to avoid re-initialization issues
  useEffect(() => {
    if (!apiKey || mapLoaded) return;
    if (document.getElementById("google-maps-script")) {
      setMapLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, [apiKey, mapLoaded]);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !window.google) return;
    const mapDiv = document.getElementById("google-map-container");
    if (!mapDiv) return;
    new window.google.maps.Map(mapDiv, {
      center: userLocation,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
    });
  }, [mapLoaded, userLocation]);

  const handleToggle = () => {
    if (!user) { navigate("/login"); return; }
    toggleOnline();
  };

  const isOnline = !!(user && profile?.is_online);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar with toggle */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-primary" : "bg-muted-foreground"}`} />
          <span className="text-sm font-medium text-foreground">
            {isOnline ? "Online" : "Offline"}
          </span>
          <Switch checked={isOnline} onCheckedChange={handleToggle} className="scale-90" />
        </div>
        <button className="relative p-2">
          <Bell size={20} className="text-foreground" />
        </button>
      </div>

      {/* Map area */}
      <div className="flex-1 relative">
        {mapLoaded ? (
          <div id="google-map-container" className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-accent/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <MapPin size={48} className="text-primary" />
              <p className="text-muted-foreground text-sm">Loading map...</p>
            </div>
          </div>
        )}

        {/* Go Online/Offline button */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <button
            onClick={handleToggle}
            className={`w-full py-3.5 rounded-xl font-heading font-bold text-base transition-colors shadow-lg ${
              isOnline ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
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

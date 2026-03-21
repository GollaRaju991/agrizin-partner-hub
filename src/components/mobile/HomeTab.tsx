import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { MapPin, Bell, Globe, X, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const defaultCenter = { lat: 17.385, lng: 78.4867 };

const languageOptions: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
];

const HomeTab = () => {
  const { user, profile, toggleOnline } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    supabase.functions.invoke("get-maps-key").then(({ data }) => {
      if (data?.apiKey) setApiKey(data.apiKey);
    });
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

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

  useEffect(() => {
    if (!mapLoaded || !(window as any).google) return;
    const mapDiv = document.getElementById("google-map-container");
    if (!mapDiv) return;
    new (window as any).google.maps.Map(mapDiv, {
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
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        {/* Online/Offline toggle */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-primary" : "bg-muted-foreground"}`} />
          <span className="text-sm font-medium text-foreground">
            {isOnline ? t("online") : t("offline")}
          </span>
          <Switch checked={isOnline} onCheckedChange={handleToggle} className="scale-90" />
        </div>

        {/* Right side: Language + Notifications */}
        <div className="flex items-center gap-1">
          {/* Language button */}
          <button
            onClick={() => { setShowLangPicker(!showLangPicker); setShowNotifications(false); }}
            className="relative p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Globe size={20} className="text-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold text-primary">
              {language.toUpperCase()}
            </span>
          </button>

          {/* Notification button */}
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowLangPicker(false); }}
            className="relative p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Bell size={20} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Language Picker Dropdown */}
      {showLangPicker && (
        <div className="absolute top-14 right-12 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[180px]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <span className="text-sm font-heading font-bold text-foreground">{t("selectLanguage")}</span>
            <button onClick={() => setShowLangPicker(false)}>
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
          {languageOptions.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id);
                setShowLangPicker(false);
                toast.success(`Language changed to ${lang.label}`);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors ${
                language === lang.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
              {language === lang.id && <span className="ml-auto text-primary">✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-14 right-2 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[220px]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <span className="text-sm font-heading font-bold text-foreground">{t("notifications")}</span>
            <button onClick={() => setShowNotifications(false)}>
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
          <div className="px-4 py-6 text-center">
            <Bell size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
          </div>
        </div>
      )}

      {/* Map area */}
      <div className="flex-1 relative">
        {mapLoaded ? (
          <div id="google-map-container" className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-accent/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <MapPin size={48} className="text-primary" />
              <p className="text-muted-foreground text-sm">{t("loadingMap")}</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3">
          <button
            onClick={() => navigate("/search")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-heading font-bold text-base bg-card text-foreground border border-border shadow-lg transition-colors"
          >
            <Search size={20} /> Find Workers & Vehicles
          </button>
          <button
            onClick={handleToggle}
            className={`w-full py-3.5 rounded-xl font-heading font-bold text-base transition-colors shadow-lg ${
              isOnline ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            {isOnline ? t("goOffline") : t("goOnline")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;

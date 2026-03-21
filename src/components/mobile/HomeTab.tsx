import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { MapPin, Bell, Globe, X } from "lucide-react";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter: [number, number] = [17.385, 78.4867];

const languageOptions: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
];

const HomeTab = () => {
  const { user, profile, toggleOnline } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>(defaultCenter);
  const [mapReady, setMapReady] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: userLocation,
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const markerIcon = L.icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    L.marker(userLocation, { icon: markerIcon }).addTo(map).bindPopup("📍 Your Location");

    mapRef.current = map;
    setMapReady(true);

    // Fix map size after render
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map when location changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(userLocation, 14);
    }
  }, [userLocation]);

  const handleToggle = () => {
    if (!user) { navigate("/login"); return; }
    toggleOnline();
  };

  const isOnline = !!(user && profile?.is_online);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-primary" : "bg-muted-foreground"}`} />
          <span className="text-sm font-medium text-foreground">
            {isOnline ? t("online") : t("offline")}
          </span>
          <Switch checked={isOnline} onCheckedChange={handleToggle} className="scale-90" />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setShowLangPicker(!showLangPicker); setShowNotifications(false); }}
            className="relative p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Globe size={20} className="text-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold text-primary">
              {language.toUpperCase()}
            </span>
          </button>
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
        <div className="absolute top-14 right-12 z-[1000] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[180px]">
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
        <div className="absolute top-14 right-2 z-[1000] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[220px]">
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
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "300px" }} />

        {!mapReady && (
          <div className="absolute inset-0 bg-accent/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <MapPin size={48} className="text-primary" />
              <p className="text-muted-foreground text-sm">{t("loadingMap")}</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <button
            onClick={handleToggle}
            className={`w-full py-3 rounded-xl font-heading font-bold text-sm transition-colors shadow-lg ${
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

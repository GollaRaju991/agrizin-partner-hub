import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { MapPin, Bell, Globe, X } from "lucide-react";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const defaultCenter: [number, number] = [17.385, 78.4867];

const languageOptions: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
];

const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 14);
  }, [position, map]);
  return null;
};

const HomeTab = () => {
  const { user, profile, toggleOnline } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number]>(defaultCenter);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setLocationLoaded(true);
        },
        () => setLocationLoaded(true)
      );
    } else {
      setLocationLoaded(true);
    }
  }, []);

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
        <MapContainer
          center={userLocation}
          zoom={14}
          className="w-full h-full"
          style={{ minHeight: "300px" }}
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLocation}>
            <Popup>📍 {t("loadingMap").replace("...", "") || "Your location"}</Popup>
          </Marker>
          {locationLoaded && <RecenterMap position={userLocation} />}
        </MapContainer>

        <div className="absolute bottom-6 left-6 right-6 z-[1000]">
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

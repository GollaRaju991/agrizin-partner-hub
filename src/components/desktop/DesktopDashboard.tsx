import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useUserApplications } from "@/hooks/useUserApplications";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Home, Grid3X3, Wallet, UserCircle, MapPin, Bell, Globe, X,
  ChevronRight, Edit2, Share2, Settings, HelpCircle, LogOut,
  Clock, CheckCircle2, User, Phone,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import EditProfilePage from "@/components/mobile/EditProfilePage";
import SettingsPage from "@/components/mobile/SettingsPage";
import HelpPage from "@/components/mobile/HelpPage";
import { FarmWorkerDetail, VehicleDetail, DriverDetail } from "@/components/mobile/ApplicationDetailPages";
import rentVehicleImg from "@/assets/rent-vehicle.png";
import farmWorkerImg from "@/assets/farm-worker.png";
import agrizinDriverImg from "@/assets/agrizin-driver.png";

type DesktopTab = "home" | "categories" | "earnings" | "account";

const languageOptions: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
];

const defaultCenter: [number, number] = [17.385, 78.4867];

/* ── Status Badge ── */
const StatusBadge = ({ status, t }: { status: string; t: (k: any) => string }) => {
  const isComplete = status === "completed" || status === "approved";
  return (
    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
      isComplete
        ? "bg-[hsl(var(--status-completed))] text-[hsl(var(--status-completed-foreground))]"
        : "bg-[hsl(var(--status-pending))] text-[hsl(var(--status-pending-foreground))]"
    }`}>
      {isComplete ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {isComplete ? t("completed") : t("inProgress")}
    </span>
  );
};

/* ══════════════════════════════════════════ */
/* Home Panel                                */
/* ══════════════════════════════════════════ */
const HomePanel = () => {
  const { user, profile, toggleOnline } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>(defaultCenter);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, { center: userLocation, zoom: 14, zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; OpenStreetMap' }).addTo(map);
    const markerIcon = L.icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41], iconAnchor: [12, 41],
    });
    L.marker(userLocation, { icon: markerIcon }).addTo(map).bindPopup("📍 Your Location");
    mapRef.current = map;
    setMapReady(true);
    setTimeout(() => map.invalidateSize(), 100);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (mapRef.current) mapRef.current.setView(userLocation, 14);
  }, [userLocation]);

  const handleToggle = async () => {
    if (!user) { navigate("/login"); return; }
    try { await toggleOnline(); }
    catch (e: any) { if (e?.message === "NO_COMPLETED_APP") toast.error(t("completeAppToGoOnline")); }
  };

  const isOnline = !!(user && profile?.is_online);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-primary" : "bg-muted-foreground"}`} />
          <span className="text-sm font-medium text-foreground">{isOnline ? t("online") : t("offline")}</span>
          <Switch checked={isOnline} onCheckedChange={handleToggle} />
        </div>
        <h2 className="font-heading font-bold text-xl text-foreground">{t("home")}</h2>
        <div className="w-24" />
      </div>
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "400px" }} />
        {!mapReady && (
          <div className="absolute inset-0 bg-accent/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <MapPin size={48} className="text-primary" />
              <p className="text-muted-foreground text-sm">{t("loadingMap")}</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-6 left-6 right-6 z-[1000]">
          <button onClick={handleToggle}
            className={`w-full max-w-md mx-auto block py-3 rounded-xl font-heading font-bold text-sm transition-colors shadow-lg ${
              isOnline ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
            }`}>
            {isOnline ? t("goOffline") : t("goOnline")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════ */
/* Categories Panel                          */
/* ══════════════════════════════════════════ */
const CategoriesPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getStatusForService } = useUserApplications();

  const categories = [
    { title: t("farmWorker"), subtitle: t("farmWorkerSub"), icon: "👨‍🌾", image: farmWorkerImg, serviceType: "farm_maker" as const, route: "/register/farm-worker" },
    { title: t("rentVehicle"), subtitle: t("rentVehicleSub"), icon: "🚗", image: rentVehicleImg, serviceType: "rent_vehicle" as const, route: "/register/vehicle" },
    { title: t("agrizinDriver"), subtitle: t("agrizinDriverSub"), icon: "🚚", image: agrizinDriverImg, serviceType: "agrizin_driver" as const, route: "/register/agrizin-driver" },
  ];

  const handleSelect = (cat: (typeof categories)[0]) => {
    const status = user ? getStatusForService(cat.serviceType) : null;
    if (status === "completed" || status === "approved") return;
    navigate(user ? cat.route : `/login?redirect=${cat.route}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 bg-card border-b border-border">
        <h2 className="font-heading font-bold text-xl text-foreground">{t("categories")}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
          {categories.map((cat) => {
            const status = user ? getStatusForService(cat.serviceType) : null;
            return (
              <button key={cat.serviceType} onClick={() => handleSelect(cat)}
                className="relative h-48 rounded-2xl overflow-hidden group text-left">
                <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                {status && <div className="absolute top-3 right-3 z-10"><StatusBadge status={status} t={t} /></div>}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
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
    </div>
  );
};

/* ══════════════════════════════════════════ */
/* Earnings Panel                            */
/* ══════════════════════════════════════════ */
const EarningsPanel = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { applications, vehicleRegs } = useUserApplications();

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t("loginToView")}</p>
          <Button onClick={() => navigate("/login")}>{t("login")}</Button>
        </div>
      </div>
    );
  }

  const hasCompleted = applications.some(a => a.status === "completed" || a.status === "approved") ||
    vehicleRegs.some(v => v.status === "completed" || v.status === "approved");

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 bg-card border-b border-border">
        <h2 className="font-heading font-bold text-xl text-foreground">{t("earnings")}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {!hasCompleted ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <Wallet size={48} className="text-muted-foreground mb-4" />
            <h3 className="font-heading font-bold text-xl text-foreground mb-2">{t("getStartedEarnings")}</h3>
            <p className="text-muted-foreground text-center max-w-md">{t("getStartedEarningsDesc")}</p>
            <Button onClick={() => navigate("/")} className="mt-6">{t("categories")}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-heading font-bold text-base text-foreground mb-3">{t("totalEarnings")}</h3>
              <p className="font-heading font-bold text-4xl text-foreground">₹12,540</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("thisWeek")}</span>
                  <span className="font-semibold text-foreground">₹3,200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("thisMonth")}</span>
                  <span className="font-semibold text-foreground">₹8,750</span>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-heading font-bold text-base text-foreground mb-2">{t("dailyEarnings")}</h3>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("today")}</p>
                  <p className="text-xs text-muted-foreground">12 {t("trips")}</p>
                </div>
                <p className="font-heading font-bold text-4xl text-foreground">₹580</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-heading font-bold text-base text-foreground mb-3">{t("paymentHistory")}</h3>
              <div className="space-y-3">
                {[{ date: "Apr 25", amount: "₹800" }, { date: "Apr 24", amount: "₹1,500" }, { date: "Apr 22", amount: "₹600" }].map((item) => (
                  <div key={item.date} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                    <span className="font-semibold text-foreground">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════ */
/* Account Panel                             */
/* ══════════════════════════════════════════ */
const AccountPanel = () => {
  const { user, profile, signUp, signIn, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { applications, vehicleRegs, loading, refetch } = useUserApplications();
  const navigate = useNavigate();
  const [subPage, setSubPage] = useState<"main" | "editProfile" | "farm" | "vehicle" | "driver" | "settings" | "help">("main");

  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleSendOTP = () => {
    if (!firstName.trim()) { toast.error("Enter your name"); return; }
    if (!phone.trim() || phone.length < 10) { toast.error("Enter valid phone number"); return; }
    setOtpSent(true);
    toast.success("OTP sent! Use code: 1234 (demo)");
  };

  const handleVerify = async () => {
    if (otp !== "1234") { toast.error("Invalid OTP. Use 1234 for demo."); return; }
    setAuthLoading(true);
    try {
      const authEmail = `${phone}@agrizinpartner.in`;
      const authPassword = `agrizin_${phone}_pass`;
      try {
        await signUp(authEmail, authPassword, firstName, phone);
        toast.success("Account created!");
      } catch (e: any) {
        if (e.message?.includes("already registered")) {
          await signIn(authEmail, authPassword);
          toast.success("Logged in!");
        } else throw e;
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally { setAuthLoading(false); }
  };

  const handleSignOut = async () => {
    await signOut();
    setOtpSent(false); setOtp(""); setFirstName(""); setPhone("");
  };

  const farmApp = applications.find((a) => a.service_type === "farm_maker");
  const driverApp = applications.find((a) => a.service_type === "agrizin_driver");
  const vehicleReg = vehicleRegs[0];

  // Sub-pages (reuse mobile components wrapped in desktop container)
  if (user && profile && subPage === "editProfile") {
    return (
      <div className="flex flex-col h-full">
        <div className="max-w-2xl mx-auto w-full flex-1 overflow-y-auto">
          <EditProfilePage onBack={() => setSubPage("main")} />
        </div>
      </div>
    );
  }
  if (user && profile && subPage === "farm") {
    if (farmApp) return <div className="max-w-2xl mx-auto w-full h-full overflow-y-auto"><FarmWorkerDetail app={farmApp} onBack={() => setSubPage("main")} refetch={refetch} /></div>;
    navigate("/register/farm-worker"); setSubPage("main"); return null;
  }
  if (user && profile && subPage === "vehicle") {
    if (vehicleReg) return <div className="max-w-2xl mx-auto w-full h-full overflow-y-auto"><VehicleDetail reg={vehicleReg} onBack={() => setSubPage("main")} refetch={refetch} /></div>;
    navigate("/register/vehicle"); setSubPage("main"); return null;
  }
  if (user && profile && subPage === "driver") {
    if (driverApp) return <div className="max-w-2xl mx-auto w-full h-full overflow-y-auto"><DriverDetail app={driverApp} onBack={() => setSubPage("main")} refetch={refetch} /></div>;
    navigate("/"); setSubPage("main"); return null;
  }
  if (user && profile && subPage === "settings") {
    return <div className="max-w-2xl mx-auto w-full h-full overflow-y-auto"><SettingsPage onBack={() => setSubPage("main")} /></div>;
  }
  if (user && profile && subPage === "help") {
    return <div className="max-w-2xl mx-auto w-full h-full overflow-y-auto"><HelpPage onBack={() => setSubPage("main")} /></div>;
  }

  // Logged-in main account view
  if (user && profile) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 bg-card border-b border-border">
          <h2 className="font-heading font-bold text-xl text-foreground">{t("account")}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl space-y-6">
            {/* Profile Card */}
            <div className="bg-card rounded-2xl border border-border p-6 flex items-center gap-5 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-heading font-bold text-3xl">{profile.first_name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-bold text-xl text-foreground truncate">{profile.first_name}</h2>
                <p className="text-sm text-muted-foreground">+91 {profile.phone}</p>
              </div>
              <button onClick={() => setSubPage("editProfile")} className="p-3 rounded-xl bg-accent hover:bg-accent/70 transition-colors">
                <Edit2 size={18} className="text-accent-foreground" />
              </button>
            </div>

            {/* My Applications */}
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-3">{t("myApplications")}</h3>
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                {loading ? (
                  <div className="p-8 text-center"><p className="text-muted-foreground text-sm">Loading...</p></div>
                ) : (
                  <>
                    <ModuleRow icon="👨‍🌾" title={t("farmWorker")} status={farmApp?.status ?? null} hasData={!!farmApp} onClick={() => setSubPage("farm")} t={t} />
                    <div className="h-px bg-border mx-4" />
                    <ModuleRow icon="🚗" title={t("rentVehicle")} status={vehicleReg?.status ?? null} hasData={!!vehicleReg} onClick={() => setSubPage("vehicle")} t={t} />
                    <div className="h-px bg-border mx-4" />
                    <ModuleRow icon="🚚" title={t("agrizinDriver")} status={driverApp?.status ?? null} hasData={!!driverApp} onClick={() => setSubPage("driver")} t={t} />
                  </>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <SettingsRow icon={Share2} label={t("referPartner")} subtitle={t("referSubtitle")} onClick={() => toast.info(t("comingSoon"))} />
                <div className="h-px bg-border mx-4" />
                <SettingsRow icon={Settings} label={t("settings")} subtitle={t("bankDetailsSub")} onClick={() => setSubPage("settings")} />
                <div className="h-px bg-border mx-4" />
                <SettingsRow icon={HelpCircle} label={t("help")} subtitle={t("registrationGuides")} onClick={() => setSubPage("help")} />
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe size={20} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">{t("language")}</span>
                  </div>
                  <div className="flex gap-2">
                    {languageOptions.map((lang) => (
                      <button key={lang.id} onClick={() => { setLanguage(lang.id); toast.success(`Language changed to ${lang.label}`); }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                          language === lang.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-accent"
                        }`}>
                        {lang.flag} {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-border mx-4" />
                <SettingsRow icon={LogOut} label={t("logout")} danger onClick={handleSignOut} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login view
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 bg-card border-b border-border">
        <h2 className="font-heading font-bold text-xl text-foreground">{t("account")}</h2>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center mb-3">
              <span className="text-primary-foreground font-heading font-bold text-2xl">A</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-foreground">{t("welcomeAgrizin")}</h2>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            {!otpSent ? (
              <>
                <div>
                  <Label className="text-foreground text-sm">{t("name")} *</Label>
                  <div className="relative mt-1">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder={t("enterName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground text-sm">{t("phoneNumber")} *</Label>
                  <div className="relative mt-1">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} type="tel" className="pl-9" />
                  </div>
                </div>
                <Button onClick={handleSendOTP} className="w-full h-12 text-base font-bold rounded-xl">{t("login")}</Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">{t("otpSentTo")} +91 {phone}</p>
                <div>
                  <Label className="text-foreground text-sm">{t("enterOtp")}</Label>
                  <Input placeholder={t("enterOtpPlaceholder")} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} className="mt-1 text-center text-2xl tracking-[0.5em]" maxLength={4} />
                </div>
                <Button onClick={handleVerify} disabled={authLoading} className="w-full h-12 text-base font-bold rounded-xl">
                  {authLoading ? t("verifying") : t("verifyOtp")}
                </Button>
                <button onClick={() => { setOtpSent(false); setOtp(""); }} className="w-full text-sm text-primary hover:underline">{t("changeDetails")}</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Shared sub-components ── */
const ModuleRow = ({ icon, title, status, hasData, onClick, t }: {
  icon: string; title: string; status: string | null; hasData: boolean; onClick: () => void; t: (k: any) => string;
}) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <h4 className="font-heading font-bold text-sm text-foreground">{title}</h4>
    </div>
    <div className="flex items-center gap-2">
      {status && <StatusBadge status={status} t={t} />}
      {!hasData && <span className="text-xs text-muted-foreground">{t("notAdded")}</span>}
      <ChevronRight size={18} className="text-muted-foreground" />
    </div>
  </button>
);

const SettingsRow = ({ icon: Icon, label, subtitle, onClick, danger }: { icon: any; label: string; subtitle?: string; onClick?: () => void; danger?: boolean }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
    <div className="flex items-center gap-3">
      <Icon size={20} className={danger ? "text-destructive" : "text-primary"} />
      <div className="text-left">
        <span className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>{label}</span>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
    {!danger && <ChevronRight size={16} className="text-muted-foreground" />}
  </button>
);

/* ══════════════════════════════════════════ */
/* Main Desktop Dashboard                    */
/* ══════════════════════════════════════════ */
const DesktopDashboard = () => {
  const [activeTab, setActiveTab] = useState<DesktopTab>("home");
  const { t, language, setLanguage } = useLanguage();
  const { user, profile } = useAuth();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs: { id: DesktopTab; icon: any; label: string }[] = [
    { id: "home", icon: Home, label: t("home") },
    { id: "categories", icon: Grid3X3, label: t("categories") },
    { id: "earnings", icon: Wallet, label: t("earnings") },
    { id: "account", icon: UserCircle, label: t("account") },
  ];

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xl">A</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground">
              Agrizin<span className="text-primary">Partner</span>
            </span>
          </a>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}>
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* User info at bottom */}
        {user && profile && (
          <div className="px-4 py-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-heading font-bold text-lg">{profile.first_name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{profile.first_name}</p>
                <p className="text-xs text-muted-foreground">+91 {profile.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-end px-6 py-3 bg-card border-b border-border gap-3">
          {/* Language */}
          <div className="relative">
            <button onClick={() => { setShowLangPicker(!showLangPicker); setShowNotifications(false); }}
              className="flex items-center gap-1.5 border border-border rounded-full px-3 py-1.5 hover:bg-accent transition-colors">
              <Globe size={16} className="text-foreground" />
              <span className="text-sm font-medium text-foreground">{language.toUpperCase()}</span>
            </button>
            {showLangPicker && (
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px] z-50">
                {languageOptions.map((lang) => (
                  <button key={lang.id} onClick={() => { setLanguage(lang.id); setShowLangPicker(false); toast.success(`Language: ${lang.label}`); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                      language === lang.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                    }`}>
                    <span>{lang.flag}</span><span>{lang.label}</span>
                    {language === lang.id && <span className="ml-auto text-primary">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setShowNotifications(!showNotifications); setShowLangPicker(false); }}
              className="p-2 rounded-full hover:bg-accent transition-colors">
              <Bell size={18} className="text-foreground" />
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-lg min-w-[200px] z-50 p-4 text-center">
                <Bell size={28} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "home" && <HomePanel />}
          {activeTab === "categories" && <CategoriesPanel />}
          {activeTab === "earnings" && <EarningsPanel />}
          {activeTab === "account" && <AccountPanel />}
        </div>
      </div>
    </div>
  );
};

export default DesktopDashboard;

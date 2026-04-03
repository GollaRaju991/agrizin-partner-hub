import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserApplications } from "@/hooks/useUserApplications";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import {
  Bell, Phone, User, LogOut, Edit2,
  Clock, CheckCircle2,
  Share2, Globe, ChevronRight, Settings, HelpCircle,
} from "lucide-react";
import SettingsPage from "@/components/mobile/SettingsPage";
import HelpPage from "@/components/mobile/HelpPage";
import EditProfilePage from "@/components/mobile/EditProfilePage";
import { FarmWorkerDetail, VehicleDetail, DriverDetail } from "@/components/mobile/ApplicationDetailPages";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Language } from "@/contexts/LanguageContext";

/* ── Status Badge ── */
const StatusBadgeInner = ({ status, t }: { status: string; t: (k: any) => string }) => {
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

/* ── Module Row (collapsed) ── */
const ModuleRow = ({ icon, title, status, hasData, onClick, t }: {
  icon: string; title: string; status: string | null; hasData: boolean; onClick: () => void; t: (k: any) => string;
}) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <h4 className="font-heading font-bold text-sm text-foreground">{title}</h4>
    </div>
    <div className="flex items-center gap-2">
      {status && <StatusBadgeInner status={status} t={t} />}
      {!hasData && <span className="text-xs text-muted-foreground">{t("notAdded")}</span>}
      <ChevronRight size={18} className="text-muted-foreground" />
    </div>
  </button>
);

/* ── Settings Row ── */
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

/* ════════════════════════════════════════════ */
const languageOptions: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
];

const AccountTab = () => {
  const { user, profile, signUp, signIn, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { applications, vehicleRegs, loading, refetch } = useUserApplications();
  const profilePhotoUrl = useProfilePhoto();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<"farm" | "vehicle" | "driver" | "settings" | "help" | "editProfile" | null>(null);

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

  /* ═══════════ LOGGED-IN: Detail sub-pages ═══════════ */
  if (user && profile && selectedModule === "editProfile") {
    return <EditProfilePage onBack={() => setSelectedModule(null)} />;
  }
  if (user && profile && selectedModule === "farm") {
    if (farmApp) return <FarmWorkerDetail app={farmApp} onBack={() => setSelectedModule(null)} refetch={refetch} />;
    navigate("/register/farm-worker"); setSelectedModule(null); return null;
  }
  if (user && profile && selectedModule === "vehicle") {
    if (vehicleReg) return <VehicleDetail reg={vehicleReg} onBack={() => setSelectedModule(null)} refetch={refetch} />;
    navigate("/register/vehicle"); setSelectedModule(null); return null;
  }
  if (user && profile && selectedModule === "driver") {
    if (driverApp) return <DriverDetail app={driverApp} onBack={() => setSelectedModule(null)} refetch={refetch} />;
    navigate("/"); setSelectedModule(null); return null;
  }
  if (user && profile && selectedModule === "settings") {
    return <SettingsPage onBack={() => setSelectedModule(null)} />;
  }
  if (user && profile && selectedModule === "help") {
    return <HelpPage onBack={() => setSelectedModule(null)} />;
  }

  /* ═══════════ LOGGED-IN: Main Account ═══════════ */
  if (user && profile) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="w-8" />
          <h1 className="font-heading font-bold text-lg text-foreground">{t("account")}</h1>
          <button className="p-2"><Bell size={20} className="text-foreground" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-heading font-bold text-2xl">{profile.first_name?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-lg text-foreground truncate">{profile.first_name}</h2>
              <p className="text-sm text-muted-foreground">+91 {profile.phone}</p>
            </div>
            <button onClick={() => setSelectedModule("editProfile")} className="p-2 rounded-xl bg-accent hover:bg-accent/70 transition-colors">
              <Edit2 size={16} className="text-accent-foreground" />
            </button>
          </div>

          {/* My Applications */}
          <div>
            <h3 className="font-heading font-bold text-base text-foreground mb-3 px-1">{t("myApplications")}</h3>
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-8 text-center"><p className="text-muted-foreground text-sm">Loading...</p></div>
              ) : (
                <>
                  <ModuleRow icon="👨‍🌾" title={t("farmWorker")} status={farmApp?.status ?? null} hasData={!!farmApp} onClick={() => setSelectedModule("farm")} t={t} />
                  <div className="h-px bg-border mx-4" />
                  <ModuleRow icon="🚗" title={t("rentVehicle")} status={vehicleReg?.status ?? null} hasData={!!vehicleReg} onClick={() => setSelectedModule("vehicle")} t={t} />
                  <div className="h-px bg-border mx-4" />
                  <ModuleRow icon="🚚" title={t("agrizinDriver")} status={driverApp?.status ?? null} hasData={!!driverApp} onClick={() => setSelectedModule("driver")} t={t} />
                </>
              )}
            </div>
          </div>

          {/* Referral & Settings & Help */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Referral Card */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Share2 size={20} className="text-primary" />
                <div>
                  <span className="text-sm font-medium text-foreground">{t("referPartner")}</span>
                  <p className="text-xs text-muted-foreground">{t("referSubtitle")} • ₹5 {t("perReferral")}</p>
                </div>
              </div>
              <div className="bg-accent/50 rounded-xl p-3 mt-2">
                <p className="text-xs text-muted-foreground mb-1">{t("yourReferralCode")}</p>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-lg text-foreground tracking-wider flex-1">{profile.phone}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profile.phone);
                      toast.success(t("copiedToClipboard"));
                    }}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  const text = `${t("referralShareText")} ${profile.phone}`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    navigator.clipboard.writeText(text);
                    toast.success(t("copiedToClipboard"));
                  }
                }}
                className="mt-3 w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                <Share2 size={16} /> {t("shareReferral")}
              </button>
            </div>
            <div className="h-px bg-border mx-4" />
            <SettingsRow icon={Settings} label={t("settings")} subtitle={t("bankDetailsSub")} onClick={() => setSelectedModule("settings")} />
            <div className="h-px bg-border mx-4" />
            <SettingsRow icon={HelpCircle} label={t("help")} subtitle={t("registrationGuides")} onClick={() => setSelectedModule("help")} />
          </div>

          {/* Language */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{t("language")}</span>
              </div>
              <div className="flex gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      toast.success(`Language changed to ${lang.label}`);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      language === lang.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:bg-accent"
                    }`}
                  >
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
    );
  }

  /* ═══════════ LOGIN VIEW ═══════════ */
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="w-8" />
        <h1 className="font-heading font-bold text-lg text-foreground">{t("account")}</h1>
        <button className="p-2"><Bell size={20} className="text-foreground" /></button>
      </div>
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 pb-24">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center mb-3">
              <span className="text-primary-foreground font-heading font-bold text-2xl">A</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-foreground">{t("welcomeAgrizin")}</h2>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm">
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

export default AccountTab;

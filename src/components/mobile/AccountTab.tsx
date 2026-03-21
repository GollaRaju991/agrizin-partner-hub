import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserApplications } from "@/hooks/useUserApplications";
import {
  Bell, Phone, User, Truck, LogOut, Edit2,
  Clock, CheckCircle2, MapPin, Briefcase, Calendar, FileText,
  Share2, Settings, Globe, BellRing, ChevronRight, Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ApplicationInfo, VehicleRegInfo } from "@/hooks/useUserApplications";

/* ── Status Badge ── */
const StatusBadge = ({ status }: { status: string }) => {
  const isComplete = status === "completed" || status === "approved";
  return (
    <span
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isComplete
          ? "bg-[hsl(var(--status-completed))] text-[hsl(var(--status-completed-foreground))]"
          : "bg-[hsl(var(--status-pending))] text-[hsl(var(--status-pending-foreground))]"
      }`}
    >
      {isComplete ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {isComplete ? "Completed" : "In Progress"}
    </span>
  );
};

/* ── Status Timeline ── */
const StatusTimeline = ({ status }: { status: string }) => {
  const steps = ["Submitted", "In Progress", "Completed"];
  const isComplete = status === "completed" || status === "approved";
  const activeIdx = isComplete ? 2 : 1;

  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1 flex-1">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              i <= activeIdx
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i < activeIdx ? "✓" : i + 1}
          </div>
          <span className={`text-[10px] ${i <= activeIdx ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {step}
          </span>
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 rounded ${i < activeIdx ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Detail Row ── */
const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null | undefined }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon size={14} className="text-primary mt-0.5 shrink-0" />
      <div>
        <span className="text-muted-foreground">{label}: </span>
        <span className="text-foreground font-medium">{value}</span>
      </div>
    </div>
  );
};

/* ── Empty State for a module ── */
const EmptyModuleState = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <div className="p-5 text-center space-y-3">
    <p className="text-muted-foreground text-sm">You haven't added details yet</p>
    <Button
      onClick={onClick}
      className="rounded-xl h-10 px-5 font-heading font-bold text-sm gap-2"
    >
      <Plus size={14} /> {label}
    </Button>
  </div>
);

/* ── Farm Worker Card Content ── */
const FarmWorkerContent = ({ app, navigate }: { app: ApplicationInfo; navigate: any }) => (
  <>
    <div className="p-4 space-y-2">
      <DetailRow icon={User} label="Name" value={app.first_name} />
      <DetailRow icon={Briefcase} label="Skills" value={app.skills?.join(", ")} />
      <DetailRow icon={Calendar} label="Experience" value={app.experience_years ? `${app.experience_years} years` : null} />
      <DetailRow icon={MapPin} label="Location" value={[app.village, app.mandal, app.district, app.state].filter(Boolean).join(", ")} />
      <DetailRow icon={Clock} label="Availability" value={app.availability} />
      <StatusTimeline status={app.status} />
      <p className="text-[11px] text-muted-foreground mt-2">
        Updated {formatDistanceToNow(new Date(app.updated_at), { addSuffix: true })}
      </p>
    </div>
    <div className="px-4 pb-4">
      <Button variant="outline" onClick={() => navigate("/register/farm-worker")} className="w-full rounded-xl h-9 text-sm font-heading font-bold gap-1">
        <Edit2 size={14} /> Edit Details
      </Button>
    </div>
  </>
);

/* ── Rent Vehicle Card Content ── */
const VehicleContent = ({ reg, navigate }: { reg: VehicleRegInfo; navigate: any }) => (
  <>
    <div className="p-4 space-y-2">
      <DetailRow icon={User} label="Name" value={reg.full_name} />
      <DetailRow icon={Truck} label="Vehicle" value={`${reg.vehicle_usage_type} — ${reg.vehicle_number}`} />
      <DetailRow icon={FileText} label="License" value={reg.driving_license_number} />
      <DetailRow icon={MapPin} label="Location" value={[reg.district, reg.state].filter(Boolean).join(", ")} />
      <StatusTimeline status={reg.status} />
      <p className="text-[11px] text-muted-foreground mt-2">
        Updated {formatDistanceToNow(new Date(reg.updated_at), { addSuffix: true })}
      </p>
    </div>
    <div className="px-4 pb-4">
      <Button variant="outline" onClick={() => navigate("/register/vehicle")} className="w-full rounded-xl h-9 text-sm font-heading font-bold gap-1">
        <Edit2 size={14} /> Edit Details
      </Button>
    </div>
  </>
);

/* ── Driver Card Content ── */
const DriverContent = ({ app, navigate }: { app: ApplicationInfo; navigate: any }) => (
  <>
    <div className="p-4 space-y-2">
      <DetailRow icon={User} label="Name" value={app.first_name} />
      <DetailRow icon={Truck} label="Vehicle" value={[app.vehicle_make, app.vehicle_model].filter(Boolean).join(" ")} />
      <DetailRow icon={FileText} label="Registration" value={app.registration_number} />
      <DetailRow icon={MapPin} label="Location" value={[app.district, app.state].filter(Boolean).join(", ")} />
      <StatusTimeline status={app.status} />
      <p className="text-[11px] text-muted-foreground mt-2">
        Updated {formatDistanceToNow(new Date(app.updated_at), { addSuffix: true })}
      </p>
    </div>
    <div className="px-4 pb-4">
      <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full rounded-xl h-9 text-sm font-heading font-bold gap-1">
        <Edit2 size={14} /> Edit Details
      </Button>
    </div>
  </>
);

/* ── Module Card Wrapper ── */
const ModuleCard = ({
  icon, title, status, children,
}: {
  icon: string; title: string; status: string | null; children: React.ReactNode;
}) => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
    <div className="flex items-center justify-between p-4 border-b border-border bg-accent/30">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h4 className="font-heading font-bold text-sm text-foreground">{title}</h4>
      </div>
      {status && <StatusBadge status={status} />}
    </div>
    {children}
  </div>
);

/* ── Settings Row ── */
const SettingsRow = ({
  icon: Icon, label, subtitle, onClick, danger, trailing,
}: {
  icon: any; label: string; subtitle?: string; onClick?: () => void; danger?: boolean; trailing?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className={danger ? "text-destructive" : "text-primary"} />
      <div className="text-left">
        <span className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>{label}</span>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
    {trailing || <ChevronRight size={16} className="text-muted-foreground" />}
  </button>
);

/* ════════════════════════════════════════════ */
const AccountTab = () => {
  const { user, profile, signUp, signIn, signOut } = useAuth();
  const { applications, vehicleRegs, loading } = useUserApplications();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  /* ── Auth handlers ── */
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
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setOtpSent(false); setOtp(""); setFirstName(""); setPhone("");
  };

  /* ── Lookup helpers ── */
  const farmApp = applications.find((a) => a.service_type === "farm_maker");
  const driverApp = applications.find((a) => a.service_type === "agrizin_driver");
  const vehicleReg = vehicleRegs[0];

  /* ═══════════ LOGGED-IN VIEW ═══════════ */
  if (user && profile) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="w-8" />
          <h1 className="font-heading font-bold text-lg text-foreground">Account</h1>
          <button className="p-2"><Bell size={20} className="text-foreground" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {/* ── Profile Header Card ── */}
          <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {profile.first_name ? (
                <span className="text-primary font-heading font-bold text-2xl">
                  {profile.first_name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={28} className="text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-lg text-foreground truncate">{profile.first_name}</h2>
              <p className="text-sm text-muted-foreground">+91 {profile.phone}</p>
            </div>
            <button
              onClick={() => navigate("/register/farm-worker")}
              className="p-2 rounded-xl bg-accent hover:bg-accent/70 transition-colors"
            >
              <Edit2 size={16} className="text-accent-foreground" />
            </button>
          </div>

          {/* ── My Applications ── */}
          <div>
            <h3 className="font-heading font-bold text-base text-foreground mb-3 px-1">📋 My Applications</h3>

            {loading ? (
              <div className="bg-card rounded-2xl border border-border p-8 flex justify-center">
                <p className="text-muted-foreground text-sm">Loading applications...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Farm Worker */}
                <ModuleCard icon="👨‍🌾" title="Farm Worker" status={farmApp?.status ?? null}>
                  {farmApp ? (
                    <FarmWorkerContent app={farmApp} navigate={navigate} />
                  ) : (
                    <EmptyModuleState label="Add Farm Worker Details" onClick={() => navigate("/register/farm-worker")} />
                  )}
                </ModuleCard>

                {/* Rent Vehicle */}
                <ModuleCard icon="🚗" title="Rent Vehicle" status={vehicleReg?.status ?? null}>
                  {vehicleReg ? (
                    <VehicleContent reg={vehicleReg} navigate={navigate} />
                  ) : (
                    <EmptyModuleState label="Add Rent Vehicle Details" onClick={() => navigate("/register/vehicle")} />
                  )}
                </ModuleCard>

                {/* Agrizin Driver */}
                <ModuleCard icon="🚚" title="Agrizin Driver" status={driverApp?.status ?? null}>
                  {driverApp ? (
                    <DriverContent app={driverApp} navigate={navigate} />
                  ) : (
                    <EmptyModuleState label="Add Agrizin Driver Details" onClick={() => navigate("/dashboard")} />
                  )}
                </ModuleCard>
              </div>
            )}
          </div>

          {/* ── Additional Options ── */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <SettingsRow icon={Share2} label="Refer Agrizin Partner" subtitle="Invite and earn rewards" onClick={() => toast.info("Referral feature coming soon!")} />
            <div className="h-px bg-border mx-4" />
            <SettingsRow icon={Globe} label="App Settings" subtitle="Language, notifications" onClick={() => toast.info("Settings coming soon!")} />
            <div className="h-px bg-border mx-4" />
            <SettingsRow icon={LogOut} label="Logout" danger onClick={handleSignOut} trailing={<span />} />
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
        <h1 className="font-heading font-bold text-lg text-foreground">Account</h1>
        <button className="p-2"><Bell size={20} className="text-foreground" /></button>
      </div>

      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 pb-24">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center mb-3">
              <span className="text-primary-foreground font-heading font-bold text-2xl">A</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-foreground">Welcome to Agrizin</h2>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm">
            {!otpSent ? (
              <>
                <div>
                  <Label className="text-foreground text-sm">Name *</Label>
                  <div className="relative mt-1">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Enter your name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground text-sm">Phone Number *</Label>
                  <div className="relative mt-1">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} type="tel" className="pl-9" />
                  </div>
                </div>
                <Button onClick={handleSendOTP} className="w-full h-12 text-base font-bold rounded-xl">Login</Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">OTP sent to +91 {phone}</p>
                <div>
                  <Label className="text-foreground text-sm">Enter OTP</Label>
                  <Input placeholder="Enter 4-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} className="mt-1 text-center text-2xl tracking-[0.5em]" maxLength={4} />
                </div>
                <Button onClick={handleVerify} disabled={authLoading} className="w-full h-12 text-base font-bold rounded-xl">
                  {authLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <button onClick={() => { setOtpSent(false); setOtp(""); }} className="w-full text-sm text-primary hover:underline">← Change details</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;

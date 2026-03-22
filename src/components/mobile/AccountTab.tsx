import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserApplications } from "@/hooks/useUserApplications";
import {
  Bell, Phone, User, Truck, LogOut, Edit2, Camera, Trash2,
  Clock, CheckCircle2, MapPin, Briefcase, Calendar, FileText,
  Share2, Globe, ChevronRight, Save, X, Settings, HelpCircle,
} from "lucide-react";
import SettingsPage from "@/components/mobile/SettingsPage";
import HelpPage from "@/components/mobile/HelpPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ApplicationInfo, VehicleRegInfo } from "@/hooks/useUserApplications";
import { supabase } from "@/integrations/supabase/client";
import { WORKER_TYPES } from "@/data/workerTypes";
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

/* ── Status Timeline ── */
const StatusTimeline = ({ status, t }: { status: string; t: (k: any) => string }) => {
  const steps = [t("submitted"), t("inProgress"), t("completed")];
  const isComplete = status === "completed" || status === "approved";
  const activeIdx = isComplete ? 2 : 1;
  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1 flex-1">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i <= activeIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {i < activeIdx ? "✓" : i + 1}
          </div>
          <span className={`text-[10px] ${i <= activeIdx ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
          {i < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < activeIdx ? "bg-primary" : "bg-muted"}`} />}
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
      <div><span className="text-muted-foreground">{label}: </span><span className="text-foreground font-medium">{value}</span></div>
    </div>
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

/* ── Detail Page Layout ── */
const DetailPage = ({ title, icon, onBack, children, t }: { title: string; icon: string; onBack: () => void; children: React.ReactNode; t: (k: any) => string }) => (
  <div className="flex flex-col h-full bg-background">
    <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
      <button onClick={onBack} className="text-primary font-heading font-bold text-sm">{t("back")}</button>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-lg">{icon}</span>
        <h1 className="font-heading font-bold text-lg text-foreground">{title}</h1>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">{children}</div>
    </div>
  </div>
);

/* ── Editable Field ── */
const EditField = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div>
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="mt-1 h-9 text-sm" />
  </div>
);

/* ── Farm Worker Detail with Edit ── */
const FarmWorkerDetail = ({ app, onBack, refetch, t }: { app: ApplicationInfo; onBack: () => void; refetch: () => void; t: (k: any) => string }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: app.first_name,
    experience_years: app.experience_years?.toString() || "",
    state: app.state || "",
    district: app.district || "",
    mandal: app.mandal || "",
    village: app.village || "",
    availability: app.availability || "",
    expected_wage: app.expected_wage?.toString() || "",
    wage_type: app.wage_type || "per_day",
    skills: app.skills || [] as string[],
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("service_applications").update({
      first_name: form.first_name,
      experience_years: form.experience_years ? parseInt(form.experience_years) : null,
      state: form.state || null,
      district: form.district || null,
      mandal: form.mandal || null,
      village: form.village || null,
      availability: form.availability || null,
      expected_wage: form.expected_wage ? parseFloat(form.expected_wage) : null,
      wage_type: form.wage_type || null,
      skills: form.skills,
    }).eq("id", app.id);
    setSaving(false);
    if (error) { toast.error(t("updateError")); return; }
    toast.success(t("updateSuccess"));
    setEditing(false);
    refetch();
  };

  const toggleSkill = (skill: string) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill],
    }));
  };

  return (
    <DetailPage title={t("farmWorker")} icon="👨‍🌾" onBack={onBack} t={t}>
      <div className="flex items-center justify-between mb-4">
        <StatusBadgeInner status={app.status} t={t} />
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1 text-xs">
            <Edit2 size={12} /> {t("editDetails")}
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <EditField label={t("nameLabel")} value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} />
          <EditField label={t("experienceYears")} value={form.experience_years} onChange={v => setForm(f => ({ ...f, experience_years: v }))} type="number" />
          <EditField label={t("state")} value={form.state} onChange={v => setForm(f => ({ ...f, state: v }))} />
          <EditField label={t("district")} value={form.district} onChange={v => setForm(f => ({ ...f, district: v }))} />
          <EditField label={t("mandal")} value={form.mandal} onChange={v => setForm(f => ({ ...f, mandal: v }))} />
          <EditField label={t("village")} value={form.village} onChange={v => setForm(f => ({ ...f, village: v }))} />
          <div>
            <Label className="text-xs text-muted-foreground">{t("availability")}</Label>
            <div className="flex gap-2 mt-1">
              {["full-time", "part-time", "seasonal"].map(opt => (
                <button key={opt} onClick={() => setForm(f => ({ ...f, availability: opt }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.availability === opt ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <EditField label={t("expectedWage")} value={form.expected_wage} onChange={v => setForm(f => ({ ...f, expected_wage: v }))} type="number" />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">{t("wageType")}</Label>
              <select value={form.wage_type} onChange={e => setForm(f => ({ ...f, wage_type: e.target.value }))}
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="per_day">{t("perDay")}</option>
                <option value="per_month">{t("perMonth")}</option>
                <option value="per_hour">{t("perHour")}</option>
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t("skills")}</Label>
            <div className="flex flex-wrap gap-1.5 mt-1 max-h-32 overflow-y-auto">
              {WORKER_TYPES.map(skill => (
                <button key={skill} onClick={() => toggleSkill(skill)}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium border transition-colors ${form.skills.includes(skill) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => setEditing(false)} variant="outline" className="flex-1 h-10 text-sm gap-1">
              <X size={14} /> {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 h-10 text-sm gap-1">
              <Save size={14} /> {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <DetailRow icon={User} label={t("nameLabel")} value={app.first_name} />
          <DetailRow icon={Briefcase} label={t("skills")} value={app.skills?.join(", ")} />
          <DetailRow icon={Calendar} label={t("experience")} value={app.experience_years ? `${app.experience_years} ${t("years")}` : null} />
          <DetailRow icon={MapPin} label={t("location")} value={[app.village, app.mandal, app.district, app.state].filter(Boolean).join(", ")} />
          <DetailRow icon={Clock} label={t("availability")} value={app.availability} />
          <StatusTimeline status={app.status} t={t} />
          <p className="text-[11px] text-muted-foreground mt-2">Updated {formatDistanceToNow(new Date(app.updated_at), { addSuffix: true })}</p>
        </div>
      )}
    </DetailPage>
  );
};

/* ── Vehicle Detail with Edit ── */
const VehicleDetail = ({ reg, onBack, refetch, t }: { reg: VehicleRegInfo; onBack: () => void; refetch: () => void; t: (k: any) => string }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: reg.full_name,
    mobile: reg.mobile,
    vehicle_number: reg.vehicle_number,
    vehicle_usage_type: reg.vehicle_usage_type,
    driving_license_number: reg.driving_license_number,
    state: reg.state || "",
    district: reg.district || "",
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("vehicle_registrations").update({
      full_name: form.full_name,
      mobile: form.mobile,
      vehicle_number: form.vehicle_number,
      vehicle_usage_type: form.vehicle_usage_type,
      driving_license_number: form.driving_license_number,
      state: form.state || null,
      district: form.district || null,
    }).eq("id", reg.id);
    setSaving(false);
    if (error) { toast.error(t("updateError")); return; }
    toast.success(t("updateSuccess"));
    setEditing(false);
    refetch();
  };

  return (
    <DetailPage title={t("rentVehicle")} icon="🚗" onBack={onBack} t={t}>
      <div className="flex items-center justify-between mb-4">
        <StatusBadgeInner status={reg.status} t={t} />
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1 text-xs">
            <Edit2 size={12} /> {t("editDetails")}
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <EditField label={t("fullName")} value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))} />
          <EditField label={t("mobile")} value={form.mobile} onChange={v => setForm(f => ({ ...f, mobile: v }))} />
          <EditField label={t("vehicleNumber")} value={form.vehicle_number} onChange={v => setForm(f => ({ ...f, vehicle_number: v }))} />
          <EditField label={t("drivingLicense")} value={form.driving_license_number} onChange={v => setForm(f => ({ ...f, driving_license_number: v }))} />
          <div>
            <Label className="text-xs text-muted-foreground">{t("vehicleUsageType")}</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["Farm Work", "Loading", "Transport", "Other"].map(opt => (
                <button key={opt} onClick={() => setForm(f => ({ ...f, vehicle_usage_type: opt }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.vehicle_usage_type === opt ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <EditField label={t("state")} value={form.state} onChange={v => setForm(f => ({ ...f, state: v }))} />
          <EditField label={t("district")} value={form.district} onChange={v => setForm(f => ({ ...f, district: v }))} />
          <div className="flex gap-2 pt-2">
            <Button onClick={() => setEditing(false)} variant="outline" className="flex-1 h-10 text-sm gap-1">
              <X size={14} /> {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 h-10 text-sm gap-1">
              <Save size={14} /> {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <DetailRow icon={User} label={t("nameLabel")} value={reg.full_name} />
          <DetailRow icon={Truck} label={t("vehicle")} value={`${reg.vehicle_usage_type} — ${reg.vehicle_number}`} />
          <DetailRow icon={FileText} label={t("license")} value={reg.driving_license_number} />
          <DetailRow icon={MapPin} label={t("location")} value={[reg.district, reg.state].filter(Boolean).join(", ")} />
          <StatusTimeline status={reg.status} t={t} />
          <p className="text-[11px] text-muted-foreground mt-2">Updated {formatDistanceToNow(new Date(reg.updated_at), { addSuffix: true })}</p>
        </div>
      )}
    </DetailPage>
  );
};

/* ── Driver Detail with Edit ── */
const DriverDetail = ({ app, onBack, refetch, t }: { app: ApplicationInfo; onBack: () => void; refetch: () => void; t: (k: any) => string }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: app.first_name,
    vehicle_make: app.vehicle_make || "",
    vehicle_model: app.vehicle_model || "",
    registration_number: app.registration_number || "",
    state: app.state || "",
    district: app.district || "",
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("service_applications").update({
      first_name: form.first_name,
      vehicle_make: form.vehicle_make || null,
      vehicle_model: form.vehicle_model || null,
      registration_number: form.registration_number || null,
      state: form.state || null,
      district: form.district || null,
    }).eq("id", app.id);
    setSaving(false);
    if (error) { toast.error(t("updateError")); return; }
    toast.success(t("updateSuccess"));
    setEditing(false);
    refetch();
  };

  return (
    <DetailPage title={t("agrizinDriver")} icon="🚚" onBack={onBack} t={t}>
      <div className="flex items-center justify-between mb-4">
        <StatusBadgeInner status={app.status} t={t} />
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1 text-xs">
            <Edit2 size={12} /> {t("editDetails")}
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <EditField label={t("nameLabel")} value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} />
          <EditField label={t("vehicleMake")} value={form.vehicle_make} onChange={v => setForm(f => ({ ...f, vehicle_make: v }))} />
          <EditField label={t("vehicleModel")} value={form.vehicle_model} onChange={v => setForm(f => ({ ...f, vehicle_model: v }))} />
          <EditField label={t("registrationNo")} value={form.registration_number} onChange={v => setForm(f => ({ ...f, registration_number: v }))} />
          <EditField label={t("state")} value={form.state} onChange={v => setForm(f => ({ ...f, state: v }))} />
          <EditField label={t("district")} value={form.district} onChange={v => setForm(f => ({ ...f, district: v }))} />
          <div className="flex gap-2 pt-2">
            <Button onClick={() => setEditing(false)} variant="outline" className="flex-1 h-10 text-sm gap-1">
              <X size={14} /> {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 h-10 text-sm gap-1">
              <Save size={14} /> {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <DetailRow icon={User} label={t("nameLabel")} value={app.first_name} />
          <DetailRow icon={Truck} label={t("vehicle")} value={[app.vehicle_make, app.vehicle_model].filter(Boolean).join(" ")} />
          <DetailRow icon={FileText} label={t("registration")} value={app.registration_number} />
          <DetailRow icon={MapPin} label={t("location")} value={[app.district, app.state].filter(Boolean).join(", ")} />
          <StatusTimeline status={app.status} t={t} />
          <p className="text-[11px] text-muted-foreground mt-2">Updated {formatDistanceToNow(new Date(app.updated_at), { addSuffix: true })}</p>
        </div>
      )}
    </DetailPage>
  );
};

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
  const { user, profile, signUp, signIn, signOut, refreshProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { applications, vehicleRegs, loading, refetch } = useUserApplications();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<"farm" | "vehicle" | "driver" | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEditProfile = () => {
    setEditName(profile?.first_name || "");
    setProfilePhotoUrl(null);
    setEditingProfile(true);
  };

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `profile-photos/${user.id}.${ext}`;
    const { error } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true });
    if (error) { toast.error("Failed to upload photo"); return; }
    const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
    setProfilePhotoUrl(urlData.publicUrl + "?t=" + Date.now());
    toast.success("Photo uploaded!");
  };

  const handleDeletePhoto = () => {
    setProfilePhotoUrl("REMOVE");
    toast.info("Photo will be removed on save");
  };

  const handleSaveProfile = async () => {
    if (!user || !editName.trim()) { toast.error("Name cannot be empty"); return; }
    setSavingProfile(true);
    const updateData: Record<string, string> = { first_name: editName.trim() };
    const { error } = await supabase.from("profiles").update(updateData).eq("user_id", user.id);
    setSavingProfile(false);
    if (error) { toast.error(t("updateError")); return; }
    toast.success(t("updateSuccess"));
    setEditingProfile(false);
    await refreshProfile();
  };

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
  if (user && profile && selectedModule === "farm") {
    if (farmApp) return <FarmWorkerDetail app={farmApp} onBack={() => setSelectedModule(null)} refetch={refetch} t={t} />;
    navigate("/register/farm-worker"); setSelectedModule(null); return null;
  }
  if (user && profile && selectedModule === "vehicle") {
    if (vehicleReg) return <VehicleDetail reg={vehicleReg} onBack={() => setSelectedModule(null)} refetch={refetch} t={t} />;
    navigate("/register/vehicle"); setSelectedModule(null); return null;
  }
  if (user && profile && selectedModule === "driver") {
    if (driverApp) return <DriverDetail app={driverApp} onBack={() => setSelectedModule(null)} refetch={refetch} t={t} />;
    navigate("/dashboard"); setSelectedModule(null); return null;
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
          {/* Profile */}
          {editingProfile ? (
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {profilePhotoUrl && profilePhotoUrl !== "REMOVE" ? (
                      <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary font-heading font-bold text-2xl">{editName?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow">
                    <Camera size={14} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoChange} />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("name")}</Label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9 text-sm mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("phoneNumber")}</Label>
                    <p className="text-sm text-muted-foreground mt-1">+91 {profile.phone}</p>
                  </div>
                </div>
              </div>
              {profilePhotoUrl && profilePhotoUrl !== "REMOVE" && (
                <button onClick={handleDeletePhoto} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                  <Trash2 size={12} /> Remove photo
                </button>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setEditingProfile(false)} variant="outline" className="flex-1 h-10 text-sm gap-1">
                  <X size={14} /> {t("cancel")}
                </Button>
                <Button onClick={handleSaveProfile} disabled={savingProfile} className="flex-1 h-10 text-sm gap-1">
                  <Save size={14} /> {savingProfile ? t("saving") : t("save")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-heading font-bold text-2xl">{profile.first_name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-bold text-lg text-foreground truncate">{profile.first_name}</h2>
                <p className="text-sm text-muted-foreground">+91 {profile.phone}</p>
              </div>
              <button onClick={startEditProfile} className="p-2 rounded-xl bg-accent hover:bg-accent/70 transition-colors">
                <Edit2 size={16} className="text-accent-foreground" />
              </button>
            </div>
          )}

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

          {/* Settings */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <SettingsRow icon={Share2} label={t("referPartner")} subtitle={t("referSubtitle")} onClick={() => toast.info(t("comingSoon"))} />
            <div className="h-px bg-border mx-4" />
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

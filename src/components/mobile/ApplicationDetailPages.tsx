import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  User, Phone, MapPin, Briefcase, Calendar, Clock, Save, X, Edit2,
  CheckCircle2, ArrowLeft, ChevronRight, FileText, Truck, Banknote,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationInfo, VehicleRegInfo } from "@/hooks/useUserApplications";
import { WORKER_TYPES } from "@/data/workerTypes";
import { formatDistanceToNow } from "date-fns";

/* ── Shared components ── */
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

const ReadOnlyField = ({ label, value, icon: Icon }: { label: string; value: string | null | undefined; icon?: any }) => (
  <div>
    <Label className="text-xs text-muted-foreground flex items-center gap-1">
      {Icon && <Icon size={12} />} {label}
    </Label>
    <div className="mt-1 h-10 rounded-lg border border-border bg-muted/50 flex items-center px-3 text-sm text-muted-foreground">
      {value || "—"}
    </div>
  </div>
);

const EditField = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div>
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="mt-1 h-9 text-sm" />
  </div>
);

const DetailPageLayout = ({ title, icon, onBack, children }: { title: string; icon: string; onBack: () => void; children: React.ReactNode }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
        <button onClick={onBack} className="text-primary font-heading font-bold text-sm flex items-center gap-1">
          <ArrowLeft size={16} /> {t("back")}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{icon}</span>
          <h1 className="font-heading font-bold text-lg text-foreground">{title}</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">{children}</div>
    </div>
  );
};

const SectionTab = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
    }`}
  >
    {label}
  </button>
);

/* ════════════════════════════════════════ */
/* Farm Worker Detail                      */
/* ════════════════════════════════════════ */
export const FarmWorkerDetail = ({ app, onBack, refetch }: { app: ApplicationInfo; onBack: () => void; refetch: () => void }) => {
  const { t } = useLanguage();
  const [page, setPage] = useState<1 | 2>(1);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    skills: app.skills || [] as string[],
    experience_years: app.experience_years?.toString() || "",
    availability: app.availability || "",
    expected_wage: app.expected_wage?.toString() || "",
    wage_type: app.wage_type || "per_day",
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("service_applications").update({
      skills: form.skills,
      experience_years: form.experience_years ? parseInt(form.experience_years) : null,
      availability: form.availability || null,
      expected_wage: form.expected_wage ? parseFloat(form.expected_wage) : null,
      wage_type: form.wage_type || null,
    }).eq("id", app.id);
    setSaving(false);
    if (error) { toast.error(t("updateError")); return; }
    toast.success("Details updated successfully.");
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
    <DetailPageLayout title={t("farmWorker")} icon="👨‍🌾" onBack={onBack}>
      <StatusBadge status={app.status} t={t} />
      <StatusTimeline status={app.status} t={t} />

      {/* Page tabs */}
      <div className="flex gap-2">
        <SectionTab active={page === 1} label="Personal Details" onClick={() => setPage(1)} />
        <SectionTab active={page === 2} label="Farm Worker Details" onClick={() => setPage(2)} />
      </div>

      {page === 1 ? (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
            <User size={14} className="text-primary" /> Personal Details
            <span className="text-[10px] text-muted-foreground ml-auto">Read Only</span>
          </h3>
          <ReadOnlyField label="Name" value={app.first_name} icon={User} />
          <ReadOnlyField label="Phone" value={app.phone} icon={Phone} />
          <ReadOnlyField label="Gender" value={app.gender} />
          <ReadOnlyField label="Age" value={app.age?.toString()} />
          <ReadOnlyField label="State" value={app.state} icon={MapPin} />
          <ReadOnlyField label="District" value={app.district} />
          <ReadOnlyField label="Mandal" value={app.mandal} />
          <ReadOnlyField label="Village" value={app.village} />
          <p className="text-[11px] text-muted-foreground mt-2">
            Updated {formatDistanceToNow(new Date(app.updated_at), { addSuffix: true })}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Briefcase size={14} className="text-primary" /> Farm Worker Details
            </h3>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1 text-xs">
                <Edit2 size={12} /> {t("editDetails")}
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
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
              <EditField label={t("experienceYears")} value={form.experience_years} onChange={v => setForm(f => ({ ...f, experience_years: v }))} type="number" />
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
              <ReadOnlyField label="Skills" value={app.skills?.join(", ")} icon={Briefcase} />
              <ReadOnlyField label="Experience" value={app.experience_years ? `${app.experience_years} years` : null} icon={Calendar} />
              <ReadOnlyField label="Availability" value={app.availability} icon={Clock} />
              <ReadOnlyField label="Expected Wage" value={app.expected_wage ? `₹${app.expected_wage} / ${app.wage_type?.replace("per_", "")}` : null} icon={Banknote} />
            </div>
          )}
        </div>
      )}
    </DetailPageLayout>
  );
};

/* ════════════════════════════════════════ */
/* Vehicle Detail                          */
/* ════════════════════════════════════════ */
export const VehicleDetail = ({ reg, onBack, refetch }: { reg: VehicleRegInfo; onBack: () => void; refetch: () => void }) => {
  const { t } = useLanguage();
  const [page, setPage] = useState<1 | 2>(1);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    vehicle_number: reg.vehicle_number,
    vehicle_usage_type: reg.vehicle_usage_type,
    driving_license_number: reg.driving_license_number,
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("vehicle_registrations").update({
      vehicle_number: form.vehicle_number,
      vehicle_usage_type: form.vehicle_usage_type,
      driving_license_number: form.driving_license_number,
    }).eq("id", reg.id);
    setSaving(false);
    if (error) { toast.error(t("updateError")); return; }
    toast.success("Details updated successfully.");
    setEditing(false);
    refetch();
  };

  return (
    <DetailPageLayout title={t("rentVehicle")} icon="🚗" onBack={onBack}>
      <StatusBadge status={reg.status} t={t} />
      <StatusTimeline status={reg.status} t={t} />

      <div className="flex gap-2">
        <SectionTab active={page === 1} label="Personal Details" onClick={() => setPage(1)} />
        <SectionTab active={page === 2} label="Vehicle Details" onClick={() => setPage(2)} />
      </div>

      {page === 1 ? (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
            <User size={14} className="text-primary" /> Personal Details
            <span className="text-[10px] text-muted-foreground ml-auto">Read Only</span>
          </h3>
          <ReadOnlyField label="Full Name" value={reg.full_name} icon={User} />
          <ReadOnlyField label="Mobile" value={reg.mobile} icon={Phone} />
          <ReadOnlyField label="State" value={reg.state} icon={MapPin} />
          <ReadOnlyField label="District" value={reg.district} />
          <p className="text-[11px] text-muted-foreground mt-2">
            Updated {formatDistanceToNow(new Date(reg.updated_at), { addSuffix: true })}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Truck size={14} className="text-primary" /> Vehicle Details
            </h3>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1 text-xs">
                <Edit2 size={12} /> {t("editDetails")}
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
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
              <ReadOnlyField label="Vehicle Number" value={reg.vehicle_number} icon={Truck} />
              <ReadOnlyField label="Usage Type" value={reg.vehicle_usage_type} />
              <ReadOnlyField label="Driving License" value={reg.driving_license_number} icon={FileText} />
            </div>
          )}
        </div>
      )}
    </DetailPageLayout>
  );
};

/* ════════════════════════════════════════ */
/* Agrizin Driver Detail                   */
/* ════════════════════════════════════════ */
export const DriverDetail = ({ app, onBack, refetch }: { app: ApplicationInfo; onBack: () => void; refetch: () => void }) => {
  const { t } = useLanguage();
  const [page, setPage] = useState<1 | 2>(1);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    vehicle_make: app.vehicle_make || "",
    vehicle_model: app.vehicle_model || "",
    registration_number: app.registration_number || "",
    vehicle_type: app.vehicle_type || "",
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("service_applications").update({
      vehicle_make: form.vehicle_make || null,
      vehicle_model: form.vehicle_model || null,
      registration_number: form.registration_number || null,
      vehicle_type: form.vehicle_type || null,
    }).eq("id", app.id);
    setSaving(false);
    if (error) { toast.error(t("updateError")); return; }
    toast.success("Details updated successfully.");
    setEditing(false);
    refetch();
  };

  return (
    <DetailPageLayout title={t("agrizinDriver")} icon="🚚" onBack={onBack}>
      <StatusBadge status={app.status} t={t} />
      <StatusTimeline status={app.status} t={t} />

      <div className="flex gap-2">
        <SectionTab active={page === 1} label="Personal Details" onClick={() => setPage(1)} />
        <SectionTab active={page === 2} label="Driver Details" onClick={() => setPage(2)} />
      </div>

      {page === 1 ? (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
            <User size={14} className="text-primary" /> Personal Details
            <span className="text-[10px] text-muted-foreground ml-auto">Read Only</span>
          </h3>
          <ReadOnlyField label="Name" value={app.first_name} icon={User} />
          <ReadOnlyField label="Phone" value={app.phone} icon={Phone} />
          <ReadOnlyField label="Gender" value={app.gender} />
          <ReadOnlyField label="Age" value={app.age?.toString()} />
          <ReadOnlyField label="State" value={app.state} icon={MapPin} />
          <ReadOnlyField label="District" value={app.district} />
          <p className="text-[11px] text-muted-foreground mt-2">
            Updated {formatDistanceToNow(new Date(app.updated_at), { addSuffix: true })}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Truck size={14} className="text-primary" /> Driver Details
            </h3>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1 text-xs">
                <Edit2 size={12} /> {t("editDetails")}
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <EditField label={t("vehicleMake")} value={form.vehicle_make} onChange={v => setForm(f => ({ ...f, vehicle_make: v }))} />
              <EditField label={t("vehicleModel")} value={form.vehicle_model} onChange={v => setForm(f => ({ ...f, vehicle_model: v }))} />
              <EditField label={t("registrationNo")} value={form.registration_number} onChange={v => setForm(f => ({ ...f, registration_number: v }))} />
              <EditField label="Vehicle Type" value={form.vehicle_type} onChange={v => setForm(f => ({ ...f, vehicle_type: v }))} />
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
              <ReadOnlyField label="Vehicle Make" value={app.vehicle_make} icon={Truck} />
              <ReadOnlyField label="Vehicle Model" value={app.vehicle_model} />
              <ReadOnlyField label="Registration No." value={app.registration_number} icon={FileText} />
              <ReadOnlyField label="Vehicle Type" value={app.vehicle_type} />
            </div>
          )}
        </div>
      )}
    </DetailPageLayout>
  );
};

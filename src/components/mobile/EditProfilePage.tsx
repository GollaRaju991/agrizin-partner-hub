import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Phone, Camera, MapPin, Calendar, X, Save, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStates, getDistricts, getMandals } from "@/data/indianLocations";
import { useRef } from "react";

interface EditProfilePageProps {
  onBack: () => void;
  profileExtra?: {
    gender?: string | null;
    date_of_birth?: string | null;
    state?: string | null;
    district?: string | null;
    mandal?: string | null;
    village?: string | null;
  };
}

const EditProfilePage = ({ onBack, profileExtra }: EditProfilePageProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    first_name: profile?.first_name || "",
    gender: profileExtra?.gender || "",
    date_of_birth: profileExtra?.date_of_birth || "",
    state: profileExtra?.state || "",
    district: profileExtra?.district || "",
    mandal: profileExtra?.mandal || "",
    village: profileExtra?.village || "",
  });

  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const states = getStates();
  const districts = form.state ? getDistricts(form.state) : [];
  const mandals = form.state && form.district ? getMandals(form.state, form.district) : [];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10 MB"); return; }
    const ext = file.name.split(".").pop();
    const path = `profile-photos/${user.id}.${ext}`;
    const { error } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true });
    if (error) { toast.error("Failed to upload photo"); return; }
    const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
    setProfilePhotoUrl(urlData.publicUrl + "?t=" + Date.now());
    toast.success("Photo uploaded!");
  };

  const handleSave = async () => {
    if (!user || !form.first_name.trim()) { toast.error("Name cannot be empty"); return; }
    if (form.date_of_birth) {
      const dob = new Date(form.date_of_birth);
      if (isNaN(dob.getTime())) { toast.error("Invalid date of birth"); return; }
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      first_name: form.first_name.trim(),
      gender: form.gender || null,
      date_of_birth: form.date_of_birth || null,
      state: form.state || null,
      district: form.district || null,
      mandal: form.mandal || null,
      village: form.village || null,
    } as any).eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error(t("updateError")); return; }
    toast.success(t("updateSuccess"));
    await refreshProfile();
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
        <button onClick={onBack} className="text-primary font-heading font-bold text-sm flex items-center gap-1">
          <ArrowLeft size={16} /> {t("back")}
        </button>
        <h1 className="font-heading font-bold text-lg text-foreground flex-1 text-center pr-8">Edit Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {/* Profile Photo */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-heading font-bold text-3xl">
                  {form.first_name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow"
            >
              <Camera size={16} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <p className="text-xs text-muted-foreground">Tap to change profile picture</p>
        </div>

        {/* Editable Fields */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
            <User size={16} className="text-primary" /> Personal Details
          </h3>

          {/* Name */}
          <div>
            <Label className="text-xs text-muted-foreground">{t("nameLabel")} *</Label>
            <Input
              value={form.first_name}
              onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))}
              className="mt-1 h-10 rounded-lg"
              placeholder="Enter your name"
            />
          </div>

          {/* Gender */}
          <div>
            <Label className="text-xs text-muted-foreground">Gender</Label>
            <div className="flex gap-2 mt-1">
              {["Male", "Female", "Others"].map(g => (
                <button
                  key={g}
                  onClick={() => setForm(f => ({ ...f, gender: g.toLowerCase() }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    form.gender === g.toLowerCase()
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={12} /> Date of Birth
            </Label>
            <Input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
              className="mt-1 h-10 rounded-lg"
            />
          </div>
        </div>

        {/* Read-Only Fields */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
          <h3 className="font-heading font-semibold text-sm text-muted-foreground">Read-Only Information</h3>

          <div>
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone size={12} /> Mobile Number
            </Label>
            <div className="mt-1 h-10 rounded-lg border border-border bg-muted/50 flex items-center px-3 text-sm text-muted-foreground">
              +91 {profile?.phone || "—"}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Aadhaar Card Number</Label>
            <div className="mt-1 h-10 rounded-lg border border-border bg-muted/50 flex items-center px-3 text-sm text-muted-foreground">
              Not available
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">PAN Card Number</Label>
            <div className="mt-1 h-10 rounded-lg border border-border bg-muted/50 flex items-center px-3 text-sm text-muted-foreground">
              Not available
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
            <MapPin size={16} className="text-primary" /> Address Details
          </h3>

          <Select value={form.state} onValueChange={(v) => setForm(f => ({ ...f, state: v, district: "", mandal: "" }))}>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={form.district} onValueChange={(v) => setForm(f => ({ ...f, district: v, mandal: "" }))} disabled={!form.state}>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={form.mandal} onValueChange={(v) => setForm(f => ({ ...f, mandal: v }))} disabled={!form.district}>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="Select Mandal" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {mandals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>

          <Input
            placeholder="Village"
            value={form.village}
            onChange={(e) => setForm(f => ({ ...f, village: e.target.value }))}
            className="h-10 rounded-lg"
          />
        </div>

        {/* Save Button */}
        <div className="flex gap-2 pt-2">
          <Button onClick={onBack} variant="outline" className="flex-1 h-11 text-sm gap-1 rounded-xl">
            <X size={14} /> {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 h-11 text-sm gap-1 rounded-xl">
            <Save size={14} /> {saving ? t("saving") : "Save / Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;

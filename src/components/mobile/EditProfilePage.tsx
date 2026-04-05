import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Phone, ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditProfilePageProps {
  onBack: () => void;
  profileExtra?: Record<string, unknown>;
}

const EditProfilePage = ({ onBack }: EditProfilePageProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.first_name || "");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    if (!user || !name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      first_name: name.trim(),
    }).eq("user_id", user.id);
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
                  {name?.charAt(0).toUpperCase() || "U"}
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

        {/* Name & Phone */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">{t("nameLabel")} *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-10 rounded-lg"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone size={12} /> Mobile Number
            </Label>
            <div className="mt-1 h-10 rounded-lg border border-border bg-muted/50 flex items-center px-3 text-sm text-muted-foreground">
              +91 {profile?.phone || "—"}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving} className="w-full h-11 text-sm gap-1 rounded-xl">
          <Save size={14} /> {saving ? t("saving") : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditProfilePage;

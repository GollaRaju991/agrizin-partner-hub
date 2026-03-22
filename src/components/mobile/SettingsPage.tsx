import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ChevronLeft, Building2, Phone, Save, CreditCard, AlertCircle, CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SettingsPage = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"menu" | "bank" | "emergency">("menu");

  if (activeSection === "bank") return <BankDetailsForm onBack={() => setActiveSection("menu")} />;
  if (activeSection === "emergency") return <EmergencyContactForm onBack={() => setActiveSection("menu")} />;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
        <button onClick={onBack} className="text-primary font-heading font-bold text-sm">{t("back")}</button>
        <h1 className="font-heading font-bold text-lg text-foreground">⚙️ {t("settings")}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
        <button
          onClick={() => setActiveSection("bank")}
          className="w-full bg-card rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm hover:bg-accent/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 size={20} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-bold text-foreground">{t("addBankDetails")}</h3>
            <p className="text-xs text-muted-foreground">{t("bankDetailsSub")}</p>
          </div>
          <ChevronLeft size={16} className="text-muted-foreground rotate-180" />
        </button>

        <button
          onClick={() => setActiveSection("emergency")}
          className="w-full bg-card rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm hover:bg-accent/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle size={20} className="text-destructive" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-bold text-foreground">{t("emergencyContact")}</h3>
            <p className="text-xs text-muted-foreground">{t("emergencyContactSub")}</p>
          </div>
          <ChevronLeft size={16} className="text-muted-foreground rotate-180" />
        </button>
      </div>
    </div>
  );
};

/* ── Bank Details Form ── */
const BankDetailsForm = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
  });

  const handleSave = async () => {
    if (!form.accountHolderName.trim() || !form.bankName.trim() || !form.accountNumber.trim() || !form.ifscCode.trim()) {
      toast.error(t("fillAllFields"));
      return;
    }
    setSaving(true);
    // Store in localStorage for now (can be migrated to DB later)
    localStorage.setItem("agrizin_bank_details", JSON.stringify(form));
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    toast.success(t("bankDetailsSaved"));
  };

  // Load saved data on mount
  useState(() => {
    const saved = localStorage.getItem("agrizin_bank_details");
    if (saved) {
      try { setForm(JSON.parse(saved)); } catch {}
    }
  });

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
        <button onClick={onBack} className="text-primary font-heading font-bold text-sm">{t("back")}</button>
        <h1 className="font-heading font-bold text-lg text-foreground">🏦 {t("addBankDetails")}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">{t("accountHolderName")}</Label>
            <Input value={form.accountHolderName} onChange={e => setForm(f => ({ ...f, accountHolderName: e.target.value }))} className="mt-1 h-10" placeholder={t("accountHolderName")} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t("bankName")}</Label>
            <Input value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} className="mt-1 h-10" placeholder={t("bankName")} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t("accountNumber")}</Label>
            <Input value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, "") }))} className="mt-1 h-10" placeholder={t("accountNumber")} type="tel" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t("ifscCode")}</Label>
            <Input value={form.ifscCode} onChange={e => setForm(f => ({ ...f, ifscCode: e.target.value.toUpperCase() }))} className="mt-1 h-10" placeholder="e.g. SBIN0001234" maxLength={11} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t("branchName")}</Label>
            <Input value={form.branchName} onChange={e => setForm(f => ({ ...f, branchName: e.target.value }))} className="mt-1 h-10" placeholder={t("branchName")} />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-base font-bold rounded-xl gap-2">
            <Save size={16} /> {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ── Emergency Contact Form ── */
const EmergencyContactForm = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [contactNumber, setContactNumber] = useState("");

  // Load saved data on mount
  useState(() => {
    const saved = localStorage.getItem("agrizin_emergency_contact");
    if (saved) setContactNumber(saved);
  });

  const handleSave = async () => {
    if (!contactNumber.trim() || contactNumber.length !== 10) {
      toast.error(t("enterValid10Digit"));
      return;
    }
    setSaving(true);
    localStorage.setItem("agrizin_emergency_contact", contactNumber);
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    toast.success(t("emergencyContactSaved"));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
        <button onClick={onBack} className="text-primary font-heading font-bold text-sm">{t("back")}</button>
        <h1 className="font-heading font-bold text-lg text-foreground">🆘 {t("emergencyContact")}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">{t("contactNumber")}</Label>
            <div className="relative mt-1">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="h-10 pl-9"
                placeholder="9876543210"
                type="tel"
              />
            </div>
            {contactNumber.length > 0 && contactNumber.length !== 10 && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {t("enterValid10Digit")}
              </p>
            )}
            {contactNumber.length === 10 && (
              <p className="text-xs text-primary mt-1 flex items-center gap-1">
                <CheckCircle2 size={12} /> {t("validNumber")}
              </p>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-base font-bold rounded-xl gap-2">
            <Save size={16} /> {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

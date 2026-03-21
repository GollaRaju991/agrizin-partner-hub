import { useState } from "react";
import { Menu, X, Globe, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const languageOptions: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { user, profile, signOut, toggleOnline } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleToggleOnline = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await toggleOnline();
    } catch (e: any) {
      if (e?.message === "NO_COMPLETED_APP") {
        toast.success(t("completeAppToGoOnline") || "Please log in and complete your application to go online.");
      }
    }
  };

  const handleMyEarnings = () => {
    if (!user) { navigate("/login"); return; }
    navigate("/dashboard");
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-xl">A</span>
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            Agrizin<span className="text-primary">Partner</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {/* Online/Offline toggle */}
          <div className="flex items-center gap-2 border border-border rounded-full px-3 py-1.5 cursor-pointer">
            <span className={`w-2 h-2 rounded-full ${user && profile?.is_online ? "bg-primary" : "bg-muted-foreground"}`} />
            <span className="text-sm font-medium text-foreground">
              {user && profile?.is_online ? t("online") : t("offline")}
            </span>
            <Switch checked={!!profile?.is_online} onCheckedChange={handleToggleOnline} className="scale-75" />
          </div>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => { setShowLang(!showLang); setShowNotif(false); }}
              className="flex items-center gap-1.5 border border-border rounded-full px-3 py-1.5 hover:bg-accent transition-colors"
            >
              <Globe size={16} className="text-foreground" />
              <span className="text-sm font-medium text-foreground">{language.toUpperCase()}</span>
            </button>
            {showLang && (
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px] z-50">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setShowLang(false);
                      toast.success(`Language: ${lang.label}`);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                      language === lang.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {language === lang.id && <span className="ml-auto text-primary">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotif(!showNotif); setShowLang(false); }}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <Bell size={18} className="text-foreground" />
            </button>
            {showNotif && (
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-lg min-w-[200px] z-50 p-4 text-center">
                <Bell size={28} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
              </div>
            )}
          </div>

          {/* My Earnings */}
          <button onClick={handleMyEarnings} className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
            {t("myEarnings")}
          </button>

          {/* Login / User */}
          {user && profile ? (
            <button onClick={handleSignOut} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              {profile.first_name}
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              {t("login")}
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border px-6 pb-4 space-y-3">
          <div className="flex items-center gap-2 py-2">
            <span className={`w-2 h-2 rounded-full ${user && profile?.is_online ? "bg-primary" : "bg-muted-foreground"}`} />
            <span className="text-sm font-medium text-foreground">
              {user && profile?.is_online ? t("online") : t("offline")}
            </span>
            <Switch checked={!!profile?.is_online} onCheckedChange={handleToggleOnline} className="scale-75" />
          </div>

          {/* Language selector in mobile menu */}
          <div className="flex gap-2 py-2">
            {languageOptions.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  toast.success(`Language: ${lang.label}`);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  language === lang.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-accent"
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>

          <button onClick={handleMyEarnings} className="block text-muted-foreground hover:text-foreground transition-colors font-medium py-2 w-full text-left">
            {t("myEarnings")}
          </button>

          {user && profile ? (
            <button onClick={handleSignOut} className="block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-center w-full">
              {profile.first_name}
            </button>
          ) : (
            <button onClick={() => { navigate("/login"); setIsOpen(false); }} className="block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-center w-full">
              {t("login")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

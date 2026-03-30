import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useUserApplications } from "@/hooks/useUserApplications";
import { Bell, Wallet } from "lucide-react";

const EarningsTab = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { applications, vehicleRegs } = useUserApplications();

  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="w-8" />
          <h1 className="font-heading font-bold text-lg text-foreground">{t("earnings")}</h1>
          <button className="p-2"><Bell size={20} className="text-foreground" /></button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{t("loginToView")}</p>
            <button onClick={() => navigate("/login")} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-heading font-bold">
              {t("login")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasCompleted = applications.some(a => a.status === "completed" || a.status === "approved") ||
    vehicleRegs.some(v => v.status === "completed" || v.status === "approved");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="w-8" />
        <h1 className="font-heading font-bold text-lg text-foreground">{t("earnings")}</h1>
        <button className="p-2"><Bell size={20} className="text-foreground" /></button>
      </div>

      {!hasCompleted ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Wallet size={48} className="text-muted-foreground mb-4" />
          <h3 className="font-heading font-bold text-lg text-foreground mb-2">{t("getStartedEarnings")}</h3>
          <p className="text-muted-foreground text-center text-sm">{t("getStartedEarningsDesc")}</p>
          <button onClick={() => navigate("/")} className="mt-6 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-heading font-bold">
            {t("categories")}
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">{t("totalEarnings")}</h2>
            <p className="font-heading font-bold text-3xl text-foreground">₹0</p>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("thisWeek")}</span>
                <span className="font-semibold text-foreground">₹0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("thisMonth")}</span>
                <span className="font-semibold text-foreground">₹0</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-heading font-bold text-base text-foreground mb-2">{t("dailyEarnings")}</h2>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("today")}</p>
                <p className="text-xs text-muted-foreground">0 {t("trips")}</p>
              </div>
              <p className="font-heading font-bold text-3xl text-foreground">₹0</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">{t("paymentHistory")}</h2>
            <p className="text-sm text-muted-foreground text-center py-4">No payment history yet</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsTab;

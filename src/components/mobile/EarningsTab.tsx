import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useUserApplications } from "@/hooks/useUserApplications";
import { useReferralEarnings } from "@/hooks/useReferralEarnings";
import { Bell, Wallet, ArrowDownCircle, IndianRupee, Users, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EarningsTab = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { applications, vehicleRegs } = useUserApplications();
  const { earnings, withdrawals, loading: earningsLoading, totalEarned, availableBalance, pendingWithdrawal, totalWithdrawn, requestWithdrawal } = useReferralEarnings();

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

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

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!upiId.trim()) { toast.error(t("enterUpiId")); return; }
    if (!amount || amount < 50) { toast.error(t("minWithdrawal")); return; }
    if (amount > availableBalance) { toast.error(t("insufficientBalance")); return; }
    setWithdrawing(true);
    try {
      await requestWithdrawal(amount, upiId.trim());
      toast.success(t("withdrawalRequested"));
      setShowWithdraw(false);
      setWithdrawAmount("");
      setUpiId("");
    } catch (e: any) {
      toast.error(e.message || t("updateError"));
    } finally {
      setWithdrawing(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "completed" || status === "approved") return <CheckCircle2 size={14} className="text-primary" />;
    if (status === "rejected" || status === "failed") return <XCircle size={14} className="text-destructive" />;
    return <Clock size={14} className="text-muted-foreground" />;
  };

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
          {/* Balance Card */}
          <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
            <p className="text-sm opacity-80">{t("availableBalance")}</p>
            <p className="font-heading font-bold text-3xl mt-1">₹{availableBalance}</p>
            <div className="mt-3 flex gap-4 text-sm opacity-80">
              <span>{t("totalEarnings")}: ₹{totalEarned}</span>
              <span>{t("withdrawn")}: ₹{totalWithdrawn}</span>
            </div>
            {pendingWithdrawal > 0 && (
              <p className="text-xs mt-2 opacity-70">{t("pendingWithdrawalAmount")}: ₹{pendingWithdrawal}</p>
            )}
            <Button
              onClick={() => setShowWithdraw(!showWithdraw)}
              disabled={availableBalance < 50}
              className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl font-bold"
            >
              <ArrowDownCircle size={16} className="mr-2" />
              {t("withdrawMoney")}
            </Button>
            {availableBalance < 50 && availableBalance > 0 && (
              <p className="text-xs mt-2 opacity-70">{t("minWithdrawal")}</p>
            )}
          </div>

          {/* Withdraw Form */}
          {showWithdraw && (
            <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <h3 className="font-heading font-bold text-base text-foreground">{t("withdrawMoney")}</h3>
              <div>
                <label className="text-sm text-muted-foreground">{t("upiId")} *</label>
                <Input
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">{t("amount")} *</label>
                <Input
                  type="number"
                  placeholder={`${t("minimum")} ₹50`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="mt-1"
                  min={50}
                  max={availableBalance}
                />
              </div>
              <Button onClick={handleWithdraw} disabled={withdrawing} className="w-full rounded-xl font-bold">
                {withdrawing ? t("processing") : t("confirmWithdrawal")}
              </Button>
            </div>
          )}

          {/* Referral Earnings */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-primary" />
              <h2 className="font-heading font-bold text-base text-foreground">{t("referralEarnings")}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {t("totalReferrals")}: {earnings.length} • ₹{totalEarned}
            </p>
            {earnings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-3">{t("noReferralsYet")}</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {earnings.map((e) => (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={14} className="text-primary" />
                      <span className="text-sm text-foreground">+₹{e.amount}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Withdrawal History */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-heading font-bold text-base text-foreground mb-3">{t("withdrawalHistory")}</h2>
            {withdrawals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t("noWithdrawalsYet")}</p>
            ) : (
              <div className="space-y-2">
                {withdrawals.map((w) => (
                  <div key={w.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">₹{w.amount}</p>
                      <p className="text-xs text-muted-foreground">{w.upi_id}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {statusIcon(w.status)}
                      <span className="text-xs text-muted-foreground capitalize">{w.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsTab;

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ReferralEarning {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  upi_id: string | null;
  bank_account: string | null;
  bank_ifsc: string | null;
  bank_name: string | null;
  status: string;
  created_at: string;
  processed_at: string | null;
}

export function useReferralEarnings() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setEarnings([]);
      setWithdrawals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [earningsRes, withdrawalsRes] = await Promise.all([
      supabase
        .from("referral_earnings")
        .select("*")
        .eq("referrer_user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);
    setEarnings((earningsRes.data as ReferralEarning[]) || []);
    setWithdrawals((withdrawalsRes.data as WithdrawalRequest[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const totalEarned = earnings.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "completed" || w.status === "approved")
    .reduce((sum, w) => sum + Number(w.amount), 0);
  const pendingWithdrawal = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + Number(w.amount), 0);
  const availableBalance = totalEarned - totalWithdrawn - pendingWithdrawal;

  const requestWithdrawal = async (amount: number, upiId: string) => {
    if (!user) throw new Error("Not logged in");
    if (amount < 50) throw new Error("Minimum withdrawal is ₹50");
    if (amount > availableBalance) throw new Error("Insufficient balance");

    const { error } = await supabase.from("withdrawal_requests").insert({
      user_id: user.id,
      amount,
      upi_id: upiId,
    });
    if (error) throw error;
    await fetchAll();
  };

  return {
    earnings,
    withdrawals,
    loading,
    totalEarned,
    totalWithdrawn,
    pendingWithdrawal,
    availableBalance,
    requestWithdrawal,
    refetch: fetchAll,
  };
}

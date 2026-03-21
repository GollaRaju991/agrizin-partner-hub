import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const EarningsTab = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="w-8" />
          <h1 className="font-heading font-bold text-lg text-foreground">Earnings</h1>
          <button className="p-2"><Bell size={20} className="text-foreground" /></button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Login to view your earnings</p>
            <button onClick={() => navigate("/login")} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-heading font-bold">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="w-8" />
        <h1 className="font-heading font-bold text-lg text-foreground">Earnings</h1>
        <button className="p-2"><Bell size={20} className="text-foreground" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Total Earnings */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h2 className="font-heading font-bold text-base text-foreground mb-3">Total Earnings</h2>
          <p className="font-heading font-bold text-3xl text-foreground">₹12,540</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">This Week</span>
              <span className="font-semibold text-foreground">₹3,200</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-semibold text-foreground">₹8,750</span>
            </div>
          </div>
        </div>

        {/* Daily Earnings */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h2 className="font-heading font-bold text-base text-foreground mb-2">Daily Earnings</h2>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today:</p>
              <p className="text-xs text-muted-foreground">12 Trips</p>
            </div>
            <p className="font-heading font-bold text-3xl text-foreground">₹580</p>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h2 className="font-heading font-bold text-base text-foreground mb-3">Payment History</h2>
          <div className="space-y-3">
            {[
              { date: "Apr 25", amount: "₹800" },
              { date: "Apr 24", amount: "₹1,500" },
              { date: "Apr 22", amount: "₹600" },
            ].map((item) => (
              <div key={item.date} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{item.date}</span>
                <span className="font-semibold text-foreground">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsTab;

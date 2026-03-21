import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Phone, User, Truck, LogOut, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AccountTab = () => {
  const { user, profile, signUp, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (!firstName.trim()) { toast.error("Enter your name"); return; }
    if (!phone.trim() || phone.length < 10) { toast.error("Enter valid phone number"); return; }
    setOtpSent(true);
    toast.success("OTP sent! Use code: 1234 (demo)");
  };

  const handleVerify = async () => {
    if (otp !== "1234") { toast.error("Invalid OTP. Use 1234 for demo."); return; }
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setOtpSent(false);
    setOtp("");
    setFirstName("");
    setPhone("");
  };

  // Logged-in view
  if (user && profile) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="w-8" />
          <h1 className="font-heading font-bold text-lg text-foreground">Account</h1>
          <button className="p-2"><Bell size={20} className="text-foreground" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {/* Profile info */}
          <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={28} className="text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground">{profile.first_name}</h2>
              <p className="text-sm text-muted-foreground">+91 {profile.phone}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <button
              onClick={() => navigate("/register/farm-worker")}
              className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Personal Details</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate("/register/vehicle")}
              className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Vehicle Details</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut size={20} className="text-destructive" />
                <span className="text-sm font-medium text-destructive">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login view
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="w-8" />
        <h1 className="font-heading font-bold text-lg text-foreground">Account</h1>
        <button className="p-2"><Bell size={20} className="text-foreground" /></button>
      </div>

      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center mb-3">
              <span className="text-primary-foreground font-heading font-bold text-2xl">A</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-foreground">Welcome to Agrizin</h2>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            {!otpSent ? (
              <>
                <div>
                  <Label className="text-foreground text-sm">Name *</Label>
                  <div className="relative mt-1">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter your name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground text-sm">Phone Number *</Label>
                  <div className="relative mt-1">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      type="tel"
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button onClick={handleSendOTP} className="w-full h-12 text-base font-bold rounded-xl">
                  Login
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">OTP sent to +91 {phone}</p>
                <div>
                  <Label className="text-foreground text-sm">Enter OTP</Label>
                  <Input
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="mt-1 text-center text-2xl tracking-[0.5em]"
                    maxLength={4}
                  />
                </div>
                <Button onClick={handleVerify} disabled={loading} className="w-full h-12 text-base font-bold rounded-xl">
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <button onClick={() => { setOtpSent(false); setOtp(""); }} className="w-full text-sm text-primary hover:underline">
                  ← Change details
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [isSignUp, setIsSignUp] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (isSignUp && !firstName.trim()) {
      toast.error("Please enter your first name");
      return;
    }
    if (tab === "phone" && !phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (tab === "email" && !email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent! Use code: 1234 (demo)");
  };

  const handleVerifyOTP = async () => {
    if (otp !== "1234") {
      toast.error("Invalid OTP. Use 1234 for demo.");
      return;
    }
    setLoading(true);
    try {
      const authEmail = tab === "email" ? email : `${phone}@agrizinpartner.in`;
      const authPassword = `agrizin_${phone || email}_pass`;

      if (isSignUp) {
        await signUp(authEmail, authPassword, firstName, phone, referenceId || undefined);
        toast.success("Account created successfully!");
      } else {
        await signIn(authEmail, authPassword);
        toast.success("Logged in successfully!");
      }
      navigate(redirect);
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        try {
          const authEmail = tab === "email" ? email : `${phone}@agrizinpartner.in`;
          const authPassword = `agrizin_${phone || email}_pass`;
          await signIn(authEmail, authPassword);
          toast.success("Logged in successfully!");
          navigate(redirect);
        } catch {
          toast.error("Login failed. Please try again.");
        }
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back button */}
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Logo — clickable to home */}
          <button onClick={() => navigate("/")} className="w-full text-center mb-8 group">
            <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center mb-3 group-hover:opacity-90 transition-opacity">
              <span className="text-primary-foreground font-heading font-bold text-2xl">A</span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-primary">
              Agrizin<span className="text-foreground">Partner</span>
            </h1>
            <h2 className="font-heading font-bold text-xl text-foreground mt-2">
              {isSignUp ? "Register" : "Login"}
            </h2>
          </button>

          <div className="bg-card rounded-2xl shadow-card p-6">
            {/* Phone/Email tabs */}
            <div className="flex border border-border rounded-lg mb-6 overflow-hidden">
              <button
                onClick={() => setTab("phone")}
                className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  tab === "phone" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                📱 Phone
              </button>
              <button
                onClick={() => setTab("email")}
                className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  tab === "email" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ✉️ Email
              </button>
            </div>

            {!otpSent ? (
              <div className="space-y-4">
                {isSignUp && (
                  <div>
                    <Label className="text-foreground">First Name *</Label>
                    <Input
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                {tab === "phone" ? (
                  <div>
                    <Label className="text-foreground">Phone Number *</Label>
                    <div className="flex gap-2 mt-1">
                      <div className="flex items-center px-3 border border-input rounded-md bg-muted text-sm text-muted-foreground">
                        +91
                      </div>
                      <Input
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        type="tel"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label className="text-foreground">Email *</Label>
                    <Input
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="mt-1"
                    />
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <Label className="text-foreground">Referral ID (Optional)</Label>
                    <div className="flex gap-2 mt-1">
                      <div className="flex items-center px-3 border border-input rounded-md bg-muted text-sm text-muted-foreground">
                        +91
                      </div>
                      <Input
                        placeholder="Enter referrer's phone number"
                        value={referenceId}
                        onChange={(e) => setReferenceId(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        type="tel"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Enter referrer's phone number to earn ₹5 bonus</p>
                  </div>
                )}

                <Button onClick={handleSendOTP} className="w-full h-12 text-base font-bold rounded-lg">
                  Send OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  OTP sent to {tab === "phone" ? `+91 ${phone}` : email}
                </p>
                <div>
                  <Label className="text-foreground">Enter OTP</Label>
                  <Input
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="mt-1 text-center text-2xl tracking-[0.5em]"
                    maxLength={4}
                  />
                </div>
                <Button onClick={handleVerifyOTP} disabled={loading} className="w-full h-12 text-base font-bold rounded-lg">
                  {loading ? "Verifying..." : "Verify & Continue"}
                </Button>
                <button
                  onClick={() => { setOtpSent(false); setOtp(""); }}
                  className="w-full text-sm text-primary hover:underline"
                >
                  ← Change details
                </button>
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground mt-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline">
                {isSignUp ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

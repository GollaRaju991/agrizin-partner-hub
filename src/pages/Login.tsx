import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ name?: string; phone?: string; password?: string; general?: string }>({});

  const clearErrors = () => setErrors({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (isSignUp && !firstName.trim()) newErrors.name = "Please enter your name";
    if (!phone.trim()) {
      newErrors.phone = "Please enter your mobile number";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!password) {
      newErrors.password = "Please enter your password";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    clearErrors();
    if (!validate()) return;

    setLoading(true);
    const authEmail = `${phone}@agrizinpartner.in`;

    try {
      if (isSignUp) {
        await signUp(authEmail, password, firstName, phone, referenceId || undefined);
        toast.success("Registration successful. Please login");
        setIsSignUp(false);
        setPassword("");
      } else {
        await signIn(authEmail, password);
        toast.success("Login successful");
        navigate(redirect);
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        setErrors({ general: "User already exists. Please login" });
        setIsSignUp(false);
      } else if (msg.includes("Invalid login") || msg.includes("invalid_credentials")) {
        setErrors({ general: "Invalid mobile number or password" });
      } else if (msg.includes("Email not confirmed")) {
        // Try to handle unconfirmed accounts by re-signing up to trigger auto-confirm
        try {
          await signUp(authEmail, password, firstName || "User", phone);
          await signIn(authEmail, password);
          toast.success("Login successful");
          navigate(redirect);
        } catch {
          setErrors({ general: "Invalid mobile number or password" });
        }
      } else {
        setErrors({ general: "Something went wrong. Please try again" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed. Please try again");
        return;
      }
      if (result.redirected) return;
      toast.success("Login successful");
      navigate(redirect);
    } catch {
      toast.error("Google sign-in failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const ErrorText = ({ message }: { message?: string }) =>
    message ? <p className="text-destructive text-xs mt-1 font-medium">{message}</p> : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

          <div className="bg-card rounded-2xl shadow-card p-6 space-y-4">
            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                <p className="text-destructive text-sm font-medium text-center">{errors.general}</p>
              </div>
            )}

            {isSignUp && (
              <div>
                <Label className="text-foreground">Name *</Label>
                <Input
                  placeholder="Enter your name"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                  className={`mt-1 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                <ErrorText message={errors.name} />
              </div>
            )}

            <div>
              <Label className="text-foreground">Mobile Number *</Label>
              <div className="flex gap-2 mt-1">
                <div className="flex items-center px-3 border border-input rounded-md bg-muted text-sm text-muted-foreground">
                  +91
                </div>
                <Input
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(prev => ({ ...prev, phone: undefined, general: undefined })); }}
                  type="tel"
                  className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                />
              </div>
              <ErrorText message={errors.phone} />
            </div>

            <div>
              <Label className="text-foreground">Password *</Label>
              <div className="relative mt-1">
                <Input
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined, general: undefined })); }}
                  type={showPassword ? "text" : "password"}
                  className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <ErrorText message={errors.password} />
              {isSignUp && !errors.password && (
                <p className="text-xs text-muted-foreground mt-1">Password must be at least 6 characters</p>
              )}
            </div>

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

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 text-base font-bold rounded-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  {isSignUp ? "Creating your account..." : "Loading..."}
                </span>
              ) : (
                isSignUp ? "Register" : "Login"
              )}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 text-base font-medium rounded-lg gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setPassword(""); clearErrors(); }}
                className="text-primary font-semibold hover:underline"
              >
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

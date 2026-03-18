import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, toggleOnline } = useAuth();
  const navigate = useNavigate();

  const handleToggleOnline = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleOnline();
  };

  const handleMyEarnings = () => {
    if (!user) {
      navigate("/login");
      return;
    }
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
          {/* Online/Offline toggle — always visible */}
          <div className="flex items-center gap-2 border border-border rounded-full px-3 py-1.5 cursor-pointer">
            <span className={`w-2 h-2 rounded-full ${user && profile?.is_online ? "bg-primary" : "bg-muted-foreground"}`} />
            <span className="text-sm font-medium text-foreground">
              {user && profile?.is_online ? "Online" : "Offline"}
            </span>
            <Switch
              checked={!!profile?.is_online}
              onCheckedChange={handleToggleOnline}
              className="scale-75"
            />
          </div>

          {/* My Earnings — always visible */}
          <button
            onClick={handleMyEarnings}
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            My Earnings
          </button>

          {/* Login / User Name */}
          {user && profile ? (
            <button
              onClick={handleSignOut}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {profile.first_name}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Login
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
              {user && profile?.is_online ? "Online" : "Offline"}
            </span>
            <Switch
              checked={!!profile?.is_online}
              onCheckedChange={handleToggleOnline}
              className="scale-75"
            />
          </div>

          <button
            onClick={handleMyEarnings}
            className="block text-muted-foreground hover:text-foreground transition-colors font-medium py-2 w-full text-left"
          >
            My Earnings
          </button>

          {user && profile ? (
            <button
              onClick={handleSignOut}
              className="block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-center w-full"
            >
              {profile.first_name}
            </button>
          ) : (
            <button
              onClick={() => { navigate("/login"); setIsOpen(false); }}
              className="block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-center w-full"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

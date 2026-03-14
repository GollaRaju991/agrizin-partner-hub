import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-xl">A</span>
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            Agrizin<span className="text-primary">Partner</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Services</a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">About</a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Contact</a>
          <a href="#services" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border px-6 pb-4 space-y-3">
          <a href="#services" className="block text-muted-foreground hover:text-foreground transition-colors font-medium py-2">Services</a>
          <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors font-medium py-2">About</a>
          <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors font-medium py-2">Contact</a>
          <a href="#services" className="block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-center hover:opacity-90 transition-opacity">
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

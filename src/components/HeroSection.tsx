import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Agricultural fields at sunset" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <p className="text-secondary font-semibold text-lg mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Agriculture Services Partner
        </p>
        <h1 className="font-heading font-extrabold text-5xl md:text-7xl text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Empowering Farmers<br />
          <span className="text-secondary">Across India</span>
        </h1>
        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          Rent vehicles, access farm equipment, and connect with skilled drivers — all in one platform built for modern agriculture.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <a href="#services" className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-heading font-bold text-lg hover:opacity-90 transition-opacity">
            Explore Services
          </a>
          <a href="#contact" className="border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-lg font-heading font-bold text-lg hover:bg-primary-foreground/10 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

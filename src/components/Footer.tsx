const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-xl">A</span>
              </div>
              <span className="font-heading font-bold text-xl text-background">
                AgrizinPartner
              </span>
            </div>
            <p className="text-background/60 leading-relaxed">
              Empowering farmers across India with modern agricultural services and technology.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-background mb-4">Services</h4>
            <ul className="space-y-2 text-background/60">
              <li><a href="#services" className="hover:text-background transition-colors">Rent Vehicle</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Farm Maker</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Agrizin Driver</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-background mb-4">Contact</h4>
            <ul className="space-y-2 text-background/60">
              <li>info@agrizinpartner.in</li>
              <li>Hyderabad, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/40">
          <p>© {new Date().getFullYear()} Agrizin Partner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

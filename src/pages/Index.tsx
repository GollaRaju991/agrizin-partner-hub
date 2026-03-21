import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import MobileLayout from "@/components/mobile/MobileLayout";

const Index = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ServicesSection />
      <Footer />
    </div>
  );
};

export default Index;

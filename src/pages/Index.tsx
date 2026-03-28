import { useIsMobile } from "@/hooks/use-mobile";
import MobileLayout from "@/components/mobile/MobileLayout";
import DesktopDashboard from "@/components/desktop/DesktopDashboard";

const Index = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout />;
  }

  return <DesktopDashboard />;
};

export default Index;

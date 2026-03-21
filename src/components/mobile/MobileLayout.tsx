import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNav, { type MobileTab } from "@/components/mobile/BottomNav";
import HomeTab from "@/components/mobile/HomeTab";
import CategoriesTab from "@/components/mobile/CategoriesTab";
import EarningsTab from "@/components/mobile/EarningsTab";
import AccountTab from "@/components/mobile/AccountTab";

const MobileLayout = () => {
  const [activeTab, setActiveTab] = useState<MobileTab>("home");

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "earnings" && <EarningsTab />}
        {activeTab === "account" && <AccountTab />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileLayout;

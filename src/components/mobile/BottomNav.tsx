import { Home, LayoutGrid, IndianRupee, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export type MobileTab = "home" | "categories" | "earnings" | "account";

interface BottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

const tabs = [
  { id: "home" as const, labelKey: "home" as const, icon: Home },
  { id: "categories" as const, labelKey: "categories" as const, icon: LayoutGrid },
  { id: "earnings" as const, labelKey: "earnings" as const, icon: IndianRupee },
  { id: "account" as const, labelKey: "account" as const, icon: User },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const { t } = useLanguage();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-primary md:hidden safe-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[60px]"
            >
              <tab.icon
                size={22}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <span
                className={`text-[11px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

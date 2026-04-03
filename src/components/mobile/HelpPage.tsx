import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ChevronLeft, ChevronRight, BookOpen, FileText, MapPin, Wallet,
  Upload, UserCheck, Radio, BarChart3, ArrowDownToLine, Map,
  Users, PhoneCall, Mail, MessageCircle, HelpCircle, AlertTriangle, Shield,
} from "lucide-react";
import { toast } from "sonner";

type HelpSection = "menu" | "guide" | null;

interface GuideItem {
  icon: any;
  title: string;
  content: string;
}

const HelpPage = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const registrationGuides: GuideItem[] = [
    { icon: UserCheck, title: t("howRegisterFarmWorker"), content: t("guideFarmWorker") },
    { icon: FileText, title: t("howRegisterVehicle"), content: t("guideVehicle") },
    { icon: Users, title: t("howRegisterDriver"), content: t("guideDriver") },
  ];

  const additionalHelp: GuideItem[] = [
    { icon: UserCheck, title: t("howCompleteProfile"), content: t("guideCompleteProfile") },
    { icon: Upload, title: t("howUploadDocs"), content: t("guideUploadDocs") },
    { icon: Radio, title: t("howGoOnline"), content: t("guideGoOnline") },
    { icon: BarChart3, title: t("howViewEarnings"), content: t("guideViewEarnings") },
    { icon: ArrowDownToLine, title: t("howWithdrawEarnings"), content: t("guideWithdrawEarnings") },
    { icon: MapPin, title: t("howUpdateLocation"), content: t("guideUpdateLocation") },
    { icon: Map, title: t("howMatchingWorks"), content: t("guideMatchingWorks") },
  ];

  const supportOptions = [
    { icon: PhoneCall, title: t("callSupport"), action: () => { window.location.href = "tel:+919876543210"; } },
    { icon: Mail, title: t("emailSupport"), action: () => { window.location.href = "mailto:support@agrizin.com"; } },
    { icon: MessageCircle, title: t("chatSupport"), action: () => toast.info(t("comingSoon")) },
    { icon: HelpCircle, title: t("faqs"), action: () => setActiveGuide("faqs") },
    { icon: Shield, title: t("privacyPolicy") || "Privacy Policy", action: () => navigate("/privacy-policy") },
    { icon: AlertTriangle, title: t("reportIssue"), action: () => toast.info(t("comingSoon")) },
  ];

  // Show guide detail
  if (activeGuide && activeGuide !== "faqs") {
    const allGuides = [...registrationGuides, ...additionalHelp];
    const guide = allGuides.find(g => g.title === activeGuide);
    if (guide) {
      return (
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
            <button onClick={() => setActiveGuide(null)} className="text-primary font-heading font-bold text-sm">{t("back")}</button>
            <h1 className="font-heading font-bold text-base text-foreground truncate">{guide.title}</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <guide.icon size={20} className="text-primary" />
                <h2 className="font-heading font-bold text-foreground">{guide.title}</h2>
              </div>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">{guide.content}</div>
            </div>
          </div>
        </div>
      );
    }
  }

  // FAQs
  if (activeGuide === "faqs") {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
          <button onClick={() => setActiveGuide(null)} className="text-primary font-heading font-bold text-sm">{t("back")}</button>
          <h1 className="font-heading font-bold text-lg text-foreground">❓ {t("faqs")}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
          {[
            { q: t("faq1Q"), a: t("faq1A") },
            { q: t("faq2Q"), a: t("faq2A") },
            { q: t("faq3Q"), a: t("faq3A") },
            { q: t("faq4Q"), a: t("faq4A") },
          ].map((faq, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-2">Q: {faq.q}</h3>
              <p className="text-xs text-muted-foreground">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center px-4 py-3 bg-card border-b border-border gap-3">
        <button onClick={onBack} className="text-primary font-heading font-bold text-sm">{t("back")}</button>
        <h1 className="font-heading font-bold text-lg text-foreground">❓ {t("help")}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {/* Registration Guides */}
        <div>
          <h3 className="font-heading font-bold text-sm text-foreground mb-2 px-1">📌 {t("registrationGuides")}</h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {registrationGuides.map((guide, i) => (
              <div key={guide.title}>
                {i > 0 && <div className="h-px bg-border mx-4" />}
                <button
                  onClick={() => setActiveGuide(guide.title)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <guide.icon size={18} className="text-primary" />
                    <span className="text-sm font-medium text-foreground text-left">{guide.title}</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div>
          <h3 className="font-heading font-bold text-sm text-foreground mb-2 px-1">📌 {t("additionalHelp")}</h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {additionalHelp.map((guide, i) => (
              <div key={guide.title}>
                {i > 0 && <div className="h-px bg-border mx-4" />}
                <button
                  onClick={() => setActiveGuide(guide.title)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <guide.icon size={18} className="text-primary" />
                    <span className="text-sm font-medium text-foreground text-left">{guide.title}</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-heading font-bold text-sm text-foreground mb-2 px-1">📞 {t("supportOptions")}</h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {supportOptions.map((opt, i) => (
              <div key={opt.title}>
                {i > 0 && <div className="h-px bg-border mx-4" />}
                <button
                  onClick={opt.action}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <opt.icon size={18} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">{opt.title}</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

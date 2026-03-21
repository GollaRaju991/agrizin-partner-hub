import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "te";

const translations = {
  en: {
    // Top bar
    online: "Online",
    offline: "Offline",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    
    // Bottom nav
    home: "Home",
    categories: "Categories",
    earnings: "Earnings",
    account: "Account",
    
    // Home
    goOnline: "Go Online",
    goOffline: "Go Offline",
    loadingMap: "Loading map...",
    
    // Categories
    farmWorker: "Farm Worker",
    farmWorkerSub: "Find Labor Jobs",
    rentVehicle: "Rent Vehicle",
    rentVehicleSub: "Hire Cars & Bikes",
    agrizinDriver: "Agrizin Driver",
    agrizinDriverSub: "Agricultural Transport",
    completed: "Completed",
    inProgress: "In Progress",
    notAdded: "Not added",
    
    // Account
    myApplications: "📋 My Applications",
    editDetails: "Edit Details",
    addFarmWorkerDetails: "Add Farm Worker Details",
    addRentVehicleDetails: "Add Rent Vehicle Details",
    addAgrizinDriverDetails: "Add Agrizin Driver Details",
    referPartner: "Refer Agrizin Partner",
    referSubtitle: "Invite and earn rewards",
    appSettings: "App Settings",
    appSettingsSub: "Language, notifications",
    logout: "Logout",
    welcomeAgrizin: "Welcome to Agrizin",
    login: "Login",
    loginToView: "Login to view your earnings",
    name: "Name",
    enterName: "Enter your name",
    phoneNumber: "Phone Number",
    otpSentTo: "OTP sent to",
    enterOtp: "Enter OTP",
    enterOtpPlaceholder: "Enter 4-digit OTP",
    verifyOtp: "Verify OTP",
    verifying: "Verifying...",
    changeDetails: "← Change details",
    back: "← Back",
    
    // Earnings
    totalEarnings: "Total Earnings",
    thisWeek: "This Week",
    thisMonth: "This Month",
    dailyEarnings: "Daily Earnings",
    today: "Today:",
    trips: "Trips",
    paymentHistory: "Payment History",
    
    // Detail labels
    nameLabel: "Name",
    skills: "Skills",
    experience: "Experience",
    location: "Location",
    availability: "Availability",
    vehicle: "Vehicle",
    license: "License",
    registration: "Registration",
    years: "years",
    
    // Timeline
    submitted: "Submitted",
    
    // Language
    selectLanguage: "Select Language",
    english: "English",
    hindi: "हिन्दी",
    telugu: "తెలుగు",

    // Navbar desktop
    myEarnings: "My Earnings",
    
    // Settings
    language: "Language",
    notificationsToggle: "Notifications",
    comingSoon: "Coming soon!",
  },
  hi: {
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    notifications: "सूचनाएं",
    noNotifications: "कोई नई सूचना नहीं",
    
    home: "होम",
    categories: "श्रेणियाँ",
    earnings: "कमाई",
    account: "खाता",
    
    goOnline: "ऑनलाइन जाएं",
    goOffline: "ऑफ़लाइन जाएं",
    loadingMap: "मानचित्र लोड हो रहा है...",
    
    farmWorker: "खेत मजदूर",
    farmWorkerSub: "मजदूरी के काम खोजें",
    rentVehicle: "वाहन किराया",
    rentVehicleSub: "कार और बाइक किराये पर लें",
    agrizinDriver: "एग्रिज़िन ड्राइवर",
    agrizinDriverSub: "कृषि परिवहन",
    completed: "पूर्ण",
    inProgress: "प्रगति में",
    notAdded: "जोड़ा नहीं गया",
    
    myApplications: "📋 मेरे आवेदन",
    editDetails: "विवरण संपादित करें",
    addFarmWorkerDetails: "खेत मजदूर विवरण जोड़ें",
    addRentVehicleDetails: "वाहन किराया विवरण जोड़ें",
    addAgrizinDriverDetails: "एग्रिज़िन ड्राइवर विवरण जोड़ें",
    referPartner: "एग्रिज़िन पार्टनर रेफर करें",
    referSubtitle: "आमंत्रित करें और पुरस्कार कमाएं",
    appSettings: "ऐप सेटिंग्स",
    appSettingsSub: "भाषा, सूचनाएं",
    logout: "लॉगआउट",
    welcomeAgrizin: "एग्रिज़िन में आपका स्वागत है",
    login: "लॉगिन",
    loginToView: "अपनी कमाई देखने के लिए लॉगिन करें",
    name: "नाम",
    enterName: "अपना नाम दर्ज करें",
    phoneNumber: "फ़ोन नंबर",
    otpSentTo: "OTP भेजा गया",
    enterOtp: "OTP दर्ज करें",
    enterOtpPlaceholder: "4-अंकीय OTP दर्ज करें",
    verifyOtp: "OTP सत्यापित करें",
    verifying: "सत्यापित हो रहा है...",
    changeDetails: "← विवरण बदलें",
    back: "← वापस",
    
    totalEarnings: "कुल कमाई",
    thisWeek: "इस सप्ताह",
    thisMonth: "इस महीने",
    dailyEarnings: "दैनिक कमाई",
    today: "आज:",
    trips: "यात्राएं",
    paymentHistory: "भुगतान इतिहास",
    
    nameLabel: "नाम",
    skills: "कौशल",
    experience: "अनुभव",
    location: "स्थान",
    availability: "उपलब्धता",
    vehicle: "वाहन",
    license: "लाइसेंस",
    registration: "पंजीकरण",
    years: "वर्ष",
    
    submitted: "जमा किया",
    
    selectLanguage: "भाषा चुनें",
    english: "English",
    hindi: "हिन्दी",
    telugu: "తెలుగు",
    
    myEarnings: "मेरी कमाई",
    
    language: "भाषा",
    notificationsToggle: "सूचनाएं",
    comingSoon: "जल्द आ रहा है!",
  },
  te: {
    online: "ఆన్‌లైన్",
    offline: "ఆఫ్‌లైన్",
    notifications: "నోటిఫికేషన్లు",
    noNotifications: "కొత్త నోటిఫికేషన్లు లేవు",
    
    home: "హోమ్",
    categories: "వర్గాలు",
    earnings: "సంపాదన",
    account: "ఖాతా",
    
    goOnline: "ఆన్‌లైన్ అవ్వండి",
    goOffline: "ఆఫ్‌లైన్ అవ్వండి",
    loadingMap: "మ్యాప్ లోడ్ అవుతోంది...",
    
    farmWorker: "వ్యవసాయ కూలీ",
    farmWorkerSub: "కూలీ పనులు కనుగొనండి",
    rentVehicle: "వాహనం అద్దె",
    rentVehicleSub: "కార్లు & బైక్‌లు అద్దెకు",
    agrizinDriver: "ఎగ్రిజిన్ డ్రైవర్",
    agrizinDriverSub: "వ్యవసాయ రవాణా",
    completed: "పూర్తయింది",
    inProgress: "ప్రగతిలో ఉంది",
    notAdded: "జోడించలేదు",
    
    myApplications: "📋 నా దరఖాస్తులు",
    editDetails: "వివరాలు మార్చండి",
    addFarmWorkerDetails: "వ్యవసాయ కూలీ వివరాలు జోడించండి",
    addRentVehicleDetails: "వాహనం అద్దె వివరాలు జోడించండి",
    addAgrizinDriverDetails: "ఎగ్రిజిన్ డ్రైవర్ వివరాలు జోడించండి",
    referPartner: "ఎగ్రిజిన్ పార్టనర్ రిఫర్ చేయండి",
    referSubtitle: "ఆహ్వానించి రివార్డ్‌లు పొందండి",
    appSettings: "యాప్ సెట్టింగ్‌లు",
    appSettingsSub: "భాష, నోటిఫికేషన్లు",
    logout: "లాగౌట్",
    welcomeAgrizin: "ఎగ్రిజిన్‌కు స్వాగతం",
    login: "లాగిన్",
    loginToView: "మీ సంపాదన చూడటానికి లాగిన్ అవ్వండి",
    name: "పేరు",
    enterName: "మీ పేరు నమోదు చేయండి",
    phoneNumber: "ఫోన్ నంబర్",
    otpSentTo: "OTP పంపబడింది",
    enterOtp: "OTP నమోదు చేయండి",
    enterOtpPlaceholder: "4-అంకెల OTP నమోదు చేయండి",
    verifyOtp: "OTP ధృవీకరించండి",
    verifying: "ధృవీకరిస్తోంది...",
    changeDetails: "← వివరాలు మార్చండి",
    back: "← వెనుకకు",
    
    totalEarnings: "మొత్తం సంపాదన",
    thisWeek: "ఈ వారం",
    thisMonth: "ఈ నెల",
    dailyEarnings: "రోజువారీ సంపాదన",
    today: "ఈ రోజు:",
    trips: "ట్రిప్‌లు",
    paymentHistory: "చెల్లింపు చరిత్ర",
    
    nameLabel: "పేరు",
    skills: "నైపుణ్యాలు",
    experience: "అనుభవం",
    location: "ప్రదేశం",
    availability: "అందుబాటు",
    vehicle: "వాహనం",
    license: "లైసెన్స్",
    registration: "రిజిస్ట్రేషన్",
    years: "సంవత్సరాలు",
    
    submitted: "సమర్పించబడింది",
    
    selectLanguage: "భాష ఎంచుకోండి",
    english: "English",
    hindi: "हिन्दी",
    telugu: "తెలుగు",
    
    myEarnings: "నా సంపాదన",
    
    language: "భాష",
    notificationsToggle: "నోటిఫికేషన్లు",
    comingSoon: "త్వరలో వస్తుంది!",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("agrizin_lang");
    return (saved as Language) || "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("agrizin_lang", lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

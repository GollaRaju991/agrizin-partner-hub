import { createContext, useContext, useState, ReactNode } from "react";
import { settingsAndHelpTranslations } from "@/data/settingsHelpTranslations";

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
    completeAppToGoOnline: "Please log in and complete your application to go online.",
    
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
    password: "Password",
    enterPassword: "Enter your password",
    back: "← Back",
    
    // Earnings
    totalEarnings: "Total Earnings",
    thisWeek: "This Week",
    thisMonth: "This Month",
    dailyEarnings: "Daily Earnings",
    today: "Today:",
    trips: "Trips",
    paymentHistory: "Payment History",
    getStartedEarnings: "Get started with your earnings",
    getStartedEarningsDesc: "Complete a service registration to start tracking your earnings here.",
    availableBalance: "Available Balance",
    withdrawn: "Withdrawn",
    pendingWithdrawalAmount: "Pending",
    withdrawMoney: "Withdraw Money",
    upiId: "UPI ID",
    amount: "Amount",
    minimum: "Minimum",
    confirmWithdrawal: "Confirm Withdrawal",
    processing: "Processing...",
    withdrawalRequested: "Withdrawal request submitted!",
    enterUpiId: "Please enter your UPI ID",
    minWithdrawal: "Minimum withdrawal is ₹50",
    insufficientBalance: "Insufficient balance",
    referralEarnings: "Referral Earnings",
    totalReferrals: "Total Referrals",
    noReferralsYet: "No referrals yet. Share your code to earn!",
    noWithdrawalsYet: "No withdrawals yet",
    withdrawalHistory: "Withdrawal History",
    yourReferralCode: "Your Referral Code",
    shareReferral: "Share Referral",
    referralShareText: "Join Agrizin Partner app and earn! Use my referral code:",
    copiedToClipboard: "Copied to clipboard!",
    perReferral: "per referral",
    
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

    // Edit form
    save: "Save Changes",
    saving: "Saving...",
    cancel: "Cancel",
    updateSuccess: "Details updated successfully!",
    updateError: "Failed to update. Please try again.",
    state: "State",
    district: "District",
    mandal: "Mandal",
    village: "Village",
    expectedWage: "Expected Wage",
    wageType: "Wage Type",
    perDay: "Per Day",
    perMonth: "Per Month",
    perHour: "Per Hour",
    experienceYears: "Experience (Years)",
    fullName: "Full Name",
    mobile: "Mobile",
    vehicleNumber: "Vehicle Number",
    vehicleUsageType: "Vehicle Usage Type",
    drivingLicense: "Driving License No.",
    vehicleMake: "Vehicle Make",
    vehicleModel: "Vehicle Model",
    registrationNo: "Registration No.",
    ...settingsAndHelpTranslations.en,
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
    completeAppToGoOnline: "कृपया लॉग इन करें और ऑनलाइन जाने के लिए अपना आवेदन पूरा करें।",
    
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
    password: "पासवर्ड",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    back: "← वापस",
    
    totalEarnings: "कुल कमाई",
    thisWeek: "इस सप्ताह",
    thisMonth: "इस महीने",
    dailyEarnings: "दैनिक कमाई",
    today: "आज:",
    trips: "यात्राएं",
    paymentHistory: "भुगतान इतिहास",
    getStartedEarnings: "अपनी कमाई शुरू करें",
    getStartedEarningsDesc: "यहां अपनी कमाई ट्रैक करने के लिए एक सेवा पंजीकरण पूरा करें।",
    availableBalance: "उपलब्ध शेष",
    withdrawn: "निकाला गया",
    pendingWithdrawalAmount: "लंबित",
    withdrawMoney: "पैसे निकालें",
    upiId: "UPI ID",
    amount: "राशि",
    minimum: "न्यूनतम",
    confirmWithdrawal: "निकासी की पुष्टि करें",
    processing: "प्रोसेसिंग...",
    withdrawalRequested: "निकासी अनुरोध सबमिट किया गया!",
    enterUpiId: "कृपया अपना UPI ID दर्ज करें",
    minWithdrawal: "न्यूनतम निकासी ₹50 है",
    insufficientBalance: "अपर्याप्त शेष",
    referralEarnings: "रेफरल कमाई",
    totalReferrals: "कुल रेफरल",
    noReferralsYet: "अभी तक कोई रेफरल नहीं। कमाने के लिए अपना कोड शेयर करें!",
    noWithdrawalsYet: "अभी तक कोई निकासी नहीं",
    withdrawalHistory: "निकासी इतिहास",
    yourReferralCode: "आपका रेफरल कोड",
    shareReferral: "रेफरल शेयर करें",
    referralShareText: "Agrizin Partner ऐप से जुड़ें और कमाएं! मेरा रेफरल कोड उपयोग करें:",
    copiedToClipboard: "कॉपी हो गया!",
    perReferral: "प्रति रेफरल",
    
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

    save: "बदलाव सहेजें",
    saving: "सहेज रहे हैं...",
    cancel: "रद्द करें",
    updateSuccess: "विवरण सफलतापूर्वक अपडेट किए गए!",
    updateError: "अपडेट विफल। कृपया पुनः प्रयास करें।",
    state: "राज्य",
    district: "जिला",
    mandal: "मंडल",
    village: "गांव",
    expectedWage: "अपेक्षित वेतन",
    wageType: "वेतन प्रकार",
    perDay: "प्रति दिन",
    perMonth: "प्रति माह",
    perHour: "प्रति घंटा",
    experienceYears: "अनुभव (वर्ष)",
    fullName: "पूरा नाम",
    mobile: "मोबाइल",
    vehicleNumber: "वाहन नंबर",
    vehicleUsageType: "वाहन उपयोग प्रकार",
    drivingLicense: "ड्राइविंग लाइसेंस नं.",
    vehicleMake: "वाहन कंपनी",
    vehicleModel: "वाहन मॉडल",
    registrationNo: "पंजीकरण नं.",
    ...settingsAndHelpTranslations.hi,
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
    completeAppToGoOnline: "దయచేసి లాగిన్ చేసి, ఆన్‌లైన్‌కు వెళ్ళడానికి మీ దరఖాస్తును పూర్తి చేయండి.",
    
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
    getStartedEarnings: "మీ సంపాదనతో ప్రారంభించండి",
    getStartedEarningsDesc: "మీ సంపాదనను ఇక్కడ ట్రాక్ చేయడానికి సేవా నమోదును పూర్తి చేయండి.",
    availableBalance: "అందుబాటులో ఉన్న బ్యాలెన్స్",
    withdrawn: "విత్‌డ్రా చేయబడింది",
    pendingWithdrawalAmount: "పెండింగ్",
    withdrawMoney: "డబ్బు విత్‌డ్రా చేయండి",
    upiId: "UPI ID",
    amount: "మొత్తం",
    minimum: "కనీసం",
    confirmWithdrawal: "విత్‌డ్రాను నిర్ధారించండి",
    processing: "ప్రాసెస్ అవుతోంది...",
    withdrawalRequested: "విత్‌డ్రా అభ్యర్థన సమర్పించబడింది!",
    enterUpiId: "దయచేసి మీ UPI ID నమోదు చేయండి",
    minWithdrawal: "కనీస విత్‌డ్రా ₹50",
    insufficientBalance: "సరిపోని బ్యాలెన్స్",
    referralEarnings: "రిఫరల్ సంపాదన",
    totalReferrals: "మొత్తం రిఫరల్‌లు",
    noReferralsYet: "ఇంకా రిఫరల్‌లు లేవు. సంపాదించడానికి మీ కోడ్ షేర్ చేయండి!",
    noWithdrawalsYet: "ఇంకా విత్‌డ్రాలు లేవు",
    withdrawalHistory: "విత్‌డ్రా చరిత్ర",
    yourReferralCode: "మీ రిఫరల్ కోడ్",
    shareReferral: "రిఫరల్ షేర్ చేయండి",
    referralShareText: "Agrizin Partner యాప్‌లో చేరండి మరియు సంపాదించండి! నా రిఫరల్ కోడ్ ఉపయోగించండి:",
    copiedToClipboard: "కాపీ చేయబడింది!",
    perReferral: "రిఫరల్‌కు",
    
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

    save: "మార్పులు సేవ్ చేయండి",
    saving: "సేవ్ అవుతోంది...",
    cancel: "రద్దు చేయండి",
    updateSuccess: "వివరాలు విజయవంతంగా అప్‌డేట్ చేయబడ్డాయి!",
    updateError: "అప్‌డేట్ విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    state: "రాష్ట్రం",
    district: "జిల్లా",
    mandal: "మండలం",
    village: "గ్రామం",
    expectedWage: "ఆశించిన వేతనం",
    wageType: "వేతన రకం",
    perDay: "రోజుకు",
    perMonth: "నెలకు",
    perHour: "గంటకు",
    experienceYears: "అనుభవం (సంవత్సరాలు)",
    fullName: "పూర్తి పేరు",
    mobile: "మొబైల్",
    vehicleNumber: "వాహన నంబర్",
    vehicleUsageType: "వాహన ఉపయోగ రకం",
    drivingLicense: "డ్రైవింగ్ లైసెన్స్ నం.",
    vehicleMake: "వాహన తయారీ",
    vehicleModel: "వాహన మోడల్",
    registrationNo: "రిజిస్ట్రేషన్ నం.",
    ...settingsAndHelpTranslations.te,
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

// Indian location data: State → District → Mandal mapping
// Covers major agricultural states with key districts and mandals

import { getTelanganaDistrictNames, getTelanganaMandals } from './telanganaLocations';

export const INDIAN_LOCATIONS: Record<string, Record<string, string[]>> = {
  "Andhra Pradesh": {
    "Anantapur": ["Anantapur", "Dharmavaram", "Hindupur", "Kadiri", "Kalyanadurgam", "Penukonda", "Rayadurg", "Tadipatri", "Uravakonda", "Guntakal"],
    "Chittoor": ["Chittoor", "Tirupati", "Madanapalle", "Punganur", "Puttur", "Srikalahasti", "Nagari", "Kuppam", "Palamaner", "Pileru"],
    "East Godavari": ["Kakinada", "Rajahmundry", "Amalapuram", "Ramachandrapuram", "Peddapuram", "Tuni", "Samalkot", "Mandapeta", "Pitapuram", "Prathipadu"],
    "Guntur": ["Guntur", "Tenali", "Narasaraopet", "Mangalagiri", "Bapatla", "Macherla", "Vinukonda", "Sattenapalli", "Piduguralla", "Ponnur"],
    "Krishna": ["Vijayawada", "Machilipatnam", "Gudivada", "Nuzvid", "Jaggayyapeta", "Tiruvuru", "Nandigama", "Mylavaram", "Gannavaram", "Avanigadda"],
    "Kurnool": ["Kurnool", "Nandyal", "Adoni", "Yemmiganur", "Dhone", "Allagadda", "Atmakur", "Nandikotkur", "Pattikonda", "Koilkuntla"],
    "Nellore": ["Nellore", "Kavali", "Gudur", "Atmakur", "Sullurpeta", "Venkatagiri", "Udayagiri", "Kodavalur", "Allur", "Buchireddypalem"],
    "Prakasam": ["Ongole", "Markapur", "Chirala", "Kandukur", "Darsi", "Addanki", "Giddalur", "Podili", "Kanigiri", "Cumbum"],
    "Srikakulam": ["Srikakulam", "Tekkali", "Palasa", "Narasannapeta", "Amadalavalasa", "Rajam", "Ichchapuram", "Pathapatnam", "Etcherla", "Kaviti"],
    "Visakhapatnam": ["Visakhapatnam", "Anakapalli", "Narsipatnam", "Yelamanchili", "Bheemunipatnam", "Chodavaram", "Madugula", "Paderu", "Araku Valley", "Pendurthi"],
    "Vizianagaram": ["Vizianagaram", "Parvathipuram", "Bobbili", "Salur", "Rajam", "Nellimarla", "Srungavarapukota", "Cheepurupalli", "Gajapathinagaram", "Dattirajeru"],
    "West Godavari": ["Eluru", "Bhimavaram", "Tadepalligudem", "Tanuku", "Narasapuram", "Palacole", "Kovvur", "Nidadavole", "Jangareddygudem", "Chintalapudi"],
    "YSR Kadapa": ["Kadapa", "Proddatur", "Rajampet", "Jammalamadugu", "Pulivendla", "Mydukur", "Badvel", "Rayachoti", "Kamalapuram", "Lakkireddypalle"],
  },
  "Telangana": (() => {
    const result: Record<string, string[]> = {};
    const districts = getTelanganaDistrictNames();
    districts.forEach((d) => {
      result[d] = getTelanganaMandals(d);
    });
    return result;
  })(),
  "Karnataka": {
    "Bangalore Urban": ["Bangalore North", "Bangalore South", "Bangalore East", "Anekal", "Yelahanka"],
    "Bangalore Rural": ["Devanahalli", "Doddaballapur", "Hosakote", "Nelamangala"],
    "Belgaum": ["Belgaum", "Athani", "Bailhongal", "Chikkodi", "Gokak", "Hukkeri", "Khanapur", "Raibag", "Ramdurg", "Savadatti"],
    "Bellary": ["Bellary", "Hospet", "Sandur", "Siruguppa", "Kudligi", "Hagaribommanahalli", "Hadagalli"],
    "Davangere": ["Davangere", "Harpanahalli", "Jagalur", "Harapanahalli", "Honnali", "Channagiri"],
    "Dharwad": ["Dharwad", "Hubli", "Kalghatgi", "Kundgol", "Navalgund"],
    "Gulbarga": ["Gulbarga", "Aland", "Afzalpur", "Chincholi", "Jevargi", "Sedam", "Shahpur"],
    "Hassan": ["Hassan", "Arkalgud", "Arsikere", "Belur", "Channarayapatna", "Holenarasipura", "Sakleshpur"],
    "Mandya": ["Mandya", "Maddur", "Malavalli", "Nagamangala", "Pandavapura", "Srirangapatna", "Krishnarajpet"],
    "Mysore": ["Mysore", "Chamarajanagar", "Gundlupet", "Heggadadevankote", "Hunsur", "Krishnarajanagara", "Nanjangud", "Periyapatna", "Tirumakudal Narsipur"],
    "Tumkur": ["Tumkur", "Gubbi", "Kunigal", "Madhugiri", "Pavagada", "Sira", "Tiptur", "Turuvekere", "Koratagere", "Chiknayakanhalli"],
  },
  "Tamil Nadu": {
    "Chennai": ["Egmore", "Mylapore", "T. Nagar", "Anna Nagar", "Adyar", "Tambaram", "Ambattur"],
    "Coimbatore": ["Coimbatore North", "Coimbatore South", "Pollachi", "Mettupalayam", "Sulur", "Annur", "Kinathukadavu"],
    "Madurai": ["Madurai East", "Madurai West", "Melur", "Thirumangalam", "Usilampatti", "Vadipatti", "Peraiyur"],
    "Salem": ["Salem", "Attur", "Mettur", "Omalur", "Sangagiri", "Edappadi", "Yercaud"],
    "Thanjavur": ["Thanjavur", "Kumbakonam", "Pattukkottai", "Orathanadu", "Peravurani", "Thiruvaiyaru", "Thiruvidaimarudur"],
    "Tiruchirappalli": ["Tiruchirappalli", "Srirangam", "Lalgudi", "Musiri", "Thottiyam", "Mannachanallur", "Manapparai"],
    "Tirunelveli": ["Tirunelveli", "Palayamkottai", "Ambasamudram", "Tenkasi", "Sankarankovil", "Radhapuram", "Nanguneri"],
  },
  "Maharashtra": {
    "Pune": ["Pune City", "Haveli", "Baramati", "Indapur", "Junnar", "Khed", "Maval", "Mulshi", "Shirur", "Velhe"],
    "Nashik": ["Nashik", "Igatpuri", "Malegaon", "Niphad", "Sinnar", "Dindori", "Kalwan", "Yeola", "Chandwad"],
    "Nagpur": ["Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Saoner", "Katol", "Narkhed", "Umred", "Ramtek"],
    "Solapur": ["Solapur North", "Solapur South", "Barshi", "Akkalkot", "Pandharpur", "Mangalvedhe", "Karmala", "Madha"],
    "Kolhapur": ["Kolhapur", "Karvir", "Panhala", "Shahuwadi", "Kagal", "Hatkanangale", "Shirol", "Radhanagari", "Gaganbawda", "Chandgad"],
    "Ahmednagar": ["Ahmednagar", "Shrirampur", "Rahuri", "Sangamner", "Kopargaon", "Shrigonda", "Karjat", "Jamkhed", "Nagar", "Parner"],
  },
  "Gujarat": {
    "Ahmedabad": ["Ahmedabad City", "Daskroi", "Dholka", "Sanand", "Bavla", "Detroj-Rampura", "Viramgam", "Mandal"],
    "Rajkot": ["Rajkot", "Dhoraji", "Gondal", "Jasdan", "Jetpur", "Kotda Sangani", "Lodhika", "Morbi", "Paddhari", "Upleta"],
    "Surat": ["Surat City", "Bardoli", "Chorasi", "Kamrej", "Mangrol", "Mandvi", "Mahuva", "Olpad", "Palsana", "Umarpada"],
    "Vadodara": ["Vadodara City", "Dabhoi", "Karjan", "Padra", "Savli", "Shinor", "Vaghodia"],
  },
  "Madhya Pradesh": {
    "Bhopal": ["Bhopal", "Berasia", "Huzur", "Phanda"],
    "Indore": ["Indore", "Depalpur", "Mhow", "Sanwer"],
    "Jabalpur": ["Jabalpur", "Patan", "Sihora", "Shahpura", "Kundam"],
    "Gwalior": ["Gwalior", "Dabra", "Bhitarwar", "Morar"],
  },
  "Rajasthan": {
    "Jaipur": ["Jaipur", "Amber", "Bassi", "Chaksu", "Chomu", "Jamwa Ramgarh", "Kotputli", "Phagi", "Sanganer", "Shahpura", "Viratnagar"],
    "Jodhpur": ["Jodhpur", "Bilara", "Bhopalgarh", "Luni", "Mandore", "Osian", "Phalodi", "Pipar City", "Shergarh"],
    "Udaipur": ["Udaipur", "Girwa", "Kherwara", "Mavli", "Salumber", "Sarada", "Vallabhnagar"],
    "Kota": ["Kota", "Digod", "Itawa", "Kanwas", "Ladpura", "Pipalda", "Sangod", "Sultanpur"],
  },
  "Uttar Pradesh": {
    "Lucknow": ["Lucknow", "Bakshi Ka Talab", "Chinhat", "Malihabad", "Mohanlalganj", "Sarojini Nagar"],
    "Agra": ["Agra", "Etmadpur", "Fatehabad", "Kheragarh", "Bah", "Kiraoli"],
    "Varanasi": ["Varanasi", "Pindra", "Sevapuri", "Cholapur", "Kashi Vidyapeeth", "Harahua"],
    "Kanpur": ["Kanpur Nagar", "Bilhaur", "Derapur", "Ghatampur", "Kalyanpur"],
    "Allahabad": ["Allahabad", "Bara", "Handia", "Karchana", "Koraon", "Meja", "Phulpur", "Soraon"],
  },
  "Bihar": {
    "Patna": ["Patna Sadar", "Danapur", "Barh", "Bikram", "Masaurhi", "Maner", "Phulwari Sharif"],
    "Gaya": ["Gaya", "Bodh Gaya", "Atri", "Barachatti", "Belaganj", "Dobhi", "Fatehpur", "Gurua", "Imamganj", "Konch"],
    "Muzaffarpur": ["Muzaffarpur", "Kanti", "Motipur", "Musahri", "Paroo", "Saraiya"],
    "Bhagalpur": ["Bhagalpur", "Kahalgaon", "Naugachhia", "Sultanganj", "Bihpur", "Gopalpur"],
  },
  "West Bengal": {
    "Kolkata": ["Kolkata"],
    "North 24 Parganas": ["Barasat", "Basirhat", "Barrackpore", "Bongaon", "Habra"],
    "South 24 Parganas": ["Alipore", "Baruipur", "Canning", "Diamond Harbour", "Kakdwip"],
    "Howrah": ["Howrah", "Uluberia", "Shyampur", "Amta", "Bagnan"],
    "Hooghly": ["Hooghly", "Chandannagar", "Serampore", "Arambagh", "Chinsurah", "Polba"],
  },
  "Punjab": {
    "Ludhiana": ["Ludhiana", "Jagraon", "Khanna", "Samrala", "Raikot", "Machhiwara"],
    "Amritsar": ["Amritsar", "Ajnala", "Baba Bakala", "Tarn Taran"],
    "Patiala": ["Patiala", "Rajpura", "Samana", "Nabha", "Patran"],
    "Jalandhar": ["Jalandhar", "Nakodar", "Phillaur", "Shahkot", "Adampur"],
  },
  "Haryana": {
    "Hisar": ["Hisar", "Hansi", "Barwala", "Narnaund", "Uklana", "Adampur"],
    "Karnal": ["Karnal", "Assandh", "Gharaunda", "Indri", "Nilokheri", "Nissing"],
    "Ambala": ["Ambala", "Barara", "Naraingarh", "Shahzadpur", "Saha"],
    "Rohtak": ["Rohtak", "Meham", "Kalanaur", "Lakhan Majra", "Sampla"],
  },
  "Odisha": {
    "Cuttack": ["Cuttack", "Athagarh", "Banki", "Baramba", "Niali", "Salepur"],
    "Ganjam": ["Berhampur", "Aska", "Bhanjanagar", "Chatrapur", "Hinjilicut", "Khallikote"],
    "Balasore": ["Balasore", "Jaleswar", "Soro", "Basta", "Nilgiri", "Remuna"],
    "Sambalpur": ["Sambalpur", "Kuchinda", "Rairakhol", "Bamra", "Jamankira", "Jujumura"],
  },
  "Kerala": {
    "Thiruvananthapuram": ["Thiruvananthapuram", "Attingal", "Chirayinkeezhu", "Kattakkada", "Nedumangad", "Neyyattinkara", "Varkala"],
    "Ernakulam": ["Ernakulam", "Aluva", "Angamaly", "Kothamangalam", "Muvattupuzha", "North Paravur", "Perumbavoor"],
    "Thrissur": ["Thrissur", "Chalakudy", "Chavakkad", "Guruvayur", "Irinjalakuda", "Kodungallur", "Kunnamkulam"],
    "Kozhikode": ["Kozhikode", "Koyilandy", "Vadakara", "Thamarassery", "Perambra", "Kunnamangalam"],
  },
  "Chhattisgarh": {
    "Raipur": ["Raipur", "Abhanpur", "Arang", "Dharsiwa", "Tilda"],
    "Bilaspur": ["Bilaspur", "Kota", "Lormi", "Masturi", "Mungeli", "Takhatpur"],
    "Durg": ["Durg", "Bhilai", "Patan", "Dhamdha", "Gurur"],
  },
  "Jharkhand": {
    "Ranchi": ["Ranchi", "Bundu", "Kanke", "Mandar", "Ratu", "Silli"],
    "Dhanbad": ["Dhanbad", "Jharia", "Baghmara", "Baliapur", "Gobindpur", "Topchanchi"],
    "Jamshedpur": ["Jamshedpur", "Jugsalai", "Potka", "Musabani", "Chakulia"],
  },
};

// Get all states
export const getStates = (): string[] => Object.keys(INDIAN_LOCATIONS).sort();

// Get districts for a state
export const getDistricts = (state: string): string[] => {
  return state && INDIAN_LOCATIONS[state]
    ? Object.keys(INDIAN_LOCATIONS[state]).sort()
    : [];
};

// Get mandals for a state and district
export const getMandals = (state: string, district: string): string[] => {
  return state && district && INDIAN_LOCATIONS[state]?.[district]
    ? INDIAN_LOCATIONS[state][district].sort()
    : [];
};

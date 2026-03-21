// Indian location data: State → District → Mandal mapping
// Covers major agricultural states with key districts and mandals

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
  "Telangana": {
    "Adilabad": ["Adilabad Rural", "Adilabad Urban", "Bazarhathnoor", "Bela", "Boath", "Gadiguda", "Ichoda", "Indervelly", "Jainad", "Narnoor", "Sirikonda", "Talamadugu", "Tamsi", "Utnoor"],
    "Bhadradri Kothagudem": ["Allapalli", "Aswapuram", "Aswaraopeta", "Burgampahad", "Chandrugonda", "Cherla", "Chunchupalli", "Dammapeta", "Dummugudem", "Gundala", "Julurpad", "Karakagudem", "Kothagudem", "Manuguru", "Mulakalapalli", "Palvancha", "Pinapaka", "Sujathanagar", "Tekulapalli", "Yellandu"],
    "Hanumakonda": ["Bheemadevarpalli", "Dharmasagar", "Elkathurthy", "Hanumakonda", "Hasanparthy", "Inavole", "Kamalapur", "Kazipet"],
    "Hyderabad": ["Amberpet", "Ameerpet", "Asifnagar", "Bahadurpura", "Bandlaguda", "Charminar", "Golconda", "Himayatnagar", "Khairatabad", "Marredpally", "Musheerabad", "Nampally", "Saidabad", "Secunderabad", "Shaikpet", "Tirumalagiri"],
    "Jagtial": ["Beerpur", "Buggaram", "Dharmapuri", "Gollapalli", "Ibrahimpatnam", "Jagtial Rural", "Jagtial Urban", "Kathlapur", "Kodimyala", "Korutla", "Mallial", "Medipalli", "Metpalli", "Pegadapalli", "Raikal", "Sarangapur", "Velgatoor"],
    "Jangaon": ["Bachannapet", "Devaruppula", "Ghanpur Station", "Jangaon", "Kodakandla", "Lingalaghanpur", "Narmetta", "Palakurthy", "Raghunathpalle", "Zaffergadh"],
    "Jayashankar Bhupalpally": ["Bhupalpally", "Chityal", "Ghanpur Mulug", "Kataram", "Kothapally", "Mahadevpur", "Mutharam Mahadevpur", "Regonda", "Tekumatla"],
    "Jogulamba Gadwal": ["Alampur", "Dharur", "Gadwal", "Gattu", "Ieeja", "Itikyala", "Maldakal", "Manopadu", "Rajoli", "Undavelli"],
    "Kamareddy": ["Banswada", "Bhiknoor", "Bibipet", "Bichkunda", "Domakonda", "Gandhari", "Jukkal", "Kamareddy", "Lingampet", "Machareddy", "Madnoor", "Nagireddypet", "Nizamsagar", "Pitlam", "Rajampet", "Ramareddy", "Sadashivanagar", "Tadwai", "Yellareddy"],
    "Karimnagar": ["Choppadandi", "Gangadhara", "Ganneruvaram", "Husnabad", "Huzurabad", "Karimnagar Rural", "Karimnagar Urban", "Kothapalli", "Manakondur", "Ramadugu", "Saidapur", "Shankarapatnam", "Thimmapur", "Veenavanka"],
    "Khammam": ["Bonakal", "Chinthakani", "Enkoor", "Kallur", "Khammam Rural", "Khammam Urban", "Kusumanchi", "Madhira", "Mudigonda", "Nelakondapalli", "Raghunathapalem", "Sathupalli", "Singareni", "Tallada", "Tirumalayapalem", "Wyra", "Yerrupalem"],
    "Komaram Bheem Asifabad": ["Asifabad", "Bejjur", "Dahegaon", "Jainoor", "Kagaznagar", "Kerameri", "Kouthala", "Lingapur", "Penchikalpet", "Rebbena", "Sirpur", "Tiryani", "Wankidi"],
    "Mahabubabad": ["Bayyaram", "Chinnagudur", "Danthalapalle", "Dornakal", "Gangaram", "Garla", "Gudur", "Kesamudram", "Kothaguda", "Kuravi", "Mahabubabad", "Maripeda", "Narsimhulapet", "Nellikudur", "Peddavangara", "Seerole", "Thorrur"],
    "Mahabubnagar": ["Addakal", "Balanagar", "Bhoothpur", "Chinna Chintakunta", "Devarkadra", "Hanwada", "Jadcherla", "Koilkonda", "Mahabubnagar", "Midjil", "Moosapet", "Nawabpet", "Rajapur"],
    "Mancherial": ["Bellampalli", "Bheemaram", "Chennur", "Dandepalli", "Hajipur", "Jaipur", "Jannaram", "Kasipet", "Kotapalli", "Luxettipet", "Mancherial", "Mandamarri", "Naspur", "Tandur", "Vemanpalli"],
    "Medak": ["Alladurg", "Chegunta", "Haveli Ghanpur", "Kowdipally", "Kulcharam", "Medak", "Narsapur", "Nizampet", "Papannapet", "Ramayampet", "Shankarampet A", "Shankarampet R", "Tekmal", "Tupran"],
    "Medchal-Malkajgiri": ["Alwal", "Bachupally", "Dundigal Gandimaisamma", "Ghatkesar", "Kapra", "Keesara", "Kukatpally", "Malkajgiri", "Medchal", "Quthbullapur", "Shamirpet", "Uppal"],
    "Mulugu": ["Eturnagaram", "Govindaraopet", "Mangapet", "Mulugu", "Tadvai", "Venkatapur", "Venkatapuram"],
    "Nagarkurnool": ["Achampet", "Amrabad", "Balmoor", "Bijinapally", "Kalwakurthy", "Kodair", "Kollapur", "Lingal", "Nagarkurnool", "Peddakothapally", "Pentlavelli", "Tadoor", "Telkapally", "Thimmajipet", "Uppunuthala", "Urkonda", "Vangoor"],
    "Nalgonda": ["Adavidevulapally", "Chandampet", "Chityal", "Dameracherla", "Devarakonda", "Gurrampode", "Kattangur", "Kethepally", "Marriguda", "Miryalaguda", "Munugode", "Nakrekal", "Nalgonda", "Nampally", "Nidamanur", "Peddavoora", "Tipparthi", "Tripuraram"],
    "Narayanpet": ["Damaragidda", "Kosgi", "Krishna", "Maganoor", "Makthal", "Narayanpet", "Narva", "Utkoor"],
    "Nirmal": ["Basar", "Bhainsa", "Dasturabad", "Dilawarpur", "Kaddam", "Khanapur", "Kubeer", "Laxmanchanda", "Lokeshwaram", "Mamda", "Mudhole", "Narsapur G", "Nirmal", "Sarangapur", "Soan"],
    "Nizamabad": ["Armur", "Balkonda", "Bheemgal", "Bodhan", "Dharpally", "Dichpally", "Jakranpally", "Kotgiri", "Makloor", "Mendora", "Mortad", "Nandipet", "Navipet", "Nizamabad Rural", "Nizamabad Urban", "Renjal", "Varni", "Velpur"],
    "Peddapalli": ["Anthergaon", "Dharmaram", "Julapalli", "Kamanpur", "Manthani", "Mutharam Manthani", "Odela", "Peddapalli", "Ramagundam", "Srirampur", "Sultanabad"],
    "Rajanna Sircilla": ["Boinpalli", "Chandurthi", "Ellanthakunta", "Gambhiraopet", "Konaraopeta", "Mustabad", "Rudrangi", "Sircilla", "Thangallapalli", "Vemulawada"],
    "Rangareddy": ["Abdullapurmet", "Amangal", "Balapur", "Chevella", "Farooqnagar", "Ibrahimpatnam", "Kandukur", "Keshampet", "Maheshwaram", "Manchal", "Marpally", "Moinabad", "Nawabpet", "Pargi", "Rajendranagar", "Saroornagar", "Shabad", "Shankarpally", "Talakondapally", "Yacharam"],
    "Sangareddy": ["Ameenpur", "Andole", "Gummadidala", "Hathnoora", "Jharasangam", "Jogipet", "Kondapur", "Manoor", "Mogudampally", "Munipally", "Narayankhed", "Patancheru", "Pulkal", "Raikode", "Ramachandrapuram", "Sadasivpet", "Sangareddy", "Vatpally", "Zaheerabad"],
    "Siddipet": ["Bejjanki", "Cheriyal", "Chinnakodur", "Doultabad", "Dubbak", "Gajwel", "Husnabad", "Jagdevpur", "Koheda", "Kondapak", "Maddur", "Markook", "Mirdoddi", "Nangnoor", "Raipole", "Siddipet", "Thoguta", "Wargal"],
    "Suryapet": ["Ananthagiri", "Athmakur S", "Chivvemla", "Garidepally", "Huzurnagar", "Kodad", "Mattampally", "Mellacheruvu", "Mothey", "Munagala", "Nadigudem", "Nagaram", "Neredcherla", "Penpahad", "Suryapet", "Thirumalagiri", "Tungaturthy"],
    "Vikarabad": ["Bantwaram", "Basheerabad", "Bomraspet", "Dharur", "Doma", "Kodangal", "Kulkacherla", "Marpally", "Mominpet", "Nawabpet", "Pargi", "Peddemul", "Pudur", "Tandur", "Vikarabad", "Yalal"],
    "Wanaparthy": ["Atmakur", "Chinnambavi", "Ghanpur", "Kothakota", "Madanapur", "Pangal", "Pebbair", "Revally", "Srirangapur", "Wanaparthy"],
    "Warangal": ["Duggondi", "Geesugonda", "Nallabelly", "Narsampet", "Parvathagiri", "Raiparthy", "Sangem", "Shayampet", "Wardhannapet"],
    "Yadadri Bhuvanagiri": ["Addaguduru", "Alair", "Atmakur M", "Bhuvanagiri", "Bibinagar", "Bommalaramaram", "Choutuppal", "Gundala", "Motakondur", "Pochampally", "Rajapet", "Turkapally", "Valigonda", "Yadagirigutta"],
  },
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

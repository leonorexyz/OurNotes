export interface RecommendedTeam {
  id: string;
  name: string;
  category: "Score Meta" | "Mono-Band" | "Event Point" | "Survival / Healer";
  tagline: string;
  targetRoom: string;
  estimatedBP: number;
  centerMemberId: string;
  memberIds: [string, string, string, string, string];
  synergyTags: string[];
  strategy: string;
  recommendedAreaItems: string[];
  songSuitability: string;
}

export const RECOMMENDED_TEAMS: RecommendedTeam[] = [
  {
    id: "team-meta-score",
    name: "All-Star Meta Score Attack",
    category: "Score Meta",
    tagline: "Formasi ofensif dengan deretan Score Booster tertinggi untuk mencetak skor SSS di Multi-Live Grand Room.",
    targetRoom: "Grand Room (250.000+ BP)",
    estimatedBP: 198500,
    centerMemberId: "char-uika-misumi", // +130% Score Up
    memberIds: [
      "char-ran-mitake",      // +115% Score Up
      "char-layer",           // +125% Score Up
      "char-uika-misumi",     // CENTER (+130% Score Up)
      "char-sayo-hikawa",     // +125% Score Up
      "char-tomori-takamatsu",// +120% Score Up
    ],
    synergyTags: ["Total Boost Skor +615%", "Leader Skill +130%", "Full Score Boosters"],
    strategy: "Menempatkan Doloris (Uika) di slot Center memicu pengganda skor +130% saat Fever Time. Keempat sub-member memiliki skill pengali skor murni di atas +115%, memastikan setiap note PERFECT bernilai maksimal tanpa pemborosan poin pada skill pemulihan.",
    recommendedAreaItems: ["CiRCLE Studio Mic Stand", "Poster Multi-Live Emas", "Megafon Akurasi"],
    songSuitability: "Lagu bertempo cepat dengan note count padat seperti FIRE BIRD, EXPOSE 'Burn out!!!', dan Teardrops.",
  },
  {
    id: "team-poppin-full",
    name: "Poppin'Party Kira-Kira Harmony",
    category: "Mono-Band",
    tagline: "Formasi 5 personel resmi Poppin'Party untuk memicu bonus instrumen dan poster Ryuseido hingga +20%.",
    targetRoom: "Regular Room & Veteran Room",
    estimatedBP: 213240,
    centerMemberId: "char-kasumi-toyama",
    memberIds: [
      "char-tae-hanazono",
      "char-saya-yamabuki",
      "char-kasumi-toyama",
      "char-arisa-ichigaya",
      "char-ran-mitake", // guest or 5th slot
    ],
    synergyTags: ["Mono-Band Bonus +20%", "Center Kasumi +130%", "Survival + Heal Seimbang"],
    strategy: "Kombinasi Kasumi sebagai Center dan Saya di drum memberikan perlindungan Life sekaligus Score Boost tinggi. Memaksimalkan bonus area item Ryuseido Kasumi Guitar (+10%) dan Choco Cornet Yamabuki Bakery.",
    recommendedAreaItems: ["Ryuseido Kasumi Guitar Poster", "Yamabuki Bakery Display", "Instrumen Studio Poppin'Party"],
    songSuitability: "Lagu tema pembuka anime seperti Tokimeki Experience! dan Kizuna Music.",
  },
  {
    id: "team-roselia-gothic",
    name: "Roselia Neo-Aspect Symphonic",
    category: "Mono-Band",
    tagline: "Kekuatan gothic metal Roselia dengan teknik tinggi dan sinergi mawar biru abadi.",
    targetRoom: "Veteran & Master Room",
    estimatedBP: 218500,
    centerMemberId: "char-yukina-minato",
    memberIds: [
      "char-sayo-hikawa",
      "char-ako-udagawa",
      "char-yukina-minato",
      "char-layer",
      "char-uika-misumi",
    ],
    synergyTags: ["Cool & Power Hybrid", "Leader Yukina +120%", "Dual S-Rank Guitars"],
    strategy: "Yukina Minato memimpin dengan Neo-Aspect Resonance yang memberikan boost 120% serta regenerasi HP instan saat kondisi krisis. Sayo Hikawa menambah ketajaman akurasi note PERFECT.",
    recommendedAreaItems: ["Blue Rose Baroque Pedestal", "CiRCLE Studio Room A Amp", "Roselia Stage Flag"],
    songSuitability: "Lagu-lagu symphonic metal berkecepatan tinggi: FIRE BIRD, BLACK SHOUT, dan R.",
  },
  {
    id: "team-survival-healer",
    name: "Safe Clear Survival & Recovery",
    category: "Survival / Healer",
    tagline: "Formasi pertahanan tebal dengan 3 kartu pemulih Life untuk menaklukkan lagu Expert Lv 27-28 tanpa Game Over.",
    targetRoom: "Latihan & Clear Challenge",
    estimatedBP: 178900,
    centerMemberId: "char-kokoro-tsurumaki",
    memberIds: [
      "char-saya-yamabuki",     // Heal +350
      "char-tae-hanazono",      // Heal +300
      "char-kokoro-tsurumaki",  // CENTER (+450 Heal)
      "char-misaki-okusawa",    // Heal +250
      "char-mashiro-kurata",    // Combo Guard / Lock
    ],
    synergyTags: ["Total Life Pool 5.150 HP", "Combo Streak Protector", "Recovery +1.350 Life"],
    strategy: "Formasi teraman bagi pemain pemula atau saat mencoba lagu sulit (Expert 27-28). Kokoro memulihkan 450 HP secara masif, didukung Saya dan Misaki. Mashiro menjaga agar combo tidak putus saat terjadi note GREAT.",
    recommendedAreaItems: ["Michelle Plushie Balloon", "Fruit Smoothie Bar", "CiRCLE Lounge Sofa"],
    songSuitability: "Lagu teknikal dengan flick beruntun dan slide sempit: Hey-day Capriccio, Ringing Bloom, dan 六兆年と一夜物語.",
  },
  {
    id: "team-cool-mono",
    name: "Mono-Attribute Cool Resonance",
    category: "Event Point",
    tagline: "Semua 5 anggota beratribut Cool untuk mendongkrak poin event mingguan hingga +250%.",
    targetRoom: "Event Ranking Master Room",
    estimatedBP: 211800,
    centerMemberId: "char-yukina-minato",
    memberIds: [
      "char-mashiro-kurata",
      "char-rui-yashio",
      "char-yukina-minato",
      "char-sayo-hikawa",
      "char-ako-udagawa",
    ],
    synergyTags: ["Mono-Cool Buff +20%", "Event Point Multiplier +250%", "High Technique Stat"],
    strategy: "Memanfaatkan 100% bonus atribut Cool yang sering menjadi target rotasi event mingguan. Mengombinasikan violinis Rui Yashio dan gitaris Sayo Hikawa untuk dominasi statistik Technique.",
    recommendedAreaItems: ["Cool Fountain Plaza", "Sapphire Stage Lighting", "Tsukinomori Glass Terrarium"],
    songSuitability: "Lagu event kategori Cool untuk perolehan poin ranking tercepat per Live Boost.",
  },
];

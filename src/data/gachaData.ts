export interface FeaturedGachaCharacter {
  id: string;
  name: string;
  cardTitle: string;
  rarity: number;
  attribute: "Power" | "Pure" | "Cool" | "Happy";
  bandName: string;
  role: string;
  pickupRate: string;
  avatarBg: string;
  cardImage?: string;
  skillName: string;
  skillType: "Score Up" | "Recovery" | "Accuracy / Lock";
  skillBoost: string;
}

export interface GachaBanner {
  id: string;
  title: string;
  japaneseTitle?: string;
  category: "Kirafes / Festival" | "Limited Event" | "Permanent Pickup" | "Birthday Special" | "Miracle Ticket";
  status: "Aktif" | "Akan Datang" | "Selesai";
  startAt: string;
  endAt: string;
  bannerImageBg: string;
  featuredCharacters: FeaturedGachaCharacter[];
  pickupRates: {
    maxRarityRate: string;
    star3Rate: string;
    star2Rate: string;
    featuredTotalRate: string;
    isDoubleRate: boolean;
  };
  pitySystem: {
    sealPerPull: number;
    pityThreshold: number;
    exchangeItem: string;
    rules: string;
  };
  cost: {
    single: number;
    tenPull: number;
    paidDaily?: number;
  };
  description: string;
  isRecommended: boolean;
  tags: string[];
}

export const GACHA_BANNERS_DATA: GachaBanner[] = [
  {
    id: "gacha-kirafes-vol1",
    title: "KiraKirameki Festival: Twilight Sparkle Gacha",
    japaneseTitle: "キラメキフェスティバルガチャ",
    category: "Kirafes / Festival",
    status: "Aktif",
    startAt: "2026-10-10T15:00:00+09:00",
    endAt: "2026-10-20T14:59:59+09:00",
    bannerImageBg: "from-purple-900 via-pink-900 to-indigo-950",
    isRecommended: true,
    tags: ["Rate ★4 Naik 2x (6%)", "Festival Eksklusif", "Score Boost +130%"],
    description:
      "Festival gacha akbar dengan peluang kartu ★4 berlipat ganda dari 3% menjadi 6%! Menghadirkan kartu Kirafes eksklusif Kasumi Toyama dan Yukina Minato dengan animasi Live2D transisi panggung khusus.",
    pickupRates: {
      maxRarityRate: "6.000% (2x Rate Up)",
      star3Rate: "8.500%",
      star2Rate: "85.500%",
      featuredTotalRate: "1.400% (0.700% per kartu)",
      isDoubleRate: true,
    },
    pitySystem: {
      sealPerPull: 1,
      pityThreshold: 300,
      exchangeItem: "Tiket Penukaran Kartu Kirafes Kasumi atau Yukina",
      rules:
        "Tiap 1 roll menghasilkan 1 Gacha Seal. Kumpulkan 300 Gacha Seal sebelum banner berakhir untuk menukar langsung kartu ★4 unggulan pilihanmu di Toko Penukaran Seal.",
    },
    cost: {
      single: 250,
      tenPull: 2500,
      paidDaily: 60,
    },
    featuredCharacters: [
      {
        id: "char-kasumi-toyama",
        name: "Kasumi Toyama",
        cardTitle: "Kilau Bintang Senja (Twilight Starlight)",
        rarity: 4,
        attribute: "Pure",
        bandName: "Poppin'Party",
        role: "Vocal & Guitar",
        pickupRate: "0.700%",
        avatarBg: "from-pink-500 to-rose-600",
        skillName: "Kirakira Doki Doki Melody!",
        skillType: "Score Up",
        skillBoost: "+130% Score saat PERFECT",
      },
      {
        id: "char-yukina-minato",
        name: "Yukina Minato",
        cardTitle: "Gothic Sonata of Blue Roses",
        rarity: 4,
        attribute: "Cool",
        bandName: "Roselia",
        role: "Vocalist",
        pickupRate: "0.700%",
        avatarBg: "from-blue-600 to-indigo-700",
        skillName: "Resonansi Mawar Biru",
        skillType: "Score Up",
        skillBoost: "+125% Score & Life Guard",
      },
    ],
  },
  {
    id: "gacha-event-neon-beats",
    title: "Neon City Cyber Beats Pickup Gacha",
    japaneseTitle: "サイバービートピックアップガチャ",
    category: "Limited Event",
    status: "Aktif",
    startAt: "2026-10-12T15:00:00+09:00",
    endAt: "2026-10-23T20:59:59+09:00",
    bannerImageBg: "from-cyan-950 via-teal-900 to-slate-950",
    isRecommended: false,
    tags: ["Bonus Event +50% Poin", "Edisi Terbatas", "Cyber Theme"],
    description:
      "Banner pengiring Event Marathon 'Pertarungan Ritme Neon'. Kartu dalam banner ini memberikan bonus Event Point +50% dan bonus Event Medal +20% di setiap live show.",
    pickupRates: {
      maxRarityRate: "3.000%",
      star3Rate: "8.500%",
      star2Rate: "88.500%",
      featuredTotalRate: "1.000%",
      isDoubleRate: false,
    },
    pitySystem: {
      sealPerPull: 1,
      pityThreshold: 300,
      exchangeItem: "★4 LAYER [Bass Tremor Cyber Shock]",
      rules:
        "Gacha Seal kedaluwarsa setelah banner berakhir dan dikonversi otomatis menjadi Michelle Stickers.",
    },
    cost: {
      single: 250,
      tenPull: 2500,
      paidDaily: 60,
    },
    featuredCharacters: [
      {
        id: "char-layer",
        name: "LAYER (Rei Wakana)",
        cardTitle: "Cybernetic Bass Vibrations",
        rarity: 4,
        attribute: "Power",
        bandName: "RAISE A SUILEN",
        role: "Vocal & Bass",
        pickupRate: "0.700%",
        avatarBg: "from-teal-500 to-emerald-700",
        skillName: "Overdrive Bassline",
        skillType: "Score Up",
        skillBoost: "+120% Score Up",
      },
      {
        id: "char-ran-mitake",
        name: "Ran Mitake",
        cardTitle: "Neon Sunset Rooftop Solo",
        rarity: 4,
        attribute: "Power",
        bandName: "Afterglow",
        role: "Vocal & Guitar",
        pickupRate: "0.300%",
        avatarBg: "from-red-600 to-amber-700",
        skillName: "Same as Usual, Louder",
        skillType: "Accuracy / Lock",
        skillBoost: "+110% Score & GREAT jadi PERFECT",
      },
    ],
  },
  {
    id: "gacha-permanent-mygo",
    title: "It's MyGO!!!!! Melodi Hati yang Tersesat Gacha",
    japaneseTitle: "迷子たちのコンパス常設ガチャ",
    category: "Permanent Pickup",
    status: "Aktif",
    startAt: "2026-10-01T00:00:00+09:00",
    endAt: "2026-11-01T23:59:59+09:00",
    bannerImageBg: "from-sky-950 via-blue-900 to-indigo-950",
    isRecommended: false,
    tags: ["Kartu Permanen", "MyGO!!!!! Debut", "Sinergi Band Baru"],
    description:
      "Banner debut permanen bagi Tomori Takamatsu dan personil MyGO!!!!!. Karakter yang didapat akan masuk ke dalam pool gacha reguler setelah periode pickup selesai.",
    pickupRates: {
      maxRarityRate: "3.000%",
      star3Rate: "8.500%",
      star2Rate: "88.500%",
      featuredTotalRate: "0.700%",
      isDoubleRate: false,
    },
    pitySystem: {
      sealPerPull: 1,
      pityThreshold: 200,
      exchangeItem: "★4 Tomori Takamatsu [Kata-kata Tanpa Suara]",
      rules:
        "Banner permanen memiliki ambang batas spark lebih rendah: hanya 200 Gacha Seal untuk menukar kartu utama.",
    },
    cost: {
      single: 250,
      tenPull: 2500,
    },
    featuredCharacters: [
      {
        id: "char-tomori-takamatsu",
        name: "Tomori Takamatsu",
        cardTitle: "Suara yang Menggapai Langit Kelabu",
        rarity: 4,
        attribute: "Pure",
        bandName: "MyGO!!!!!",
        role: "Vocalist",
        pickupRate: "0.700%",
        avatarBg: "from-sky-500 to-blue-700",
        skillName: "Puisi yang Tak Pernah Usai",
        skillType: "Score Up",
        skillBoost: "+120% Score Up",
      },
    ],
  },
  {
    id: "gacha-upcoming-ave-mujica",
    title: "Ave Mujica Masquerade Nocturne Gacha (Segera)",
    japaneseTitle: "アヴェ・ムジカ 仮面舞踏会ガチャ",
    category: "Limited Event",
    status: "Akan Datang",
    startAt: "2026-10-25T15:00:00+09:00",
    endAt: "2026-11-05T14:59:59+09:00",
    bannerImageBg: "from-zinc-950 via-neutral-900 to-rose-950",
    isRecommended: true,
    tags: ["Debut Ave Mujica", "Limited Edition", "Dual Attribute"],
    description:
      "Banner misterius bertema panggung topeng boneka gothic. Memperkenalkan debut spektakuler kartu Doloris (Uika Misumi) dengan visual sinematik eksklusif.",
    pickupRates: {
      maxRarityRate: "3.000%",
      star3Rate: "8.500%",
      star2Rate: "88.500%",
      featuredTotalRate: "1.000%",
      isDoubleRate: false,
    },
    pitySystem: {
      sealPerPull: 1,
      pityThreshold: 300,
      exchangeItem: "★4 Uika Misumi [Doloris Sang Ratu Topeng]",
      rules:
        "Tersedia fitur Pasang Pengingat agar kamu tidak ketinggalan saat banner resmi dibuka pada 25 Oktober 2026.",
    },
    cost: {
      single: 250,
      tenPull: 2500,
    },
    featuredCharacters: [
      {
        id: "char-uika-misumi",
        name: "Uika Misumi (Doloris)",
        cardTitle: "Malam Boneka Tanpa Jiwa",
        rarity: 4,
        attribute: "Cool",
        bandName: "Ave Mujica",
        role: "Guitar & Vocal",
        pickupRate: "0.700%",
        avatarBg: "from-slate-700 to-zinc-900",
        skillName: "Topeng Sandiwara Abadi",
        skillType: "Score Up",
        skillBoost: "+130% Score Up",
      },
    ],
  },
  {
    id: "gacha-expired-summer-splash",
    title: "Summer Splash Resort Paradise Gacha",
    japaneseTitle: "サマースプラッシュパラダイス",
    category: "Limited Event",
    status: "Selesai",
    startAt: "2026-09-15T15:00:00+09:00",
    endAt: "2026-09-30T14:59:59+09:00",
    bannerImageBg: "from-blue-950 via-cyan-900 to-sky-950",
    isRecommended: false,
    tags: ["Musim Panas", "Arsip Banner", "Telah Berakhir"],
    description:
      "Banner edisi liburan musim panas pantai bersama personil Pastel＊Palettes dan Hello, Happy World!. Banner ini telah selesai dan diarsipkan.",
    pickupRates: {
      maxRarityRate: "3.000%",
      star3Rate: "8.500%",
      star2Rate: "88.500%",
      featuredTotalRate: "0.700%",
      isDoubleRate: false,
    },
    pitySystem: {
      sealPerPull: 1,
      pityThreshold: 300,
      exchangeItem: "★4 Aya Maruyama [Semilir Ombak Tropis]",
      rules: "Banner ini telah ditutup. Tunggu pengumuman Rerun tahun berikutnya.",
    },
    cost: {
      single: 250,
      tenPull: 2500,
    },
    featuredCharacters: [],
  },
];

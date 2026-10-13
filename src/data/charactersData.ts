export interface Character {
  id: string;
  name: string;
  japaneseName: string;
  bandId: string;
  bandName: string;
  role: "Vocal" | "Guitar" | "Bass" | "Drums" | "Keyboard" | "DJ" | "Violin";
  attribute: "Power" | "Pure" | "Cool" | "Happy";
  rarity: 4 | 5;
  stats: {
    hp: number;
    performance: number;
    technique: number;
    visual: number;
    total: number;
  };
  skill: {
    name: string;
    description: string;
    type: "Score Up" | "Recovery" | "Accuracy / Lock";
    boostValue: string;
  };
  bio: string;
  color: string;
  avatarBg: string;
}

export interface Band {
  id: string;
  name: string;
  japaneseName: string;
  theme: string;
  description: string;
  color: string;
  membersCount: number;
}

export const BANDS_DATA: Band[] = [
  {
    id: "poppin-party",
    name: "Poppin'Party",
    japaneseName: "ポッピン パーティー",
    theme: "from-pink-500 to-rose-500",
    description: "Band SMA Hanasakigawa yang dibentuk oleh Kasumi Toyama untuk mencari kilauan bintang 'Kira-Kira Doki-Doki'. Aliran musik pop-rock ceria dan penuh energi persahabatan.",
    color: "#ff3377",
    membersCount: 5,
  },
  {
    id: "afterglow",
    name: "Afterglow",
    japaneseName: "アフターグロウ",
    theme: "from-red-500 to-amber-600",
    description: "Lima teman masa kecil yang membentuk band untuk menjaga ikatan mereka tetap sama selamanya di bawah langit senja. Aliran melodic punk-rock penuh semangat.",
    color: "#e62233",
    membersCount: 5,
  },
  {
    id: "pastel-palettes",
    name: "Pastel＊Palettes",
    japaneseName: "パステル パレット",
    theme: "from-cyan-400 to-teal-500",
    description: "Band idola bentukan agensi bakat yang berhasil membuktikan kemampuan musik instrumental sejati mereka kepada publik. Musik idol-pop manis dengan koreografi rapi.",
    color: "#00d4c8",
    membersCount: 5,
  },
  {
    id: "roselia",
    name: "Roselia",
    japaneseName: "ロゼリア",
    theme: "from-indigo-600 to-purple-700",
    description: "Band gothic rock beraliran symphonic virtuoso yang dipimpin oleh Yukina Minato dengan dedikasi mutlak untuk mencapai puncak panggung tertinggi.",
    color: "#3344aa",
    membersCount: 5,
  },
  {
    id: "hello-happy-world",
    name: "Hello, Happy World!",
    japaneseName: "ハロー、ハッピーワールド！",
    theme: "from-amber-400 to-yellow-500",
    description: "Dibentuk oleh Kokoro Tsurumaki dengan misi mulia 'Membuat seluruh dunia tersenyum lewat musik'. Musik brass marching ceria berpadu parade sirkus megah.",
    color: "#ffbb00",
    membersCount: 5,
  },
  {
    id: "morfonica",
    name: "Morfonica",
    japaneseName: "モルフォニカ",
    theme: "from-sky-400 to-blue-600",
    description: "Band simfoni biola dari akademi bergengsi Tsukinomori yang mewujudkan metamorfosis indah dari kepompong menjadi kupu-kupu bersayap cahaya.",
    color: "#33aaff",
    membersCount: 5,
  },
  {
    id: "raise-a-suilen",
    name: "RAISE A SUILEN",
    japaneseName: "レイズ ア スイレン",
    theme: "from-teal-400 to-emerald-600",
    description: "Band electro-rock bertenaga tinggi yang menyatukan musisi studio profesional dengan bassline tebal, synthesizer futuristik, dan vokal bertenaga badai.",
    color: "#00bb88",
    membersCount: 5,
  },
  {
    id: "mygo",
    name: "MyGO!!!!!",
    japaneseName: "マイゴ",
    theme: "from-blue-600 to-slate-700",
    description: "Band punk emo alternatif beranggotakan gadis-gadis yang tersesat, mengekspresikan jeritan hati yang tulus, kegelisahan, dan keberanian untuk tetap melangkah.",
    color: "#2255bb",
    membersCount: 5,
  },
  {
    id: "ave-mujica",
    name: "Ave Mujica",
    japaneseName: "アヴェ ムジカ",
    theme: "from-violet-900 to-slate-900",
    description: "Band theatrical metal berbalut topeng misterius yang menampilkan drama panggung teatrikal gelap nan megah penuh pesona distopia.",
    color: "#441166",
    membersCount: 5,
  },
];

export const CHARACTERS_DATA: Character[] = [
  // 1. Kasumi Toyama
  {
    id: "char-kasumi-toyama",
    name: "Kasumi Toyama",
    japaneseName: "戸山 香澄",
    bandId: "poppin-party",
    bandName: "Poppin'Party",
    role: "Vocal",
    attribute: "Power",
    rarity: 5,
    stats: { hp: 1000, performance: 11200, technique: 10800, visual: 12400, total: 34400 },
    skill: {
      name: "Starry Beat Connection",
      description: "Meningkatkan skor 115% selama 7 detik (menjadi 130% jika note berakurasi PERFECT).",
      type: "Score Up",
      boostValue: "+130%",
    },
    bio: "Siswa SMA Hanasakigawa yang ceria dan selalu mencari bunyi gemerlap 'Kira-Kira Doki-Doki'. Gitaris bintang merah dan vokalis utama Poppin'Party.",
    color: "#ff3377",
    avatarBg: "from-pink-500 to-rose-600",
  },
  // 2. Yukina Minato
  {
    id: "char-yukina-minato",
    name: "Yukina Minato",
    japaneseName: "湊 友希那",
    bandId: "roselia",
    bandName: "Roselia",
    role: "Vocal",
    attribute: "Cool",
    rarity: 5,
    stats: { hp: 950, performance: 12800, technique: 11900, visual: 11500, total: 36200 },
    skill: {
      name: "Neo-Aspect Resonance",
      description: "Meningkatkan skor 120% selama 7 detik dan memulihkan Life +250 jika life di bawah 600.",
      type: "Score Up",
      boostValue: "+120%",
    },
    bio: "Vokalis berkarisma tinggi yang memimpin Roselia dengan ketegasan mutlak. Memiliki suara melengking megah dan kecintaan rahasia terhadap kucing.",
    color: "#3344aa",
    avatarBg: "from-indigo-600 to-purple-800",
  },
  // 3. Ran Mitake
  {
    id: "char-ran-mitake",
    name: "Ran Mitake",
    japaneseName: "美竹 蘭",
    bandId: "afterglow",
    bandName: "Afterglow",
    role: "Guitar",
    attribute: "Power",
    rarity: 5,
    stats: { hp: 980, performance: 12100, technique: 11500, visual: 11200, total: 34800 },
    skill: {
      name: "Scarlet Sky Chord",
      description: "Meningkatkan skor 115% selama 7 detik dan mengubah note GREAT menjadi PERFECT selama 5 detik.",
      type: "Score Up",
      boostValue: "+115%",
    },
    bio: "Gadis pendiam keturunan keluarga penata bunga tradisional. Di balik sikap dinginnya, Ran sangat peduli dan setia kawan kepada 4 sahabat masa kecilnya di Afterglow.",
    color: "#e62233",
    avatarBg: "from-red-600 to-amber-700",
  },
  // 4. Aya Maruyama
  {
    id: "char-aya-maruyama",
    name: "Aya Maruyama",
    japaneseName: "丸山 彩",
    bandId: "pastel-palettes",
    bandName: "Pastel＊Palettes",
    role: "Vocal",
    attribute: "Pure",
    rarity: 4,
    stats: { hp: 920, performance: 10400, technique: 11100, visual: 10800, total: 32300 },
    skill: {
      name: "Shuwatch! Dream Glow",
      description: "Meningkatkan skor 100% selama 7 detik. Mengurangi kerusakan life jika terjadi Miss note.",
      type: "Score Up",
      boostValue: "+100%",
    },
    bio: "Gadis pekerja keras yang telah lama menjadi idola magang sebelum debut. Mudah menangis di atas panggung tetapi pantang menyerah membahagiakan penggemar.",
    color: "#ff88aa",
    avatarBg: "from-pink-400 to-cyan-500",
  },
  // 5. Kokoro Tsurumaki
  {
    id: "char-kokoro-tsurumaki",
    name: "Kokoro Tsurumaki",
    japaneseName: "弦巻 こころ",
    bandId: "hello-happy-world",
    bandName: "Hello, Happy World!",
    role: "Vocal",
    attribute: "Happy",
    rarity: 5,
    stats: { hp: 1100, performance: 11600, technique: 11200, visual: 12900, total: 35700 },
    skill: {
      name: "World Smile Parade",
      description: "Meningkatkan skor 110% selama 7 detik dan memulihkan Life +450 secara instan.",
      type: "Recovery",
      boostValue: "+110% + Heal",
    },
    bio: "Putri tunggal dari keluarga konglomerat kaya raya yang memiliki mata berbinar dan energi tak terbatas. Yakin bahwa musik dapat membuat seluruh dunia tersenyum.",
    color: "#ffbb00",
    avatarBg: "from-amber-400 to-yellow-600",
  },
  // 6. Mashiro Kurata
  {
    id: "char-mashiro-kurata",
    name: "Mashiro Kurata",
    japaneseName: "倉田 ましろ",
    bandId: "morfonica",
    bandName: "Morfonica",
    role: "Vocal",
    attribute: "Cool",
    rarity: 4,
    stats: { hp: 900, performance: 10600, technique: 10900, visual: 10700, total: 32200 },
    skill: {
      name: "Blue Cocoon Awakening",
      description: "Meningkatkan skor 100% selama 7 detik dan menjaga combo streak jika note GREAT.",
      type: "Accuracy / Lock",
      boostValue: "+100%",
    },
    bio: "Siswa sekolah Tsukinomori yang awalnya pemalu dan kurang percaya diri. Menemukan keberanian berekspresi lewat lirik lagu dan alunan biola Morfonica.",
    color: "#33aaff",
    avatarBg: "from-sky-400 to-blue-700",
  },
  // 7. LAYER (Rei Wakana)
  {
    id: "char-layer",
    name: "LAYER (Rei Wakana)",
    japaneseName: "レイヤ / 和奏 レイ",
    bandId: "raise-a-suilen",
    bandName: "RAISE A SUILEN",
    role: "Bass",
    attribute: "Power",
    rarity: 5,
    stats: { hp: 1050, performance: 12900, technique: 11800, visual: 11900, total: 36600 },
    skill: {
      name: "Unstoppable Drive",
      description: "Meningkatkan skor 125% selama 7 detik jika Total Band Power melebihi 200.000.",
      type: "Score Up",
      boostValue: "+125%",
    },
    bio: "Musisi panggung berpengalaman dengan teknik vokal rock luar biasa dan bassline presisi. Sahabat masa kecil Tae Hanazono.",
    color: "#00bb88",
    avatarBg: "from-teal-500 to-emerald-800",
  },
  // 8. Tomori Takamatsu
  {
    id: "char-tomori-takamatsu",
    name: "Tomori Takamatsu",
    japaneseName: "高松 燈",
    bandId: "mygo",
    bandName: "MyGO!!!!!",
    role: "Vocal",
    attribute: "Pure",
    rarity: 5,
    stats: { hp: 970, performance: 12300, technique: 12100, visual: 11200, total: 35600 },
    skill: {
      name: "Mayoiuta Scream",
      description: "Meningkatkan skor 120% selama 7 detik. Mengubah note Good/Great menjadi PERFECT.",
      type: "Score Up",
      boostValue: "+120%",
    },
    bio: "Gadis yang gemar mengumpulkan daun perban dan batu-batu kecil. Vokal emosionalnya menyampaikan jeritan kata-kata dari catatan hariannya yang terdalam.",
    color: "#2255bb",
    avatarBg: "from-blue-600 to-slate-800",
  },
  // 9. Sayo Hikawa
  {
    id: "char-sayo-hikawa",
    name: "Sayo Hikawa",
    japaneseName: "氷川 紗夜",
    bandId: "roselia",
    bandName: "Roselia",
    role: "Guitar",
    attribute: "Cool",
    rarity: 5,
    stats: { hp: 960, performance: 11900, technique: 12600, visual: 11400, total: 35900 },
    skill: {
      name: "Azure Perfectionist",
      description: "Meningkatkan skor 115% selama 7 detik. Note PERFECT bernilai +125%.",
      type: "Score Up",
      boostValue: "+125%",
    },
    bio: "Gitaris Roselia yang memiliki disiplin latihan keras dan tekun. Menghargai dedikasi dan teknik tinggi di atas panggung.",
    color: "#3355aa",
    avatarBg: "from-blue-600 to-indigo-900",
  },
  // 10. Tae Hanazono (O-Tae)
  {
    id: "char-tae-hanazono",
    name: "Tae Hanazono",
    japaneseName: "花園 たえ",
    bandId: "poppin-party",
    bandName: "Poppin'Party",
    role: "Guitar",
    attribute: "Happy",
    rarity: 5,
    stats: { hp: 990, performance: 12200, technique: 11800, visual: 11700, total: 35700 },
    skill: {
      name: "Rabbit Hop Harmony",
      description: "Meningkatkan skor 115% selama 7 detik dan memulihkan Life +300.",
      type: "Score Up",
      boostValue: "+115%",
    },
    bio: "Gitaris andal Poppin'Party yang bermain gitar sejak kecil dan sangat menyukai kelinci. Kerap memukau dengan melodi solo gitar blues yang spontan.",
    color: "#3377dd",
    avatarBg: "from-blue-500 to-cyan-700",
  },
];

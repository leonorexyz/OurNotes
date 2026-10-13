export interface GuideItem {
  id: string;
  section: "pemula" | "tips" | "event" | "faq";
  title: string;
  summary: string;
  readTime: string;
  difficulty?: "Dasar" | "Menengah" | "Lanjutan";
  steps?: { title: string; desc: string }[];
  tags: string[];
  featuredBandOrCharacter?: string;
  iconName: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const GUIDE_SECTIONS = [
  {
    id: "pemula",
    title: "Panduan Pemula",
    subtitle: "Langkah awal memahami ritme, band, dan menu penting game",
    icon: "BookOpen",
    count: 4,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "tips",
    title: "Tips & Trik",
    subtitle: "Cara main harian efisien, hemat flame, dan maksimalkan score",
    icon: "Lightbulb",
    count: 4,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "event",
    title: "Panduan Event",
    subtitle: "Strategi grinding event point, rotasi tier, dan hadiah eksklusif",
    icon: "Trophy",
    count: 3,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "faq",
    title: "Pertanyaan Umum (FAQ)",
    subtitle: "Jawaban ringkas seputar pertanyaan teknis dan gameplay terpopuler",
    icon: "HelpCircle",
    count: 6,
    color: "from-pink-500 to-rose-600",
  },
] as const;

export const GUIDES_DATA: GuideItem[] = [
  // 1. PANDUAN PEMULA
  {
    id: "pemula-langkah-awal",
    section: "pemula",
    title: "Langkah Awal: Menyiapkan Akun & Selesaikan Tutorial",
    summary: "Panduan pertama setelah mengunduh game. Pahami navigasi beranda, klaim hadiah pra-registrasi, dan sesuaikan pengaturan ritme agar nyaman.",
    readTime: "4 mnt",
    difficulty: "Dasar",
    tags: ["Tutorial", "Akun Baru", "Pengaturan"],
    featuredBandOrCharacter: "Poppin'Party",
    iconName: "Compass",
    steps: [
      {
        title: "1. Selesaikan Tutorial Live Pertama",
        desc: "Ikuti panduan ketukan dasar (Tap, Flick, Hold, dan Slide). Jangan panik jika miss, tutorial ini tanpa penalti.",
      },
      {
        title: "2. Sesuaikan Note Speed & Timing",
        desc: "Masuk ke Pengaturan Live. Kecepatan default (5.0) biasanya terlalu lambat. Coba naikkan ke rentang 8.5 - 9.5 untuk membaca note lebih mudah.",
      },
      {
        title: "3. Klaim Hadiah Kotak Masuk (Present Box)",
        desc: "Ambil Stars dan tiket gacha awal dari event pembukaan sebelum melakukan summon pertama.",
      },
      {
        title: "4. Kaitkan Akun Game",
        desc: "Segera tautkan akun ke ID login atau buat transfer code di menu Pengaturan Akun agar progres tidak hilang.",
      },
    ],
  },
  {
    id: "pemula-panduan-reroll",
    section: "pemula",
    title: "Panduan Reroll: Target Kartu Bintang 4 & 5 Awal",
    summary: "Apakah perlu reroll? Ketahui karakter tier atas dengan skill Score Boost 100%+ atau Recovery yang mempermudah fase awal permainan.",
    readTime: "5 mnt",
    difficulty: "Dasar",
    tags: ["Gacha", "Reroll", "Tier List"],
    featuredBandOrCharacter: "Roselia",
    iconName: "Sparkles",
    steps: [
      {
        title: "1. Prioritaskan Kartu Score Up",
        desc: "Karakter dengan skill 'Score Boost 110% - 130%' memberikan kontribusi tertinggi pada live score solo maupun multi-live.",
      },
      {
        title: "2. Alternatif: Kartu Life Recovery",
        desc: "Jika kamu pemain pemula di genre rhythm game, memiliki minimal 1 healer mempermudah bertahan di tingkat kesulitan Expert.",
      },
      {
        title: "3. Waktu Paling Efisien",
        desc: "Reroll disarankan saat periode banner Dream Festival atau Super Kirameki karena rate bintang 4/5 berlipat ganda.",
      },
    ],
  },
  {
    id: "pemula-mekanik-live",
    section: "pemula",
    title: "Mengenal Jenis Note & Akurasi Timing (Perfect/Great)",
    summary: "Kuasai perbedaan Tap biasa, Slide note berkelanjutan, dan Flick note ke segala arah untuk menjaga Full Combo.",
    readTime: "6 mnt",
    difficulty: "Dasar",
    tags: ["Gameplay", "Full Combo", "Mekanik"],
    featuredBandOrCharacter: "Afterglow",
    iconName: "Music",
    steps: [
      {
        title: "1. Tap Note Biasa",
        desc: "Ketuk tepat saat note menyentuh garis penentu. Akurasi 'Perfect' memberikan skor penuh dan menjaga streak combo.",
      },
      {
        title: "2. Flick Note (Panah Merah/Pink)",
        desc: "Geser jari ke arah atas, kiri, atau kanan. Usahakan gesekan pendek dan tegas agar sensor membaca dengan akurat.",
      },
      {
        title: "3. Hold & Long Slide Note",
        desc: "Tahan jari pada lane hingga garis berakhir, dan ikuti alur lekukan note jika berpindah lane.",
      },
    ],
  },
  {
    id: "pemula-susun-tim-pertama",
    section: "pemula",
    title: "Membangun Formasi Band Pertama yang Efektif",
    summary: "Kombinasi 5 anggota band dalam satu formasi. Ketahui pengaruh kesamaan Band dan Atribut untuk melipatgandakan Total Band Power.",
    readTime: "4 mnt",
    difficulty: "Dasar",
    tags: ["Team Building", "Band Power", "Sinergi"],
    featuredBandOrCharacter: "Pastel＊Palettes",
    iconName: "Users",
    steps: [
      {
        title: "1. Letakkan Kartu Terbaik di Posisi Center",
        desc: "Skill karakter Center aktif di awal dan akhir sesi solo, serta menjadi kartu perwakilanmu di Multi-Live.",
      },
      {
        title: "2. Samakan Atribut atau Band",
        desc: "Mengumpulkan karakter dari atribut yang sama (Power/Pure/Cool/Happy) memudahkan sinergi dengan item area.",
      },
    ],
  },

  // 2. TIPS & TRIK
  {
    id: "tips-efisiensi-flame",
    section: "tips",
    title: "Manajemen Live Boost (Flame): Main Efisien Tanpa Boros",
    summary: "Maksimalkan perolehan EXP, event point, dan koin dengan mengatur penggunaan Live Boost multiplier 1x, 2x, atau 3x.",
    readTime: "4 mnt",
    difficulty: "Menengah",
    tags: ["Efisiensi", "Stamina", "Grinding"],
    iconName: "Zap",
    steps: [
      {
        title: "1. Formula Efisiensi Tertinggi (1x Boost)",
        desc: "Penggunaan 1x Boost memberikan rasio reward per flame tertinggi. Gunakan saat ingin mengumpulkan bahan latihan maksimal.",
      },
      {
        title: "2. Hemat Waktu untuk Event (3x Boost)",
        desc: "Gunakan 3x boost saat waktu bermain terbatas untuk mengejar target skor event tanpa membiarkan flame meluap (cap 10/10).",
      },
      {
        title: "3. Level Up Refresh",
        desc: "Setiap naik level akun, Live Boost terisi ulang otomatis 10 flame. Perhitungkan sisa EXP agar tidak menyia-nyiakan regen alami.",
      },
    ],
  },
  {
    id: "tips-upgrade-area-items",
    section: "tips",
    title: "Pentingnya Area Items & Efek Stat Tersembunyi",
    summary: "Jangan remehkan dekorasi di studio dan kafetaria! Item instrumen dan poster memberikan bonus stat pasif hingga puluhan persen.",
    readTime: "5 mnt",
    difficulty: "Menengah",
    tags: ["Area Items", "Studio", "Stat Boost"],
    iconName: "Sparkles",
    steps: [
      {
        title: "1. Upgrade Instrumen Musik Band Favorit",
        desc: "Setiap alat musik (Gitar, Bass, Drum, Keyboard, Mic) menaikkan stat seluruh anggota band terkait hingga 10% di level maksimal.",
      },
      {
        title: "2. Pasang Poster Atribut yang Sesuai",
        desc: "Jika tim utamamu bertipe Pure, pasang Poster Pure di studio untuk lonjakan total band power instan.",
      },
      {
        title: "3. Prioritaskan Koin Emas & Shard Kristal",
        desc: "Upgrade level 5-6 membutuhkan koin dalam jumlah besar. Ikuti hari khusus Gold Room di Multi-Live.",
      },
    ],
  },
  {
    id: "tips-multi-live-etiquette",
    section: "tips",
    title: "Etika & Trik Mendapat Skor Tertinggi di Multi-Live",
    summary: "Bermain bersama 4 pemain lain memberikan reward 3x lebih banyak dibanding Solo Live. Simak tips memilih room dan lagu yang optimal.",
    readTime: "3 mnt",
    difficulty: "Menengah",
    tags: ["Multi-Live", "Co-op", "Skor"],
    iconName: "Share2",
    steps: [
      {
        title: "1. Pilih Tingkat Kesulitan yang Nyaman",
        desc: "Lebih baik meraih Full Combo di Hard daripada gagal (No Life) di Expert, karena kematian menurunkan kontribusi skor tim secara drastis.",
      },
      {
        title: "2. Room Publik vs Grand Room",
        desc: "Segera masuki Grand Room (Band Power 180k+) begitu tim mencukupi untuk jaminan pemain dengan center score booster.",
      },
    ],
  },
  {
    id: "tips-latihan-skill-kartu",
    section: "tips",
    title: "Prioritas Latihan Kartu: Level, Skill, & Special Training",
    summary: "Alur paling hemat resource untuk memaksimalkan potensi kartu bintang 4 dan 5 baru.",
    readTime: "5 mnt",
    difficulty: "Menengah",
    tags: ["Pelatihan", "Skill Ticket", "Resource"],
    iconName: "TrendingUp",
    steps: [
      {
        title: "1. Capai Level Maksimal Kartu Terlebih Dahulu",
        desc: "Gunakan Practice Ticket hijau/emas hingga mencapai batas level pertama.",
      },
      {
        title: "2. Buka Special Training (Evolusi Gambar)",
        desc: "Membuka Special Training meningkatkan batas level tambahan +10 dan mendongkrak stat secara masif.",
      },
      {
        title: "3. Buka Cerita Karakter (Episode 1 & Memorial)",
        desc: "Membaca dua episode cerita kartu memberikan tambahan stat permanen plus bonus Stars gratis!",
      },
    ],
  },

  // 3. PANDUAN EVENT
  {
    id: "event-format-dan-tipe",
    section: "event",
    title: "Mengenal 3 Format Utama Event: Marathon, VS Live, & Live Goals",
    summary: "Setiap event mingguan memiliki mekanisme unik. Ketahui cara mengumpulkan Event Point dan Event Badge untuk ditukar di toko.",
    readTime: "5 mnt",
    difficulty: "Menengah",
    tags: ["Format Event", "Badge Exchange", "Hadiah"],
    iconName: "Flag",
    steps: [
      {
        title: "1. Normal Marathon Event",
        desc: "Mainkan Multi-Live biasa untuk mengumpulkan poin dan badge. Format paling ramah bagi pemain santai.",
      },
      {
        title: "2. VS Live (Kompetisi 5 Pemain)",
        desc: "Bertarung langsung mencetak skor tertinggi di room. Center skill kartu kamu aktif berkali-kali secara mandiri.",
      },
      {
        title: "3. Live Goals Challenge",
        desc: "Selesaikan misi spesifik seperti mencapai combo tertentu, score target, atau bermain lagu dengan akurasi Perfect tinggi.",
      },
    ],
  },
  {
    id: "event-bonus-karakter",
    section: "event",
    title: "Strategi Membangun Tim Event: Maksimalkan Multiplier Poin",
    summary: "Bonus hingga +250% event point dengan mencocokkan Karakter Unggulan dan Atribut Event.",
    readTime: "4 mnt",
    difficulty: "Lanjutan",
    tags: ["Event Bonus", "Multiplier", "Strategi"],
    iconName: "Award",
    steps: [
      {
        title: "1. Cek 5 Karakter & 1 Atribut Penentu",
        desc: "Setiap karakter bertanda bonus memberikan +20% poin, dan kecocokan atribut memberikan tambahan +20%. Jika keduanya cocok, total bonus melonjak hingga 50% per kartu!",
      },
      {
        title: "2. Keseimbangan Power vs Bonus Poin",
        desc: "Jika kartu bonus bertipe bintang 2 atau 3, uji coba apakah total poin lebih tinggi daripada memakai tim bintang 5 tanpa bonus.",
      },
    ],
  },
  {
    id: "event-reward-toko",
    section: "event",
    title: "Prioritas Belanja di Event Badge Exchange Shop",
    summary: "Jangan sampai salah tukar badge! Daftar barang langka yang wajib kamu ambil sebelum event berakhir.",
    readTime: "3 mnt",
    difficulty: "Dasar",
    tags: ["Badge Shop", "Kartu Gratis", "Rare Items"],
    iconName: "Gift",
    steps: [
      {
        title: "1. Wajib: Karakter Event Bintang 3 Eksklusif",
        desc: "Karakter event gratis hanya bisa didapat selama event berlangsung dan jarang dirilis ulang dalam waktu dekat.",
      },
      {
        title: "2. Wajib: Miracle Crystal & Skill Ticket Emas",
        desc: "Material langka yang sulit didapat dari drop biasa, sangat vital untuk evolusi kartu bintang 5.",
      },
      {
        title: "3. Sisa Badge: Tukar Koin atau Shard Atribut",
        desc: "Habiskan sisa poin sebelum toko ditutup beberapa hari setelah event usai.",
      },
    ],
  },

  // 4. FAQ
  {
    id: "faq-section-guide",
    section: "faq",
    title: "Pusat Bantuan & Tanya Jawab Komunitas Our Notes",
    summary: "Rangkuman jawaban cepat untuk keraguan yang paling sering ditanyakan para pemain Bang Dream! Our Notes.",
    readTime: "3 mnt",
    difficulty: "Dasar",
    tags: ["FAQ", "Solusi", "Komunitas"],
    iconName: "HelpCircle",
    steps: [],
  },
];

export const FAQ_LIST: FaqItem[] = [
  {
    id: "faq-1",
    category: "Gacha & Akun",
    question: "Bagaimana sistem Pity (Jaminan) pada gacha Our Notes?",
    answer: "Setiap tarikan memberi kamu 1 Gacha Seal. Kumpulkan 300 Gacha Seal untuk menukar langsung karakter bintang 5 unggulan di banner tersebut. Pada banner kolaborasi tertentu, syarat pity bisa turun menjadi 200 atau 250 seal.",
  },
  {
    id: "faq-2",
    category: "Teknis & Pengaturan",
    question: "Layar terasa delay / ketukan sering Great padahal pas di note, bagaimana mengatasinya?",
    answer: "Gunakan fitur Sound Calibration di menu Options > Live. Matikan juga opsi efek Cut-in karakter dan Skill Window selama live agar framerate tetap stabil 60/120 FPS tanpa patah-patah.",
  },
  {
    id: "faq-3",
    category: "Gameplay",
    question: "Apakah bermain lagu tingkat kesulitan Expert selalu memberikan poin lebih banyak dibanding Hard?",
    answer: "Tidak selalu. Skor akhir bergantung pada kelipatan Combo dan akurasi Perfect. Full Combo di tingkat Hard sering kali menghasilkan skor lebih tinggi daripada banyak Miss di tingkat Expert.",
  },
  {
    id: "faq-4",
    category: "Team Building",
    question: "Apa bedanya Center Skill dengan Skill anggota lainnya?",
    answer: "Center Skill adalah skill dari karakter yang ditaruh di slot tengah. Di mode Solo, skill center akan aktif dua kali (di awal dan pada segmen Fever/Climax). Di Multi-Live, hanya Center kamu yang akan dipanggil untuk mensupport ruang live bersama pemain lain.",
  },
  {
    id: "faq-5",
    category: "Gacha & Akun",
    question: "Apakah Stars gratisan dan Stars berbayar (Paid Stars) memiliki fungsi yang berbeda?",
    answer: "Paid Stars dapat dipakai untuk gacha harian diskon (60 Paid Stars) serta banner jaminan Bintang 5 berbayar (Guaranteed Gacha). Untuk banner reguler dan event, fungsinya identik dengan Stars gratisan.",
  },
  {
    id: "faq-6",
    category: "Event",
    question: "Berapa lama regenerasi 1 Live Boost (Flame) yang habis?",
    answer: "1 Flame terisi ulang secara otomatis setiap 30 menit. Flame akan berhenti beregenerasi jika sudah mencapai batas maksimal 10 flame.",
  },
];

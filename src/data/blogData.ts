export interface BlogPost {
  id: string; // slug
  title: string;
  excerpt: string;
  content: string;
  category: "Tips & Gameplay" | "Meta & Tim" | "Lore & Karakter" | "Gacha & Stars" | "Event & Skor";
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
    badgeColor: string;
  };
  publishedAt: string;
  readTime: string;
  likes: number;
  commentsCount: number;
  views: number;
  isFeatured: boolean;
  coverImageBg: string;
}

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: "tips-all-perfect-lagu-level-27-expert",
    title: "Tips Mencapai All Perfect pada Lagu Level 27+ Expert & Special Tanpa Stres",
    excerpt: "Pelajari konfigurasi kecepatan note optimal, kalibrasi timing offset audio bluetooth, serta teknik jari telunjuk vs jempol untuk menaklukkan note flick beruntun.",
    content: `Banyak pemain ritme Bang Dream! merasa mentok di tingkat kesulitan Expert level 26-27. Artikel ini merangkum latihan fundamental, pengaturan kecepatan 10.2 - 10.8, serta tips meredam getaran layar saat flick ganda.

### 1. Kalibrasi Kecepatan Note (Note Speed)
Rata-rata pro player menggunakan kecepatan antara 10.3 hingga 10.6. Kecepatan tinggi memperlebar jarak visual antar-note, sehingga otak lebih mudah membedakan ritme 16th beat daripada kecepatan lambat (misal 8.0) yang membuat layar terlalu padat.

### 2. Atasi Bluetooth Delay dengan Timing Offset
Bila menggunakan TWS atau earphone nirkabel, selalu masuk ke Menu Pengaturan > Suara/Audio > Kalibrasi Ketukan. Setel timing offset berkisar antara +2 hingga +5. Rekomendasi terbaik tetap menggunakan IEM berkabel dengan jack 3.5mm untuk latency 0ms.

### 3. Posisi Tangan: Jempol vs Telunjuk
- **Jempol:** Sangat fleksibel dimainkan di mana saja (di kasur, kereta), namun pergelangan tangan lebih cepat lelah saat tangga note slide cepat.
- **Telunjuk (Flat Surface):** Pilihan nomor satu untuk level 28+ karena menggunakan gravitasi meja dan 4 jari pembantu untuk note tap beruntun.`,
    category: "Tips & Gameplay",
    tags: ["Expert", "All Perfect", "Rhythm", "Tips Pemula"],
    author: {
      name: "Rui 'RhythmGod'",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      role: "Pro Rhythm Player",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    publishedAt: "12 Oktober 2026",
    readTime: "5 Menit Baca",
    likes: 218,
    commentsCount: 42,
    views: 1840,
    isFeatured: true,
    coverImageBg: "from-blue-600 via-indigo-600 to-purple-700",
  },
  {
    id: "analisis-meta-tim-pure-poppin-party",
    title: "Analisis Meta Sinergi Tim Pure Poppin'Party: Skor 2.5 Juta di Live Show",
    excerpt: "Panduan racikan kartu Kasumi, Tae, Rimi, Saaya, dan Arisa dengan atribut Pure 100% serta upgrade instrumen studio untuk skor maksimal di event Marathon.",
    content: `Kombinasi 5 anggota Poppin'Party berseragam atribut Pure saat ini merupakan salah satu formasi tertua yang paling stabil di Bang Dream! Our Notes. Berkat dorongan instrumen studio Ryuseido (+20% stat band PoPiPa dan +10% atribut Pure), total Power tim bisa menembus 320.000!

### Formasi Kartu Inti:
1. **Kasumi Toyama ★4 [Melodi Senja]**: Leader skill +130% score boost saat perfect tap.
2. **Tae Hanazono ★4 [Petikan Kelinci Biru]**: Life recovery + 110% boost.
3. **Rimi Ushigome ★4 [Choco Cornet Ceria]**: Pure stat monster (62.000 total).
4. **Saaya Yamabuki ★4 [Roti Hangat Pagi Hari]**: Skill level 5 7.0 detik.
5. **Arisa Ichigaya ★4 [Bonsai & Keyboard]**: Visual stat booster.

Dengan sinergi ini, kamu akan mudah mengamankan peringkat top 1.000 di papan peringkat event Marathon mingguan.`,
    category: "Meta & Tim",
    tags: ["Poppin'Party", "Pure", "Team Building", "Score Meta"],
    author: {
      name: "Aoi Kiryu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      role: "Team Theorycrafter",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
    publishedAt: "11 Oktober 2026",
    readTime: "6 Menit Baca",
    likes: 174,
    commentsCount: 31,
    views: 1420,
    isFeatured: false,
    coverImageBg: "from-emerald-600 via-teal-600 to-cyan-700",
  },
  {
    id: "rekap-cerita-ave-mujica-dan-mygo-lore",
    title: "Evolusi Musik dan Konflik Emosional: Kupas Tuntas Lore MyGO!!!!! & Ave Mujica",
    excerpt: "Menyelami latar belakang masa lalu Sakiko Togawa, kedalaman lirik Tomori Takamatsu, dan misteri topeng para personil Ave Mujica di Our Notes.",
    content: `Anime dan adaptasi cerita di game Bang Dream! Our Notes memberikan perspektif baru tentang perpecahan CRYCHIC yang melahirkan dua band dengan dinamika bertolak belakang: MyGO!!!!! yang menyanyikan jeritan hati yang tersesat, dan Ave Mujica yang menyembunyikan identitas di balik opera teatrikal megah.

### 1. Filosofi Musik MyGO!!!!!
"Bahkan jika tersesat, kita terus melangkah." Lagu Haruhikage menjadi simbol rekonsiliasi yang pahit sekaligus kelahiran suara baru bagi Tomori dan kawan-kawan.

### 2. Misteri Ave Mujica: Topeng dan Kematian Masa Lalu
Sakiko Togawa (Oblivionis), Uika Misumi (Doloris), Mutsumi Wakaba (Mortis), Umiri Yahata (Timoris), dan Nyamu Yutenji (Amoris) menghadirkan elemen metal symphonic gelap yang belum pernah ada sebelumnya dalam sejarah Bang Dream!`,
    category: "Lore & Karakter",
    tags: ["Ave Mujica", "MyGO!!!!!", "Story Recap", "Lore"],
    author: {
      name: "Elena 'LoreGeek'",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      role: "Lore Master",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
    publishedAt: "09 Oktober 2026",
    readTime: "8 Menit Baca",
    likes: 312,
    commentsCount: 65,
    views: 2950,
    isFeatured: false,
    coverImageBg: "from-purple-700 via-pink-700 to-rose-800",
  },
  {
    id: "strategi-hemat-stars-kirafes-f2p",
    title: "Strategi Tabungan Stars F2P: Kapan Waktu Terbaik Menghabiskan Stars?",
    excerpt: "Jangan tergiur banner permanen biasa! Hitung siklus Kirafes 3 bulanan, maksimalkan Stars gratis dari Full Combo lagu, dan raih 300 Gacha Seal tanpa top up.",
    content: `Bagi pemain gratisan (Free to Play), Stars adalah sumber daya paling berharga. Menarik gacha di sembarang banner adalah kesalahan fatal nomor satu bagi pemula.

### Cara Mendapatkan 15.000+ Stars Gratis Per Bulan:
1. **Full Combo Lagu Baru:** Setiap lagu Normal, Hard, Expert, dan Special memberikan masing-masing 50 Stars untuk Rank S/SS dan Full Combo (Total 200 Stars per lagu).
2. **Membaca Episode Karakter 1 & 2:** Mengembangkan kartu ★2 dan ★3 membuka episode cerita yang masing-masing memberi 25 dan 50 Stars.
3. **Peringatan Top Event:** Selalu habiskan flame live di event mingguan untuk mengamankan 500-1.000 Stars tier reward.

### Aturan Emas Gacha:
Hanya lakukan roll saat **Kira-Kira Festival (Kirafes)** atau **Dream Festival (DoriFes)** karena rate ★4 digandakan dari 3% menjadi 6%!`,
    category: "Gacha & Stars",
    tags: ["F2P Guide", "Kirafes", "Stars Saving", "Gacha Spark"],
    author: {
      name: "Kenji Satou",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      role: "F2P Economist",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
    publishedAt: "08 Oktober 2026",
    readTime: "4 Menit Baca",
    likes: 198,
    commentsCount: 38,
    views: 2100,
    isFeatured: false,
    coverImageBg: "from-amber-600 via-orange-600 to-red-600",
  },
  {
    id: "panduan-event-marathon-vs-vs-live",
    title: "Perbedaan Format Event: Marathon vs VS Live vs Live Goals & Cara Meraih Rank Tinggi",
    excerpt: "Ketahui kebiasaan konsumsi Live Boost 2x vs 3x, bonus atribut 50%, dan strategi memaksimalkan event point per menit.",
    content: `Tiap minggu, Bang Dream! Our Notes menghadirkan format event yang berputar. Memahami mekanik tiap jenis event akan melipatgandakan perolehan poinmu.

### 1. Marathon Event (Classic)
- Fokus pada total event point dari Free Live dan Multi Live reguler.
- Efisiensi Live Boost terbaik: Gunakan **2 Boost (x5 Poin)** untuk efisiensi waktu, atau **1 Boost (x10 Poin)** untuk efisiensi EXP dan drop item maksimal.

### 2. VS Live
- Pemain bertanding skor langsung 5 orang dalam satu room.
- Posisi 1 hingga 5 menentukan bonus medali dan poin tambahan. Memerlukan susunan tim skor tinggi dan minim note Miss.

### 3. Live Goals (Tantangan Bertingkat)
- Selesaikan misi khusus seperti "Dapatkan skor 1.800.000 dengan Life tidak berkurang di bawah 800".`,
    category: "Event & Skor",
    tags: ["Event Guide", "Marathon", "VS Live", "Event Rank"],
    author: {
      name: "Maya Yamato Fans",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      role: "Event Tierer",
      badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    },
    publishedAt: "05 Oktober 2026",
    readTime: "5 Menit Baca",
    likes: 145,
    commentsCount: 19,
    views: 1350,
    isFeatured: false,
    coverImageBg: "from-rose-600 via-pink-600 to-purple-600",
  },
  {
    id: "panduan-upgrade-studio-ryuseido",
    title: "Urutan Prioritas Upgrade Item Studio di CiRCLE & Ryuseido Edogawa",
    excerpt: "Jangan buang gold dan koin sembarangan! Simak panduan mengutamakan instrumen band vs dekorasi flyer majalah untuk mendongkrak total power.",
    content: `Item area di CiRCLE dan Ryuseido memberikan bonus pasif permanen untuk seluruh pertunjukan live.

### Urutan Prioritas Paling Efisien:
1. **Instrumen Band Favoritmu (Lv 1 - 6):** Memberikan persentase boost terbesar untuk 5 personil band yang sama.
2. **Dekorasi Atribut (Bonsai, Air Mancur, Lampu):** Naikkan atribut yang paling banyak kamu miliki di tim utama.
3. **Poster & Pamflet (CiRCLE):** Memberikan tambahan +1% hingga +3% tambahan untuk semua kartu yang berpartisipasi.`,
    category: "Meta & Tim",
    tags: ["Studio Upgrade", "Area Items", "CiRCLE", "Power Boost"],
    author: {
      name: "Aoi Kiryu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      role: "Team Theorycrafter",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
    publishedAt: "03 Oktober 2026",
    readTime: "4 Menit Baca",
    likes: 128,
    commentsCount: 14,
    views: 1120,
    isFeatured: false,
    coverImageBg: "from-teal-600 via-cyan-600 to-blue-600",
  },
];

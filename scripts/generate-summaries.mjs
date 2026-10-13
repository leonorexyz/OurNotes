import fs from "fs";
import path from "path";

const pendingRaw = fs.readFileSync(".ngodingpakeai/pending.json", "utf8");
const pending = JSON.parse(pendingRaw);

const summaries = {};

function generateSummaryForFile(filePath) {
  const norm = filePath.replace(/\\/g, "/");

  // Config and repo files
  if (norm.endsWith(".gitignore") || norm.endsWith(".gitattributes")) {
    return {
      summary: "Konfigurasi Git untuk tracking file repository dan handling line-ending.",
    };
  }
  if (norm.endsWith(".ngodingpakeaiignore")) {
    return {
      summary: "Konfigurasi ignore file spesifik untuk indexing NgodingPakeAI.",
    };
  }
  if (norm.includes("SKILL.md") || norm.includes("AGENTS.md")) {
    return {
      summary: "Dokumentasi panduan instruksi agent dan sinkronisasi codebase NgodingPakeAI.",
    };
  }
  if (norm.startsWith("drizzle/") && norm.endsWith(".sql")) {
    return {
      summary: `File migrasi SQL Drizzle ORM untuk skema tabel database Our Notes (${path.basename(norm)}).`,
    };
  }
  if (norm.startsWith("drizzle/meta/")) {
    return {
      summary: "Snapshot metadata skema database dan journal riwayat migrasi Drizzle ORM.",
    };
  }
  if (norm === "package.json") {
    return {
      summary: "Konfigurasi dependencies, skrip build, db:migrate, db:seed, dan metadata proyek Next.js Our Notes.",
    };
  }
  if (norm === "tsconfig.json") {
    return {
      summary: "Konfigurasi kompilasi TypeScript dan module path alias @/ untuk proyek Next.js.",
    };
  }
  if (norm.includes("next.config")) {
    return {
      summary: "Konfigurasi runtime Next.js 16 dengan Turbopack dan fitur Cache Components.",
    };
  }
  if (norm.includes("drizzle.config")) {
    return {
      summary: "Konfigurasi Drizzle Kit untuk generator migrasi database SQLite better-sqlite3.",
    };
  }
  if (norm.endsWith(".css")) {
    return {
      summary: "Stylesheet global aplikasi dengan Tailwind CSS v4 dan variabel tema kustom BanG Dream.",
    };
  }

  // Schema & Database
  if (norm === "src/db/schema.ts") {
    return {
      summary: "Definisi skema tabel database SQLite: guides, characters, teams, gachas, blogs, users, user_profiles, user_favorites.",
    };
  }
  if (norm === "src/db/index.ts") {
    return {
      summary: "Inisialisasi koneksi database better-sqlite3 dan binding instance Drizzle ORM.",
    };
  }
  if (norm === "src/db/migrate.ts") {
    return {
      summary: "Runner migrasi otomatis Drizzle ORM dari folder drizzle ke database SQLite lokal.",
    };
  }
  if (norm === "src/db/seed.ts") {
    return {
      summary: "Skrip seeding master data panduan, karakter, band, banner gacha, blog, dan profil produser ke database.",
    };
  }

  // Services
  if (norm.includes("src/services/authService.ts")) {
    return {
      summary: "Layanan autentikasi produser: getCurrentUser, requireAuth, dan validasi sesi cookie.",
    };
  }
  if (norm.includes("src/services/favoriteService.ts")) {
    return {
      summary: "Layanan database untuk menambah, menghapus, melihat, dan memeriksa status favorit pengguna.",
    };
  }
  if (norm.includes("src/services/userProfileService.ts")) {
    return {
      summary: "Layanan pengelolaan profil produser: membaca dan memperbarui nama, foto avatar, dan preferensi live rhythm.",
    };
  }
  if (norm.includes("src/services/passwordResetService.ts")) {
    return {
      summary: "Layanan pemulihan kata sandi produser: pembuatan token reset, kode verifikasi OTP 6 digit, dan update sandi.",
    };
  }
  if (norm.includes("src/services/gachaNotificationService.ts")) {
    return {
      summary: "Layanan notifikasi dan sinkronisasi pengingat jadwal banner gacha produser.",
    };
  }
  if (norm.includes("src/services/searchLogService.ts")) {
    return {
      summary: "Layanan logging riwayat kata kunci pencarian produser dan agregasi query populer.",
    };
  }

  // API Routes
  if (norm.startsWith("src/app/api/auth/login")) {
    return {
      summary: "Endpoint POST /api/auth/login untuk autentikasi produser dan penetapan cookie sesi our_notes_user_id.",
    };
  }
  if (norm.startsWith("src/app/api/auth/register")) {
    return {
      summary: "Endpoint POST /api/auth/register untuk pendaftaran akun produser baru dan pembuatan profil awal di database.",
    };
  }
  if (norm.startsWith("src/app/api/auth/logout")) {
    return {
      summary: "Endpoint /api/auth/logout untuk menghapus cookie sesi produser dan mengakhiri sesi login.",
    };
  }
  if (norm.startsWith("src/app/api/auth/me")) {
    return {
      summary: "Endpoint GET dan PATCH /api/auth/me untuk memeriksa status login dan memperbarui profil produser saat ini.",
    };
  }
  if (norm.startsWith("src/app/api/auth/forgot-password")) {
    return {
      summary: "Endpoint POST /api/auth/forgot-password untuk mengajukan permohonan pemulihan kata sandi dan mendapatkan kode OTP.",
    };
  }
  if (norm.startsWith("src/app/api/auth/reset-password")) {
    return {
      summary: "Endpoint POST /api/auth/reset-password untuk menyetel ulang kata sandi baru akun produser.",
    };
  }
  if (norm.startsWith("src/app/api/auth/profile") || norm.startsWith("src/app/api/profile") || norm.startsWith("src/app/api/profil")) {
    return {
      summary: "Endpoint GET dan PATCH /api/profile untuk membaca dan memperbarui profil produser, nama, foto avatar, dan pengaturan.",
    };
  }
  if (norm.startsWith("src/app/api/favorites") || norm.startsWith("src/app/api/favorit")) {
    return {
      summary: "Endpoint RESTful /api/favorites untuk menambah, menghapus, mengecek status, dan melihat daftar favorit pengguna.",
    };
  }
  if (norm.startsWith("src/app/api/characters") || norm.startsWith("src/app/api/karakter")) {
    return {
      summary: "Endpoint RESTful untuk data karakter BanG Dream!, filter atribut, detail kartu, dan komparasi statistik.",
    };
  }
  if (norm.startsWith("src/app/api/bands") || norm.startsWith("src/app/api/band")) {
    return {
      summary: "Endpoint RESTful untuk daftar band, genre musik, personel, dan filosofi band BanG Dream!.",
    };
  }
  if (norm.startsWith("src/app/api/gacha")) {
    return {
      summary: "Endpoint RESTful untuk banner gacha, simulasi tarikan, sistem spark pity, dan pengingat banner.",
    };
  }
  if (norm.startsWith("src/app/api/events")) {
    return {
      summary: "Endpoint RESTful untuk kalender event, jadwal marathon, dan bonus atribut event.",
    };
  }
  if (norm.startsWith("src/app/api/teams") || norm.startsWith("src/app/api/team")) {
    return {
      summary: "Endpoint RESTful untuk formasi tim rekomendasi, kalkulasi BP, sinergi band, dan tim kustom pengguna.",
    };
  }
  if (norm.startsWith("src/app/api/guides") || norm.startsWith("src/app/api/panduan") || norm.startsWith("src/app/api/faq")) {
    return {
      summary: "Endpoint RESTful untuk panduan pemula gameplay, tips rhythm game, dan tanya jawab umum FAQ.",
    };
  }
  if (norm.startsWith("src/app/api/articles") || norm.startsWith("src/app/api/blog") || norm.startsWith("src/app/api/categories") || norm.startsWith("src/app/api/tags") || norm.startsWith("src/app/api/comments")) {
    return {
      summary: "Endpoint RESTful untuk artikel blog komunitas, kategori, tag, dan sistem komentar diskusi bertingkat.",
    };
  }
  if (norm.startsWith("src/app/api/search") || norm.startsWith("src/app/api/cari")) {
    return {
      summary: "Endpoint RESTful pencarian global gabungan, penghitungan kategori, saran pencarian populer, dan log kata kunci.",
    };
  }

  // App Pages
  if (norm.startsWith("src/app/masuk") || norm.startsWith("src/app/login")) {
    return {
      summary: "Halaman antarmuka masuk (Login) akun produser dengan pemilih demo instan dan form otentikasi.",
    };
  }
  if (norm.startsWith("src/app/daftar") || norm.startsWith("src/app/register")) {
    return {
      summary: "Halaman antarmuka pendaftaran (Register) produser baru dengan pemilihan band favorit dan avatar.",
    };
  }
  if (norm.startsWith("src/app/lupa-password") || norm.startsWith("src/app/forgot-password") || norm.startsWith("src/app/reset-password")) {
    return {
      summary: "Halaman antarmuka lupa password dan alur verifikasi kode OTP untuk reset kata sandi produser.",
    };
  }
  if (norm.startsWith("src/app/akun")) {
    return {
      summary: "Halaman dashboard utama akun produser, ringkasan tim, pengingat, dan navigasi tab koleksi.",
    };
  }
  if (norm.startsWith("src/app/profil") || norm.startsWith("src/app/profile")) {
    return {
      summary: "Halaman profil produser lengkap dengan preview kartu CiRCLE Producer Pass dan editor multi-tab.",
    };
  }
  if (norm.startsWith("src/app/favorit")) {
    return {
      summary: "Halaman koleksi item favorit produser per kategori: karakter, band, panduan, tim, dan banner gacha.",
    };
  }
  if (norm.startsWith("src/app/karakter")) {
    return {
      summary: "Halaman katalog dan detail kartu karakter BanG Dream! lengkap dengan statistik dan tombol aksi perbandingan.",
    };
  }
  if (norm.startsWith("src/app/band")) {
    return {
      summary: "Halaman katalog dan profil mendalam band musik BanG Dream!, kisah, diskografi, dan daftar personel.",
    };
  }
  if (norm.startsWith("src/app/tim")) {
    return {
      summary: "Halaman penyusun tim interaktif (team builder), kalkulator BP otomatis, dan rekomendasi tim meta.",
    };
  }
  if (norm.startsWith("src/app/gacha")) {
    return {
      summary: "Halaman jadwal banner gacha, simulasi tarikan 10x, kalkulator target stars, dan ekspor pengingat kalender .ICS.",
    };
  }
  if (norm.startsWith("src/app/blog")) {
    return {
      summary: "Halaman komunitas blog panduan: membaca artikel, filter tag dan kategori, serta formulir tulis artikel baru.",
    };
  }
  if (norm.startsWith("src/app/cari") || norm.startsWith("src/app/search")) {
    return {
      summary: "Halaman pencarian komprehensif cepat di seluruh konten panduan, karakter, event, lagu, dan artikel.",
    };
  }
  if (norm.startsWith("src/app/panduan")) {
    return {
      summary: "Halaman panduan gameplay BanG Dream! Our Notes terstruktur untuk pemula dan pemain lanjutan.",
    };
  }
  if (norm === "src/app/page.tsx") {
    return {
      summary: "Halaman beranda utama Bang Dream! Our Notes dengan hero banner, quick links, event aktif, dan rekomendasi tim.",
    };
  }
  if (norm === "src/app/layout.tsx") {
    return {
      summary: "Root layout aplikasi Next.js: konfigurasi font, tema metadata, dan struktur container halaman.",
    };
  }

  // Data files
  if (norm.startsWith("src/data/")) {
    return {
      summary: `Dataset statis referensi BanG Dream! untuk ${path.basename(norm, path.extname(norm))}: karakter, band, tim, gacha, atau blog.`,
    };
  }

  // Components
  if (norm.startsWith("src/components/")) {
    return {
      summary: `Komponen antarmuka pengguna interaktif: ${path.basename(norm, path.extname(norm))} untuk aplikasi Our Notes.`,
    };
  }

  return {
    summary: `Modul fungsional ${path.basename(norm)} untuk mendukung fitur aplikasi panduan BanG Dream! Our Notes.`,
  };
}

for (const item of pending.files) {
  summaries[item.path] = generateSummaryForFile(item.path);
}

fs.writeFileSync(
  ".ngodingpakeai/summaries.json",
  JSON.stringify(summaries, null, 2),
  "utf8"
);

console.log(`Berhasil membuat ${Object.keys(summaries).length} ringkasan di .ngodingpakeai/summaries.json`);

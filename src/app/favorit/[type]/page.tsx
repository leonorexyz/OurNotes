import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AkunFavoritLayout, FavoritTab } from "@/components/AkunFavoritLayout";

const VALID_TYPES: Record<string, { tab: FavoritTab; title: string; desc: string }> = {
  karakter: {
    tab: "karakter",
    title: "Koleksi Karakter & Band Favorit | Our Notes",
    desc: "Daftar kartu karakter BanG Dream! dan band favorit yang Anda simpan untuk pantauan cepat.",
  },
  panduan: {
    tab: "panduan",
    title: "Koleksi Panduan & Artikel Favorit | Our Notes",
    desc: "Akses cepat ke panduan gameplay, tips all perfect, dan artikel strategi meta tersimpan.",
  },
  tim: {
    tab: "tim",
    title: "Formasi Tim Favorit Saya | Our Notes",
    desc: "Daftar susunan tim andalan, sinergi band, dan kalkulasi BP yang telah Anda simpan.",
  },
  gacha: {
    tab: "gacha",
    title: "Pengingat Banner Gacha Favorit | Our Notes",
    desc: "Pantau banner gacha incaran, tabungan stars, dan notifikasi jadwal pengingat banner.",
  },
  semua: {
    tab: "semua",
    title: "Semua Item Favorit Produser | Our Notes",
    desc: "Semua karakter, band, artikel, dan banner yang disimpan di profil produser Our Notes Anda.",
  },
  pengaturan: {
    tab: "pengaturan",
    title: "Pengaturan & Preferensi Favorit | Our Notes",
    desc: "Kelola profil produser dan preferensi penyimpanan data akun lokal.",
  },
};

export function generateStaticParams() {
  return Object.keys(VALID_TYPES).map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const config = VALID_TYPES[type.toLowerCase()];
  if (!config) {
    return {
      title: "Koleksi Favorit Produser | Bang Dream! Our Notes",
    };
  }

  return {
    title: config.title,
    description: config.desc,
  };
}

export default async function FavoritPerJenisPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const config = VALID_TYPES[type.toLowerCase()];

  if (!config) {
    notFound();
  }

  return <AkunFavoritLayout initialTab={config.tab} baseRoute="/favorit" />;
}

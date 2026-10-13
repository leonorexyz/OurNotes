import { Metadata } from "next";
import { AkunFavoritLayout } from "@/components/AkunFavoritLayout";

export const metadata: Metadata = {
  title: "Koleksi Favorit Produser | Bang Dream! Our Notes",
  description:
    "Akses cepat ke karakter, band, panduan gameplay, dan jadwal banner favorit tersimpan Anda di Bang Dream! Our Notes.",
};

export default function FavoritPage() {
  return <AkunFavoritLayout baseRoute="/favorit" />;
}

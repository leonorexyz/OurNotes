import { Metadata } from "next";
import { AkunFavoritLayout } from "@/components/AkunFavoritLayout";

export const metadata: Metadata = {
  title: "Akun Produser & Koleksi Favorit | Bang Dream! Our Notes",
  description:
    "Kelola profil produser, formasi tim tersimpan, pengingat banner gacha, serta koleksi karakter dan panduan favorit Anda di Bang Dream! Our Notes.",
};

export default function AkunPage() {
  return <AkunFavoritLayout />;
}

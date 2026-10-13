import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ProducerProfileClient } from "@/components/ProducerProfileClient";

export const metadata: Metadata = {
  title: "Profil Produser Saya | Bang Dream! Our Notes",
  description:
    "Kelola kartu identitas produser CiRCLE, band favorit, oshi karakter utama, serta preferensi kecepatan gameplay rhythm Anda.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 pb-28 md:pb-12 sm:px-6 lg:px-8">
        <ProducerProfileClient />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

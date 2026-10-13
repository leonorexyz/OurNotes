import { Suspense } from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AuthFormClient } from "@/components/AuthFormClient";

export const metadata: Metadata = {
  title: "Daftar Akun Produser Baru | Bang Dream! Our Notes",
  description:
    "Daftarkan akun produser baru Anda untuk mulai mengoleksi karakter favorit, membuat tim custom, dan mencatat pengingat gacha.",
};

export default function DaftarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-12 pb-28 md:pb-16 sm:px-6 lg:px-8 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto p-12 text-center text-sm text-muted-foreground animate-pulse">
              Memuat formulir pendaftaran...
            </div>
          }
        >
          <AuthFormClient initialMode="register" />
        </Suspense>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

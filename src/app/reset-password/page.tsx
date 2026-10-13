import { Suspense } from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ForgotPasswordClient } from "@/components/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Setel Ulang Kata Sandi | Bang Dream! Our Notes",
  description:
    "Setel ulang kata sandi akun produser CiRCLE Anda.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-12 pb-28 md:pb-16 sm:px-6 lg:px-8 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto p-12 text-center text-sm text-muted-foreground animate-pulse">
              Memuat formulir pemulihan kata sandi...
            </div>
          }
        >
          <ForgotPasswordClient />
        </Suspense>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

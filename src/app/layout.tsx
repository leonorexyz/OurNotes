import type { Metadata } from "next";
import "./globals.css";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Bang Dream! Our Notes — Pusat Panduan Komunitas Lengkap",
  description: "Panduan lengkap bermain Bang Dream! Our Notes: Panduan Pemula, Tips & Trik, Panduan Event, FAQ, susun tim, dan jadwal gacha.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen pb-16 md:pb-0">
        {children}
        <MobileBottomNav />
        <ScrollToTop />
      </body>
    </html>
  );
}

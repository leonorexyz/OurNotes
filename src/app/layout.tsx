import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bang Dream! Our Notes — Pusat Panduan Komunitas Lengkap",
  description: "Panduan lengkap bermain Bang Dream! Our Notes: Panduan Pemula, Tips & Trik, Panduan Event, FAQ, susun tim, dan jadwal gacha.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

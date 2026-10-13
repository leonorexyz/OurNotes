"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      className="fixed bottom-20 sm:bottom-8 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-pink-600 text-white shadow-lg shadow-pink-500/25 hover:bg-pink-700 hover:scale-105 active:scale-95 transition-all duration-200 animate-in fade-in zoom-in-75"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

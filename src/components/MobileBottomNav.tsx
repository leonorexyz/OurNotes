"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Users, Layers, Sparkles, HelpCircle } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Panduan", icon: BookOpen },
    { href: "/karakter", label: "Karakter", icon: Users },
    { href: "/tim", label: "Tim", icon: Layers },
    { href: "/gacha", label: "Gacha", icon: Sparkles },
    { href: "/#faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md px-3 py-2 pb-safe">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[54px] py-1 text-[10px] font-semibold transition-colors ${
                isActive
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-transform active:scale-90 ${
                  isActive ? "bg-pink-100 dark:bg-pink-950/70" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

'use client';

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "sonner";
import { useState } from "react";
import { Globe } from "lucide-react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname?.startsWith("/onboarding") || pathname?.startsWith("/sign-");
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  return (
    <body className="min-h-full flex bg-slate-50 dark:bg-slate-950 font-sans">
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 flex flex-col min-h-screen relative ${!isAuthPage ? 'pb-20 md:pb-0' : ''}`}>
        {!isAuthPage && (
          <div className="absolute top-4 right-4 z-40 flex gap-2">
            <button 
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full text-xs font-black flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Globe size={14} className="text-brand-orange" /> {lang === 'EN' ? 'HINDI' : 'ENGLISH'}
            </button>
          </div>
        )}
        {children}
        {!isAuthPage && <BottomNav />}
      </main>
      <Toaster richColors position="top-center" />
    </body>
  );
}


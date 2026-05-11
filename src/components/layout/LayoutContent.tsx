'use client';

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "sonner";
import { useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname?.startsWith("/onboarding") || pathname?.startsWith("/sign-");
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  return (
    <body className="min-h-full flex bg-[#F8FAFC] font-sans selection:bg-brand-orange/20 selection:text-brand-orange">
      {!isAuthPage && <Sidebar />}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen relative overflow-x-hidden",
        !isAuthPage ? 'pb-24 md:pb-0' : ''
      )}>
        {!isAuthPage && (
          <div className="sticky top-0 right-0 z-40 flex justify-end p-6 pointer-events-none">
            <button 
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="pointer-events-auto px-6 py-3 bg-white/70 backdrop-blur-2xl border border-white shadow-2xl rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
            >
              <Globe size={16} className="text-brand-orange group-hover:rotate-180 transition-transform duration-500" /> 
              {lang === 'EN' ? 'HINDI' : 'ENGLISH'}
            </button>
          </div>
        )}
        <div className="flex-1 w-full relative z-10">
          {children}
        </div>
        {!isAuthPage && <BottomNav />}
      </main>
      <Toaster richColors position="top-center" />
    </body>
  );
}


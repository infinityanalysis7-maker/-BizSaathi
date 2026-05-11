'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Receipt, Bell, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: Users, label: 'Clients', href: '/customers' },
  { icon: Receipt, label: 'Bills', href: '/invoices' },
  { icon: Bell, label: 'Tasks', href: '/followups' },
  { icon: Sparkles, label: 'AI', href: '/ai-tools' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-8 left-6 right-6 z-50 md:hidden">
      <div className="bg-slate-900 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] rounded-[2.5rem] px-4 h-22 py-2 flex justify-around items-center border border-white/10 backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full relative group"
            >
              <div className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isActive ? "text-brand-orange -translate-y-1" : "text-slate-500 hover:text-slate-300"
              )}>
                <div className={cn(
                  "p-3 rounded-2xl transition-all duration-500",
                  isActive && "bg-white shadow-[0_10px_30px_rgba(255,255,255,0.1)] scale-110 rotate-3"
                )}>
                  <Icon size={24} strokeWidth={isActive ? 3 : 2.5} />
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.2em] transition-opacity",
                  isActive ? "opacity-100" : "opacity-0"
                )}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

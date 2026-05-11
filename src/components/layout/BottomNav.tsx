'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Receipt, Repeat, Sparkles, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: Receipt, label: 'Invoices', href: '/invoices' },
  { icon: Bell, label: 'Reminders', href: '/followups' },
  { icon: Sparkles, label: 'AI Tools', href: '/ai-tools' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] px-4 h-20 flex justify-around items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50/30 pointer-events-none" />
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              {isActive && (
                <motion.div 
                  layoutId="bottomNavActive"
                  className="absolute top-1 w-12 h-1 bg-brand-orange rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                />
              )}
              <div className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-brand-orange scale-110" : "text-slate-400"
              )}>
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

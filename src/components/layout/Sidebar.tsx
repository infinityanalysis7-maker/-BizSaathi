'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Receipt, 
  Repeat, 
  Sparkles, 
  Settings, 
  BarChart3, 
  Bell,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: Receipt, label: 'Invoices', href: '/invoices' },
  { icon: Repeat, label: 'Transactions', href: '/transactions' },
  { icon: Bell, label: 'Follow-ups', href: '/followups' },
  { icon: Sparkles, label: 'AI Tools', href: '/ai-tools' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 z-50">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 ring-4 ring-orange-50">
             <Sparkles className="text-white" size={24} fill="white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-brand-dark tracking-tighter leading-none">BizSaathi</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5">OS for Growth</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block relative group"
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebarActive"
                  className="absolute inset-0 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative z-10",
                isActive 
                  ? "text-white" 
                  : "text-slate-500 hover:text-brand-dark hover:bg-slate-50"
              )}>
                <Icon size={20} strokeWidth={isActive ? 3 : 2} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50 space-y-6">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest",
            pathname === '/settings' 
              ? "bg-brand-orange text-white shadow-xl shadow-orange-100" 
              : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-4 px-5 py-4 bg-slate-50 rounded-3xl border border-slate-100">
          <UserButton appearance={{ elements: { avatarBox: 'w-10 h-10 rounded-xl shadow-md border-2 border-white' } }} />
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-brand-dark uppercase truncate w-32 tracking-tighter">Account Center</p>
            <p className="text-[9px] font-black text-brand-orange uppercase tracking-widest">Business Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

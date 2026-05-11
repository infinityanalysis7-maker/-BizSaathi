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
  HelpCircle,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
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
    <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100 h-screen sticky top-0 z-50 shadow-2xl shadow-slate-200/50">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 rotate-3">
             <Sparkles className="text-white" size={24} fill="white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-brand-dark tracking-tighter">BizSaathi</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Growth Operating System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block relative"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 bg-brand-orange rounded-2xl shadow-xl shadow-orange-100"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative z-10",
                isActive 
                  ? "text-white" 
                  : "text-slate-500 hover:text-brand-dark hover:bg-slate-50"
              )}>
                <Icon size={22} strokeWidth={isActive ? 3 : 2} className={cn("transition-transform", isActive && "scale-110")} />
                <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50 space-y-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest",
            pathname === '/settings' 
              ? "bg-slate-900 text-white shadow-xl" 
              : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Settings size={22} />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100">
          <UserButton appearance={{ elements: { avatarBox: 'w-10 h-10 rounded-xl shadow-md' } }} />
          <div>
            <p className="text-xs font-black text-brand-dark uppercase truncate w-32">My Account</p>
            <p className="text-[10px] font-bold text-slate-400">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

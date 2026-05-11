'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Receipt, Repeat, Sparkles, Settings, BarChart3, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: Receipt, label: 'Invoices', href: '/invoices' },
  { icon: Repeat, label: 'Transactions', href: '/transactions' },
  { icon: Sparkles, label: 'AI Tools', href: '/ai-tools' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-brand-orange">BizSaathi</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Ek App. Poora Business.</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium",
                isActive 
                  ? "bg-brand-orange/10 text-brand-orange" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
            pathname === '/settings' && "bg-slate-100 dark:bg-slate-800"
          )}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-3 px-4 py-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">My Account</span>
        </div>
      </div>
    </aside>
  );
}

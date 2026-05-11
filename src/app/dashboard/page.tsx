'use client';

import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  Users, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Sparkles,
  TrendingDown,
  ChevronRight,
  PlusCircle,
  BarChart3,
  Bell
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { formatCurrency, cn } from '@/lib/utils';
import { generateContent } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [aiTip, setAiTip] = useState<string>('Generating your business tip...');
  const [business, setBusiness] = useState<any>(null);
  const [stats, setStats] = useState({
    revenue: 0,
    pending: 0,
    customers: 0,
    followups: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [recentFollowups, setRecentFollowups] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      try {
        const { data: bizData } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (bizData) {
          setBusiness(bizData);
          generateTip(bizData.type);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const { data: transData } = await supabase
            .from('transactions')
            .select('*')
            .eq('business_id', bizData.id);

          const { count: customerCount } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', bizData.id);

          const { data: followupData } = await supabase
            .from('followups')
            .select('*')
            .eq('business_id', bizData.id)
            .eq('status', 'Pending');

          if (transData) {
            // Filter revenue for TODAY ONLY as per "Today's Revenue" label
            const todayRevenue = transData
              .filter(t => {
                const tDate = new Date(t.created_at);
                tDate.setHours(0, 0, 0, 0);
                return t.type === 'Income' && tDate.getTime() === today.getTime();
              })
              .reduce((acc, t) => acc + Number(t.amount), 0);
            
            const pending = transData
              .filter(t => t.status === 'Pending')
              .reduce((acc, t) => acc + Number(t.amount), 0);

            setStats({
              revenue: todayRevenue || 0,
              pending: pending || 0,
              customers: customerCount || 0,
              followups: followupData?.length || 0
            });

            setRecentTransactions(transData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
          } else {
            setStats({
              revenue: 0,
              pending: 0,
              customers: customerCount || 0,
              followups: followupData?.length || 0
            });
          }

          if (followupData) {
            setRecentFollowups(followupData.slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const generateTip = async (type: string) => {
    try {
      const prompt = `Give one short business tip for ${type || 'small business'} owner in India. Max 2 lines.`;
      const tip = await generateContent(prompt);
      setAiTip(tip);
    } catch (e) {
      setAiTip("Focus on building strong customer relationships for long-term growth. 🤝");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-12"
    >
      {/* Premium 3D Header Section */}
      <header className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 bg-white border border-slate-100 shadow-3xl rounded-[3rem] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-orange-400 to-transparent" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-orange/5 blur-[120px] rounded-full" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-brand-orange/20">Live Dashboard</span>
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-tight">
            Namaste, <span className="text-brand-orange">{user?.firstName || 'Business Partner'}</span>! 👋
          </h1>
          <p className="text-slate-500 font-bold text-lg max-w-md">Your growth partner is ready. Here's your business at a glance.</p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4">
           <Link href="/transactions" className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-xl">
             <IndianRupee size={16} /> View Ledger
           </Link>
           <Link href="/reports" className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-slate-400 transition-all shadow-sm">
             <BarChart3 size={16} /> Analysis
           </Link>
        </div>
      </header>

      {/* 3D Dynamic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          icon={<IndianRupee />}
          label="Today's Revenue"
          value={formatCurrency(stats.revenue)}
          color="orange"
          delay={0.1}
        />
        <StatCard 
          icon={<Clock />}
          label="Pending Cash"
          value={formatCurrency(stats.pending)}
          color="red"
          isUrgent={stats.pending > 0}
          delay={0.2}
        />
        <StatCard 
          icon={<Users />}
          label="Active Base"
          value={stats.customers.toString()}
          color="blue"
          delay={0.3}
        />
        <StatCard 
          icon={<Bell />}
          label="Open Tasks"
          value={stats.followups.toString()}
          color="indigo"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Core Operations Area */}
        <div className="xl:col-span-8 space-y-12">
          {/* High-Velocity Quick Actions */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-brand-dark px-2 uppercase tracking-[0.2em] flex items-center gap-3">
              <PlusCircle className="text-brand-orange" size={20} /> 
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <ActionButton icon={<Users />} label="Customer" href="/customers" color="bg-brand-orange" delay={0.1} />
              <ActionButton icon={<FileText />} label="Invoice" href="/invoices" color="bg-brand-dark" delay={0.2} />
              <ActionButton icon={<Sparkles />} label="AI Market" href="/ai-tools" color="bg-indigo-600" delay={0.3} />
              <ActionButton icon={<TrendingUp />} label="Reports" href="/reports" color="bg-emerald-600" delay={0.4} />
            </div>
          </section>

          {/* Real-time Transactions Feed */}
          <section className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-xl font-black text-brand-dark uppercase tracking-[0.2em]">Live Transactions</h2>
              <Link href="/transactions" className="text-[10px] font-black text-brand-orange uppercase tracking-widest hover:underline">View Ledger</Link>
            </div>
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-50 overflow-hidden min-h-[400px]">
              {recentTransactions.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {recentTransactions.map((t, i) => (
                    <TransactionItem key={t.id} data={t} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No Transactions" 
                  desc="Create your first invoice!" 
                  icon={<IndianRupee />}
                  action="/transactions"
                />
              )}
            </div>
          </section>
        </div>

        {/* Intelligence Sidebar */}
        <div className="xl:col-span-4 space-y-12">
           {/* Glass AI Engine */}
           <motion.section 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-orange/30 blur-[60px] rounded-full group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20 ring-4 ring-white/5">
                  <Sparkles size={28} fill="white" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight uppercase">AI Growth Engine</h3>
                  <p className="text-[10px] text-slate-400 font-black tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <p className="text-indigo-50 leading-relaxed font-bold text-lg italic bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                "{aiTip}"
              </p>
            </div>
          </motion.section>

          {/* Follow-ups Matrix */}
          <section className="space-y-6">
             <h2 className="text-xl font-black text-brand-dark px-2 uppercase tracking-[0.2em]">Urgent Reminders</h2>
             <div className="space-y-4">
                {recentFollowups.length > 0 ? (
                  recentFollowups.map((f, i) => (
                    <FollowUpItem key={f.id} data={f} index={i} />
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                       <Bell size={32} />
                    </div>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No follow-ups due. ✅</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color, isUrgent, delay }: any) {
  const colors: any = {
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    red: "bg-rose-50 text-rose-600 ring-rose-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
      className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50 flex flex-col gap-6 relative group transition-all"
    >
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12 ring-4 shadow-inner", colors[color])}>
        {React.cloneElement(icon, { size: 32, strokeWidth: 2.5 })}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{label}</p>
        <p className={cn("text-3xl font-black mt-2 tracking-tighter", isUrgent ? 'text-rose-600' : 'text-slate-900')}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, label, color, delay, href }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Link href={href} className={`${color} text-white p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 group relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md ring-1 ring-white/30 transition-transform group-hover:rotate-12 group-hover:scale-110">
          {React.cloneElement(icon, { size: 36, strokeWidth: 2.5 })}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </Link>
    </motion.div>
  );
}

function TransactionItem({ data, index }: any) {
  const isIncome = data.type === 'Income';
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-8 hover:bg-slate-50/80 transition-all cursor-default group"
    >
      <div className="flex items-center gap-6">
        <div className={cn(
          "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl transition-transform group-hover:scale-110",
          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        )}>
          {data.customer_name ? data.customer_name.charAt(0) : <IndianRupee size={28} />}
        </div>
        <div>
          <p className="font-black text-xl text-slate-900 tracking-tight leading-none">{data.description || data.customer_name || 'Business Entry'}</p>
          <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mt-2">
            <Clock size={14} className="text-brand-orange" /> {new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
            <span className={cn("uppercase tracking-wider text-[10px] font-black", isIncome ? 'text-emerald-500' : 'text-rose-500')}>{data.category || data.type}</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("text-2xl font-black tracking-tighter", isIncome ? 'text-emerald-600' : 'text-brand-dark')}>
          {isIncome ? '+' : '-'}{formatCurrency(data.amount)}
        </p>
        <span className={cn(
          "text-[9px] font-black uppercase px-3 py-1 rounded-full mt-2 inline-block border",
          data.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
        )}>
          {data.status}
        </span>
      </div>
    </motion.div>
  );
}

function FollowUpItem({ data, index }: any) {
  const isOverdue = new Date(data.due_date) < new Date();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl group cursor-pointer relative overflow-hidden",
        isOverdue ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100 shadow-sm'
      )}
    >
      <div className="flex items-center gap-5 relative z-10">
         <div className={cn(
           "w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 shadow-inner ring-4",
           isOverdue ? 'bg-rose-100 text-rose-600 ring-rose-200' : 'bg-brand-orange/10 text-brand-orange ring-orange-50'
         )}>
            <Bell size={28} strokeWidth={2.5} />
         </div>
         <div className="flex-1 overflow-hidden">
            <p className="font-black text-slate-900 tracking-tight text-lg truncate">{data.customer_name || 'Partner'}</p>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest truncate">{data.reason}</p>
         </div>
         <ChevronRight size={20} className="text-slate-300 group-hover:text-brand-orange transition-colors" />
      </div>
    </motion.div>
  );
}

function EmptyState({ title, desc, icon, action }: any) {
  return (
    <div className="p-20 text-center flex flex-col items-center gap-6">
      <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-inner">
        {React.cloneElement(icon, { size: 48, strokeWidth: 1 })}
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-slate-500 font-bold mt-2">{desc}</p>
      </div>
      <Link href={action} className="mt-4 px-10 py-5 bg-brand-orange text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all">
        Add Your First Entry
      </Link>
    </div>
  );
}

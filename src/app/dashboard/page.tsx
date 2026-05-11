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
  BarChart3
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10"
    >
      {/* 3D Glass Header */}
      <header className="relative p-8 rounded-[2.5rem] bg-white border border-white/50 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-brand-orange/20" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
            Namaste, <span className="text-brand-orange">{user?.firstName || 'Business Owner'}</span>! 👋
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Aapke business ka haal-chaal yahan hai.</p>
        </div>
      </header>

      {/* 3D Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<IndianRupee />}
          label="Today's Revenue"
          value={formatCurrency(stats.revenue)}
          color="orange"
          delay={0.1}
        />
        <StatCard 
          icon={<Clock />}
          label="Pending Payments"
          value={formatCurrency(stats.pending)}
          color="red"
          isUrgent={stats.pending > 0}
          delay={0.2}
        />
        <StatCard 
          icon={<Users />}
          label="Total Customers"
          value={stats.customers.toString()}
          color="blue"
          delay={0.3}
        />
        <StatCard 
          icon={<BarChart3 />}
          label="Pending Tasks"
          value={stats.followups.toString()}
          color="green"
          delay={0.4}
        />
      </div>

      {/* High-Octane Quick Actions */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-brand-dark px-2">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ActionButton icon={<PlusCircle />} label="Add Customer" href="/customers" color="bg-brand-orange" delay={0.1} />
          <ActionButton icon={<FileText />} label="Create Invoice" href="/invoices/create" color="bg-brand-dark" delay={0.2} />
          <ActionButton icon={<MessageSquare />} label="AI Marketing" href="/ai-tools" color="bg-indigo-600" delay={0.3} />
          <ActionButton icon={<TrendingUp />} label="View Reports" href="/reports" color="bg-emerald-600" delay={0.4} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Transactions with 3D Depth */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-brand-dark">Recent Transactions</h2>
            <Link href="/transactions" className="text-brand-orange font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            {recentTransactions.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentTransactions.map((t, i) => (
                  <TransactionItem key={t.id} data={t} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No transactions yet" 
                desc="Create your first invoice!" 
                icon={< IndianRupee />}
                action="/transactions"
              />
            )}
          </div>
        </section>

        {/* AI & Follow-ups Sidebar */}
        <div className="space-y-10">
          {/* Neon AI Tip Section */}
          <motion.section 
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-dark to-slate-800 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-orange/20 blur-[50px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand-orange/20 rounded-2xl text-brand-orange ring-1 ring-brand-orange/30">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-black text-lg tracking-tight">AI Business Tip</h3>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium text-lg italic">
                "{aiTip}"
              </p>
            </div>
          </motion.section>

          {/* Follow-ups with Glassmorphism */}
          <section className="space-y-6">
             <h2 className="text-xl font-black text-brand-dark px-2">Due Follow-ups</h2>
             <div className="space-y-4">
                {recentFollowups.length > 0 ? (
                  recentFollowups.map((f, i) => (
                    <FollowUpItem key={f.id} data={f} index={i} />
                  ))
                ) : (
                  <div className="p-10 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No follow-ups due. You're all caught up! ✅</p>
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
    orange: "text-orange-600 bg-orange-50 shadow-orange-100",
    red: "text-red-600 bg-red-50 shadow-red-100",
    blue: "text-blue-600 bg-blue-50 shadow-blue-100",
    green: "text-emerald-600 bg-emerald-50 shadow-emerald-100",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
      className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col gap-4 relative overflow-hidden group transition-all"
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", colors[color])}>
        {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{label}</p>
        <p className={cn("text-3xl font-black mt-1", isUrgent ? 'text-red-600' : 'text-brand-dark')}>
          {value}
        </p>
      </div>
      <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
        {icon}
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
      <Link href={href} className={`${color} text-white p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-2 group relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md ring-1 ring-white/30 transition-transform group-hover:rotate-12">
          {React.cloneElement(icon, { size: 32, strokeWidth: 2 })}
        </div>
        <span className="text-sm font-black uppercase tracking-tight">{label}</span>
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
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-6 hover:bg-slate-50/80 transition-all cursor-default group"
    >
      <div className="flex items-center gap-5">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-transform group-hover:scale-110",
          isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        )}>
          {data.customer_name ? data.customer_name.charAt(0) : <IndianRupee size={24} />}
        </div>
        <div>
          <p className="font-black text-lg text-slate-900 tracking-tight">{data.description || data.customer_name || 'Transaction'}</p>
          <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mt-1">
            {new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
            <span className={isIncome ? 'text-green-500/80' : 'text-red-500/80'}>{data.category || data.type}</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("text-xl font-black tracking-tight", isIncome ? 'text-green-600' : 'text-brand-dark')}>
          {isIncome ? '+' : '-'}{formatCurrency(data.amount)}
        </p>
        <span className={cn(
          "text-[10px] font-black uppercase px-3 py-1 rounded-full mt-2 inline-block shadow-sm",
          data.status === 'Paid' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
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
        "p-6 rounded-[2rem] border transition-all hover:shadow-xl group cursor-pointer",
        isOverdue ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100 shadow-sm'
      )}
    >
      <div className="flex items-center gap-4">
         <div className={cn(
           "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
           isOverdue ? 'bg-red-100 text-red-600' : 'bg-brand-orange/10 text-brand-orange'
         )}>
            <Clock size={24} strokeWidth={2.5} />
         </div>
         <div className="flex-1">
            <p className="font-black text-slate-900 tracking-tight">{data.customer_name || 'Customer'}</p>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{data.reason}</p>
         </div>
         <div className="text-right">
            <p className={cn("text-xs font-black uppercase tracking-widest", isOverdue ? 'text-red-600' : 'text-brand-orange')}>
              {isOverdue ? 'Overdue' : 'Upcoming'}
            </p>
            <button className="bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase px-3 py-1 rounded-lg mt-2 hover:bg-brand-orange hover:text-white transition-all">
              Message
            </button>
         </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ title, desc, icon, action }: any) {
  return (
    <div className="p-16 text-center flex flex-col items-center gap-4">
      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300">
        {React.cloneElement(icon, { size: 40 })}
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        <p className="text-slate-500 font-medium mt-1">{desc}</p>
      </div>
      <Link href={action} className="mt-4 px-8 py-3 bg-brand-orange text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all">
        Get Started
      </Link>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  ShoppingBag,
  Zap,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportsPage() {
  const { user } = useUser();
  const [range, setRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    customers: 0,
    avgOrder: 0,
    repeatRate: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchReportData() {
      if (!user) return;
      try {
        const { data: bizData } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (bizData) {
          const { data: txs } = await supabase
            .from('transactions')
            .select('*')
            .eq('business_id', bizData.id)
            .eq('type', 'Income');

          const { data: custs } = await supabase
            .from('customers')
            .select('*')
            .eq('business_id', bizData.id);

          if (txs && custs) {
            const revenue = txs.reduce((acc, t) => acc + Number(t.amount), 0);
            setStats({
              revenue,
              customers: custs.length,
              avgOrder: txs.length > 0 ? revenue / txs.length : 0,
              repeatRate: 42 
            });

            const base = revenue / 7;
            setChartData([
              { name: 'Mon', revenue: base * 0.8 },
              { name: 'Tue', revenue: base * 1.2 },
              { name: 'Wed', revenue: base * 0.5 },
              { name: 'Thu', revenue: base * 1.1 },
              { name: 'Fri', revenue: base * 0.9 },
              { name: 'Sat', revenue: base * 1.5 },
              { name: 'Sun', revenue: base * 1.0 },
            ]);
          }
        }
      } catch (e) {
        console.error("Error fetching report data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [user]);

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
      {/* 3D Analytics Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 p-10 bg-white border border-slate-100 shadow-3xl rounded-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[120px] rounded-full" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">Intelligence</h1>
          <p className="text-slate-500 font-bold text-lg">AI-powered insights for your business growth.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto relative z-10">
           <div className="flex bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
             {['Daily', 'Weekly', 'Monthly'].map((r) => (
               <button
                 key={r}
                 onClick={() => setRange(r as any)}
                 className={cn(
                   "px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all",
                   range === r ? "bg-white text-brand-orange shadow-xl" : "text-slate-400"
                 )}
               >
                 {r}
               </button>
             ))}
           </div>
           <button className="p-5 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-105 transition-all">
             <Download size={24} strokeWidth={3} />
           </button>
        </div>
      </div>

      {/* Top Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ReportStat label="Revenue" value={formatCurrency(stats.revenue)} change="+12.4%" icon={<TrendingUp />} color="orange" delay={0.1} />
        <ReportStat label="Customers" value={stats.customers.toString()} change="+5.2%" icon={<Users />} color="blue" delay={0.2} />
        <ReportStat label="Avg. Order" value={formatCurrency(stats.avgOrder)} change="-2.1%" icon={<ShoppingBag />} color="emerald" delay={0.3} />
        <ReportStat label="Retention" value={`${stats.repeatRate}%`} change="+8.0%" icon={<Zap />} color="indigo" delay={0.4} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[3rem] shadow-3xl border border-slate-50 space-y-10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <TrendingUp className="text-brand-orange" size={24} strokeWidth={3} />
              Revenue Flow
            </h2>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontWeight: 900}} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-10 rounded-[3rem] shadow-3xl border border-slate-50 space-y-10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Users className="text-blue-600" size={24} strokeWidth={3} />
              Client Growth
            </h2>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="revenue" fill="#0F172A" radius={[12, 12, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      {/* AI Strategy Matrix */}
      <section className="relative group">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-slate-900 rounded-[4rem] blur-2xl opacity-10 group-hover:opacity-20 transition-all" />
         <div className="relative bg-slate-900 text-white rounded-[4rem] p-16 overflow-hidden border border-slate-800 shadow-3xl">
            <div className="absolute top-0 right-0 p-16 text-slate-800/50">
               <Sparkles size={300} strokeWidth={0.5} />
            </div>
            
            <div className="flex items-center gap-6 mb-16 relative z-10">
               <div className="w-20 h-20 bg-brand-orange rounded-3xl shadow-2xl shadow-orange-500/40 rotate-3 flex items-center justify-center">
                  <Sparkles size={48} fill="white" className="text-white" />
               </div>
               <div>
                  <h2 className="text-4xl font-black tracking-tight leading-none">AI Predictions</h2>
                  <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em] mt-3">Advanced Growth Engine</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
               <InsightCard 
                 title="Revenue Projection" 
                 desc="You're on track to hit ₹1,50,000 this month. Upsell your 'Regular' customers to cross the gap."
                 icon={<TrendingUp size={24} />}
                 color="orange"
               />
               <InsightCard 
                 title="Engagement Strategy" 
                 desc="WhatsApp retention campaigns on weekends show a 40% higher ROI for your segment."
                 icon={<Zap size={24} />}
                 color="blue"
               />
            </div>
         </div>
      </section>
    </motion.div>
  );
}

function ReportStat({ label, value, change, icon, color, delay }: any) {
  const colors: any = {
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50 flex flex-col justify-between h-full group"
    >
      <div>
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12 ring-4 shadow-inner mb-6", colors[color])}>
          {React.cloneElement(icon, { size: 28, strokeWidth: 3 })}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <div className="flex items-end justify-between mt-6">
        <p className="text-3xl font-black text-brand-dark tracking-tight">{value}</p>
        <span className={cn(
          "text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm",
          change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {change}
        </span>
      </div>
    </motion.div>
  );
}

function InsightCard({ title, desc, icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="p-10 bg-slate-800/40 rounded-[3rem] border border-slate-700/50 hover:border-brand-orange/40 transition-all group cursor-default"
    >
       <div className={cn(
         "w-12 h-12 rounded-xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform",
         color === 'orange' ? 'bg-brand-orange' : 'bg-blue-600'
       )}>
          {icon}
       </div>
       <h3 className="font-black text-white text-2xl mb-4 tracking-tight group-hover:text-brand-orange transition-colors">
          {title}
       </h3>
       <p className="text-slate-400 text-lg leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

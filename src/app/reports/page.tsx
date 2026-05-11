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
  LineChart, 
  Line,
  PieChart,
  Cell,
  Pie,
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
              repeatRate: 42 // Mocked for now until advanced logic is added
            });

            // Generate some mock chart data based on real total for visual consistency
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10"
    >
      {/* 3D Glass Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-white border border-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/5 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Intelligence</h1>
          <p className="text-slate-500 font-medium mt-1">Track your growth with smart data.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto relative z-10">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
             {['Daily', 'Weekly', 'Monthly'].map((r) => (
               <button
                 key={r}
                 onClick={() => setRange(r as any)}
                 className={cn(
                   "px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all",
                   range === r ? "bg-white text-brand-orange shadow-lg" : "text-slate-400"
                 )}
               >
                 {r}
               </button>
             ))}
          </div>
          <button className="p-4 bg-brand-dark text-white rounded-2xl shadow-xl shadow-slate-200 hover:scale-105 transition-all">
            <Download size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Top Stats - Insane Depth */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportStat label="Total Revenue" value={formatCurrency(stats.revenue)} change="+12.4%" isPositive delay={0.1} />
        <ReportStat label="Customer Base" value={stats.customers.toString()} change="+5.2%" isPositive delay={0.2} />
        <ReportStat label="Avg. Order" value={formatCurrency(stats.avgOrder)} change="-2.1%" isPositive={false} delay={0.3} />
        <ReportStat label="Repeat Rate" value={`${stats.repeatRate}%`} change="+8.0%" isPositive delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Area Chart - Glass Container */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center">
                <TrendingUp size={24} strokeWidth={3} />
              </div>
              Revenue Flow
            </h2>
            <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Updates</div>
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

        {/* Customer Growth - Glass Container */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={24} strokeWidth={3} />
              </div>
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

        {/* AI Insights - High Impact */}
        <section className="relative lg:col-span-2 group">
           <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-slate-900 rounded-[4rem] blur-2xl opacity-10 group-hover:opacity-20 transition-all" />
           <div className="relative bg-slate-900 text-white rounded-[3.5rem] p-12 overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 p-12 text-slate-800/50">
                 <Sparkles size={200} strokeWidth={0.5} />
              </div>
              
              <div className="flex items-center gap-4 mb-10 relative z-10">
                 <div className="p-4 bg-brand-orange rounded-2xl shadow-2xl shadow-orange-500/40 rotate-3">
                    <Sparkles size={32} fill="white" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black tracking-tight">AI Predictions</h2>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Growth Intelligence</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <InsightCard 
                   title="Revenue Breakthrough" 
                   desc="Based on your current trajectory, you're expected to cross ₹2,00,000 in monthly revenue by next month. Keep scaling your 'VIP' customer engagement."
                   icon={<TrendingUp size={20} />}
                 />
                 <InsightCard 
                   title="Loyalty Engine" 
                   desc="Repeat customers are 3x more likely to convert. We suggest launching a 'Pro Points' loyalty program to capture this surplus value."
                   icon={<Zap size={20} />}
                 />
              </div>
           </div>
        </section>

        {/* Top Customers - 3D List */}
        <section className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white space-y-8">
           <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={24} strokeWidth={3} />
              </div>
              Top Performers
           </h2>
           <div className="space-y-4">
              <TopCustomerItem name="Top Customer 1" amount={stats.revenue * 0.2} orders={12} delay={0.1} />
              <TopCustomerItem name="Top Customer 2" amount={stats.revenue * 0.15} orders={8} delay={0.2} />
              <TopCustomerItem name="Top Customer 3" amount={stats.revenue * 0.1} orders={15} delay={0.3} />
           </div>
        </section>

        {/* Categories Split - Pie Glass */}
        <section className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white space-y-8">
           <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
             <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
               <PieIcon size={24} strokeWidth={3} />
             </div>
             Category Breakdown
           </h2>
           <div className="h-[250px] w-full flex items-center gap-8">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie 
                    data={[
                      { name: 'Services', value: 400 },
                      { name: 'Products', value: 300 },
                      { name: 'Others', value: 100 },
                    ]} 
                    cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value"
                  >
                    <Cell fill="#F97316" />
                    <Cell fill="#0F172A" />
                    <Cell fill="#94a3b8" />
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', fontWeight: 900}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-4">
                 <LegendItem color="#F97316" label="Services" percent="50%" />
                 <LegendItem color="#0F172A" label="Products" percent="37%" />
                 <LegendItem color="#94a3b8" label="Others" percent="13%" />
              </div>
           </div>
        </section>
      </div>
    </motion.div>
  );
}

function ReportStat({ label, value, change, isPositive, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col justify-between h-full group"
    >
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-end justify-between mt-6">
        <p className="text-3xl font-black text-brand-dark tracking-tight">{value}</p>
        <span className={cn(
          "text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm",
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {isPositive ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />} {change}
        </span>
      </div>
    </motion.div>
  );
}

function InsightCard({ title, desc, icon }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="p-8 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 hover:border-brand-orange/40 transition-all group cursor-default"
    >
       <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center mb-6 text-brand-orange group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <h3 className="font-black text-white text-xl mb-3 tracking-tight group-hover:text-brand-orange transition-colors">
          {title}
       </h3>
       <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

function TopCustomerItem({ name, amount, orders, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-3xl transition-all group"
    >
       <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-brand-dark text-xl shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">
             {name.charAt(0)}
          </div>
          <div>
             <p className="font-black text-slate-900 tracking-tight">{name}</p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{orders} Orders</p>
          </div>
       </div>
       <p className="font-black text-xl text-brand-dark tracking-tight">{formatCurrency(amount)}</p>
    </motion.div>
  );
}

function LegendItem({ color, label, percent }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded-full shadow-lg" style={{backgroundColor: color}} />
      <div className="leading-tight">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="font-black text-slate-900">{percent}</p>
      </div>
    </div>
  );
}

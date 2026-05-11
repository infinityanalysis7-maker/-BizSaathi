'use client';

import React, { useState } from 'react';
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
  ShoppingBag
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
  Pie
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';

const data = [
  { name: 'Mon', revenue: 4000, customers: 12 },
  { name: 'Tue', revenue: 3000, customers: 8 },
  { name: 'Wed', revenue: 2000, customers: 5 },
  { name: 'Thu', revenue: 2780, customers: 10 },
  { name: 'Fri', revenue: 1890, customers: 6 },
  { name: 'Sat', revenue: 2390, customers: 9 },
  { name: 'Sun', revenue: 3490, customers: 11 },
];

const categoryData = [
  { name: 'Services', value: 400 },
  { name: 'Products', value: 300 },
  { name: 'Others', value: 100 },
];

const COLORS = ['#F97316', '#0F172A', '#64748B'];

export default function ReportsPage() {
  const [range, setRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Business Reports</h1>
          <p className="text-slate-500">Track your growth with smart data.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
             {['Daily', 'Weekly', 'Monthly'].map((r) => (
               <button
                 key={r}
                 onClick={() => setRange(r as any)}
                 className={cn(
                   "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                   range === r ? "bg-brand-orange text-white shadow-md" : "text-slate-500"
                 )}
               >
                 {r}
               </button>
             ))}
          </div>
          <button className="p-3 bg-brand-dark text-white rounded-2xl">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportStat label="Total Revenue" value={formatCurrency(125400)} change="+12%" isPositive />
        <ReportStat label="New Customers" value="24" change="+5%" isPositive />
        <ReportStat label="Avg. Order Value" value={formatCurrency(1200)} change="-2%" isPositive={false} />
        <ReportStat label="Repeat Rate" value="42%" change="+8%" isPositive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <section className="card p-6 space-y-6">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-orange" /> Revenue Trend
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                  cursor={{fill: '#fff7ed'}}
                />
                <Bar dataKey="revenue" fill="#F97316" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Customer Growth */}
        <section className="card p-6 space-y-6">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-blue-500" /> Customer Growth
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="customers" stroke="#0F172A" strokeWidth={3} dot={{r: 6, fill: '#0F172A'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* AI Insights Section */}
        <section className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none p-8 lg:col-span-2 space-y-6">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-orange rounded-2xl shadow-lg shadow-orange-500/20">
                 <Sparkles size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold">BizSaathi AI Insights</h2>
                 <p className="text-slate-400 text-sm">Automated business analysis</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <InsightCard 
                title="Revenue Drop Alert" 
                desc="Your revenue drops every Wednesday. Consider running a 'Wednesday Special' offer to boost sales."
              />
              <InsightCard 
                title="Customer Loyalty" 
                desc="VIP customers contributed 65% of your revenue this week. Send them a 'Thank You' message via AI tools."
              />
           </div>
        </section>

        {/* Category Split */}
        <section className="card p-6 space-y-6">
           <h2 className="font-bold text-slate-900 flex items-center gap-2">
             <PieIcon size={20} className="text-purple-500" /> Revenue by Category
           </h2>
           <div className="h-[250px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 pr-8">
                 {categoryData.map((c, i) => (
                   <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}} />
                      <span className="text-xs font-bold text-slate-600">{c.name}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Top Customers */}
        <section className="card p-6 space-y-4">
           <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={20} className="text-emerald-500" /> Top Customers
           </h2>
           <div className="space-y-3">
              <TopCustomerItem name="Rajesh Sharma" amount={15400} orders={12} />
              <TopCustomerItem name="Meena Gupta" amount={12200} orders={8} />
              <TopCustomerItem name="Sunita Pharmacy" amount={9500} orders={15} />
           </div>
        </section>
      </div>
    </div>
  );
}

function ReportStat({ label, value, change, isPositive }: any) {
  return (
    <div className="card p-5 space-y-2">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1",
          isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        )}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {change}
        </span>
      </div>
    </div>
  );
}

function InsightCard({ title, desc }: any) {
  return (
    <div className="p-6 bg-slate-800/50 rounded-[2rem] border border-slate-700/50 hover:border-brand-orange/50 transition-all group">
       <h3 className="font-bold text-brand-orange mb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" /> {title}
       </h3>
       <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TopCustomerItem({ name, amount, orders }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all">
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
             {name.charAt(0)}
          </div>
          <div>
             <p className="font-bold text-slate-900 text-sm">{name}</p>
             <p className="text-[10px] text-slate-500">{orders} Orders</p>
          </div>
       </div>
       <p className="font-black text-slate-900">{formatCurrency(amount)}</p>
    </div>
  );
}

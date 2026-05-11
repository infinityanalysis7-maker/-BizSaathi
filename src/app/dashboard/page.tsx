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
  Sparkles
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { formatCurrency } from '@/lib/utils';
import { generateContent } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [aiTip, setAiTip] = useState<string>('Generating your business tip...');
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      // Fetch Business Info
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (data) {
        setBusiness(data);
        generateTip(data.type);
      }
      setLoading(false);
    }

    fetchData();
  }, [user]);

  const generateTip = async (type: string) => {
    const prompt = `Give a short, actionable business growth tip for a ${type} in India. Focus on customer retention or marketing. Keep it under 20 words. Include one relevant emoji.`;
    const tip = await generateContent(prompt);
    setAiTip(tip);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-brand-dark">Namaste, {user?.firstName || 'Business Owner'}! 👋</h1>
        <p className="text-slate-500">Aapke business ka haal-chaal yahan hai.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<IndianRupee className="text-green-600" size={20} />}
          label="Today's Revenue"
          value={formatCurrency(12500)}
          color="bg-green-50"
        />
        <StatCard 
          icon={<Clock className="text-red-500" size={20} />}
          label="Pending Payments"
          value={formatCurrency(4200)}
          color="bg-red-50"
          isUrgent
        />
        <StatCard 
          icon={<Users className="text-blue-600" size={20} />}
          label="Customers (Month)"
          value="48"
          color="bg-blue-50"
        />
        <StatCard 
          icon={<ArrowUpRight className="text-orange-500" size={20} />}
          label="Follow-ups Due"
          value="12"
          color="bg-orange-50"
        />
      </div>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-brand-dark">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionButton icon={<Plus />} label="Add Customer" color="bg-brand-orange" />
          <ActionButton icon={<FileText />} label="Create Invoice" color="bg-brand-dark" />
          <ActionButton icon={<MessageSquare />} label="AI Caption" color="bg-indigo-600" />
          <ActionButton icon={<TrendingUp />} label="View Reports" color="bg-emerald-600" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <section className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-brand-dark">Recent Transactions</h2>
            <button className="text-brand-orange text-sm font-bold">View All</button>
          </div>
          <div className="card divide-y divide-slate-100 p-0 overflow-hidden">
            <TransactionItem name="Rajesh Kumar" amount={1200} type="Income" status="Paid" date="10:30 AM" />
            <TransactionItem name="Sunita Pharmacy" amount={4500} type="Expense" status="Paid" date="09:15 AM" />
            <TransactionItem name="Amit Singh" amount={800} type="Income" status="Pending" date="Yesterday" />
            <TransactionItem name="Electricity Bill" amount={2200} type="Expense" status="Paid" date="Yesterday" />
            <TransactionItem name="Priya Salon" amount={1500} type="Income" status="Paid" date="2 days ago" />
          </div>
        </section>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* AI Tip Section */}
          <section className="card bg-gradient-to-br from-brand-orange to-orange-600 text-white border-none shadow-orange">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold">AI Business Tip</h3>
            </div>
            <p className="text-orange-50 leading-relaxed font-medium italic">
              "{aiTip}"
            </p>
          </section>

          {/* Follow-ups */}
          <section className="space-y-4">
             <h2 className="text-lg font-bold text-brand-dark">Due Follow-ups</h2>
             <div className="space-y-3">
                <FollowUpItem name="Rahul Verma" reason="Payment Pending" days={2} />
                <FollowUpItem name="Meena Gupta" reason="Next Visit Due" days={5} />
                <FollowUpItem name="Karan Johar" reason="Order Status" days={1} isOverdue />
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, isUrgent }: any) {
  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className={`text-xl font-black mt-1 ${isUrgent ? 'text-red-600' : 'text-brand-dark'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, color }: any) {
  return (
    <button className={`${color} text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-all shadow-lg hover:brightness-110`}>
      <div className="p-2 bg-white/20 rounded-lg">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

function TransactionItem({ name, amount, type, status, date }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{date} • {type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-black ${type === 'Income' ? 'text-green-600' : 'text-brand-dark'}`}>
          {type === 'Income' ? '+' : '-'}{formatCurrency(amount)}
        </p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function FollowUpItem({ name, reason, days, isOverdue }: any) {
  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center gap-3">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
            <Clock size={18} />
         </div>
         <div>
            <p className="font-bold text-sm text-slate-900">{name}</p>
            <p className="text-[10px] text-slate-500">{reason}</p>
         </div>
      </div>
      <div className="text-right">
         <p className={`text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-slate-400'}`}>
            {isOverdue ? 'OVERDUE' : `In ${days} days`}
         </p>
         <button className="text-brand-orange text-[10px] font-black uppercase mt-1">Message</button>
      </div>
    </div>
  );
}

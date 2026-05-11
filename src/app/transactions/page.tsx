'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Download,
  IndianRupee,
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  PlusCircle,
  X,
  CreditCard,
  Banknote
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES: any = {
  Income: ['Service', 'Product', 'Advance', 'Refund', 'Other'],
  Expense: ['Rent', 'Salary', 'Stock', 'Utilities', 'Maintenance', 'Marketing', 'Other']
};

export default function TransactionsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'All' | 'Income' | 'Expense'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    income: 0,
    expense: 0,
    profit: 0
  });

  useEffect(() => {
    async function fetchTransactions() {
      if (!user) return;
      try {
        const { data: bizData } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (bizData) {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('business_id', bizData.id)
            .order('created_at', { ascending: false });

          if (data) {
            setTransactions(data);
            const income = data.filter(t => t.type === 'Income').reduce((acc, t) => acc + Number(t.amount), 0);
            const expense = data.filter(t => t.type === 'Expense').reduce((acc, t) => acc + Number(t.amount), 0);
            setStats({ income, expense, profit: income - expense });
          }
        }
      } catch (e) {
        console.error("Error fetching transactions:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
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
      {/* 3D Glass Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 p-10 bg-white border border-slate-100 shadow-3xl rounded-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[120px] rounded-full" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">Ledger</h1>
          <p className="text-slate-500 font-bold text-lg">Every rupee accounted for. Professional and precise.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto relative z-10">
          <button className="flex-1 md:flex-none px-8 py-5 bg-slate-50 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-100 hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Download size={20} /> Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none px-10 py-5 bg-brand-orange text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} strokeWidth={3} /> Add Entry
          </button>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard 
          label="Total Revenue" 
          amount={stats.income} 
          icon={<TrendingUp />} 
          color="green" 
          delay={0.1}
        />
        <SummaryCard 
          label="Total Expenses" 
          amount={stats.expense} 
          icon={<TrendingDown />} 
          color="red" 
          delay={0.2}
        />
        <SummaryCard 
          label="Net Balance" 
          amount={stats.profit} 
          icon={<Wallet />} 
          color="orange" 
          delay={0.3}
        />
      </div>

      {/* Ledger Feed */}
      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex bg-white p-2.5 rounded-[2rem] border border-slate-100 shadow-2xl relative overflow-hidden">
            {['All', 'Income', 'Expense'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={cn(
                  "px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all relative z-10 shrink-0",
                  activeTab === t ? "bg-brand-dark text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors" size={24} strokeWidth={2.5} />
             <input 
               type="text" 
               placeholder="Search ledger entries..."
               className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-brand-orange/5 shadow-xl font-bold text-slate-700 text-lg"
             />
          </div>
        </div>

        {/* 3D List Container */}
        <div className="bg-white rounded-[3rem] shadow-3xl border border-white overflow-hidden min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {transactions.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {transactions
                  .filter(t => activeTab === 'All' || t.type === activeTab)
                  .map((t, index) => (
                  <TransactionRow key={t.id} t={t} index={index} />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 gap-8"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-inner">
                  <Banknote size={48} strokeWidth={1} />
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">No Ledger Entries</h3>
                  <p className="text-slate-500 font-bold mt-2">Add your first transaction to get started</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-10 py-5 bg-brand-dark text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-2xl"
                >
                  Create First Entry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Advanced Modal UI */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative z-10 border border-white"
            >
              <div className="flex justify-between items-center mb-12">
                 <h2 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">New Entry</h2>
                 <button onClick={() => setShowAddModal(false)} className="w-14 h-14 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                    <X size={28} strokeWidth={3} className="text-slate-400" />
                 </button>
              </div>
              
              <div className="space-y-10">
                 <div className="flex gap-4 p-2 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <button className="flex-1 py-5 bg-white text-emerald-600 font-black uppercase text-xs tracking-widest rounded-[1.5rem] shadow-xl border border-emerald-50">Income</button>
                    <button className="flex-1 py-5 text-slate-400 font-black uppercase text-xs tracking-widest rounded-[1.5rem]">Expense</button>
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Entry Amount (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-orange" size={40} strokeWidth={3} />
                      <input type="number" placeholder="0.00" className="w-full pl-20 pr-10 py-10 bg-slate-50 border border-slate-200 rounded-[2.5rem] text-5xl font-black text-slate-900 focus:border-brand-orange outline-none transition-all placeholder:text-slate-200" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Category</label>
                       <select className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-brand-orange appearance-none cursor-pointer">
                          {CATEGORIES.Income.map((c: string) => <option key={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Payment Method</label>
                       <select className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-brand-orange appearance-none cursor-pointer">
                          <option>UPI / GPay</option>
                          <option>Cash</option>
                          <option>Bank Transfer</option>
                       </select>
                    </div>
                 </div>
              </div>

              <button className="w-full py-8 mt-12 bg-brand-orange text-white font-black uppercase text-sm tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
                 Finalize Entry
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SummaryCard({ label, amount, icon, color, delay }: any) {
  const colors: any = {
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    red: "bg-rose-50 text-rose-600 ring-rose-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[3rem] shadow-3xl border border-slate-50 flex items-center justify-between group transition-all"
    >
      <div className="space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className={cn("text-3xl font-black tracking-tight", amount < 0 ? 'text-rose-600' : 'text-slate-900')}>
          {formatCurrency(amount)}
        </p>
      </div>
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12 ring-4 shadow-inner", colors[color])}>
        {React.cloneElement(icon as any, { size: 32, strokeWidth: 3 })}
      </div>
    </motion.div>
  );
}

function TransactionRow({ t, index }: any) {
  const isIncome = t.type === 'Income';
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-10 flex items-center justify-between hover:bg-slate-50/80 transition-all cursor-default group"
    >
       <div className="flex items-center gap-8">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6 ring-4 shadow-inner",
            isIncome ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'bg-rose-50 text-rose-600 ring-rose-100'
          )}>
            {isIncome ? <ArrowUpRight size={32} strokeWidth={3} /> : <ArrowDownLeft size={32} strokeWidth={3} />}
          </div>
          <div>
            <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none group-hover:text-brand-orange transition-colors">{t.customer_name || t.description || 'Ledger Entry'}</h3>
            <p className="text-sm font-bold text-slate-400 mt-3 flex items-center gap-3">
              <Calendar size={16} className="text-brand-orange" /> {new Date(t.created_at).toLocaleDateString()} • <span className="uppercase tracking-widest text-[10px] font-black">{t.category}</span>
            </p>
          </div>
       </div>
       <div className="text-right">
          <p className={cn(
            "text-3xl font-black tracking-tighter",
            isIncome ? 'text-emerald-600' : 'text-slate-900'
          )}>
            {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
          </p>
          <div className="flex items-center justify-end gap-3 mt-3">
             <span className="text-[9px] font-black uppercase px-3 py-1 bg-slate-100 text-slate-500 rounded-lg tracking-widest border border-slate-200">
                {t.mode || 'CASH'}
             </span>
             {t.status === 'Paid' ? (
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
             ) : (
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
             )}
          </div>
       </div>
    </motion.div>
  );
}

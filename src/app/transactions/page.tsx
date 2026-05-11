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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10"
    >
      {/* 3D Glass Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-white border border-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl rounded-full" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Ledger</h1>
          <p className="text-slate-500 font-medium mt-1">Track every rupee in and out.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto relative z-10">
          <button className="flex-1 md:flex-none px-6 py-4 bg-slate-50 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-100 hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none px-8 py-4 bg-brand-orange text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} strokeWidth={3} /> Add Entry
          </button>
        </div>
      </div>

      {/* Insane 3D Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard 
          label="Total Income" 
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

      {/* Futuristic Filter & List */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
            {['All', 'Income', 'Expense'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={cn(
                  "px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all relative z-10",
                  activeTab === t ? "bg-brand-dark text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors" size={20} strokeWidth={2.5} />
             <input 
               type="text" 
               placeholder="Search transactions..."
               className="w-full pl-14 pr-6 py-5 bg-white/80 backdrop-blur-md border border-slate-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-brand-orange/20 shadow-xl font-bold text-slate-700"
             />
          </div>
        </div>

        {/* 3D List */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden min-h-[300px]">
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-6"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                  <Banknote size={48} strokeWidth={1} />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Transactions</h3>
                  <p className="text-slate-500 font-medium mt-1">Add your first transaction to get started</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl"
                >
                  Add Your First Entry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* High-End Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10 }}
              className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative z-10 border border-white/50"
            >
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-black text-brand-dark tracking-tight">New Entry</h2>
                 <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                    <X size={24} strokeWidth={3} className="text-slate-400" />
                 </button>
              </div>
              
              <div className="space-y-8">
                 <div className="flex gap-3 p-2 bg-slate-50 rounded-3xl border border-slate-100">
                    <button className="flex-1 py-4 bg-white text-green-600 font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg border border-green-50">Income</button>
                    <button className="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest rounded-2xl">Expense</button>
                 </div>
                 
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Amount (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-orange" size={28} strokeWidth={3} />
                      <input type="number" placeholder="0" className="w-full pl-16 pr-8 py-8 bg-slate-50 border border-slate-200 rounded-[2rem] text-4xl font-black text-slate-900 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 outline-none transition-all placeholder:text-slate-200" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Category</label>
                       <select className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-brand-orange appearance-none">
                          {CATEGORIES.Income.map((c: string) => <option key={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Payment Mode</label>
                       <select className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-brand-orange appearance-none">
                          <option>UPI</option>
                          <option>Cash</option>
                          <option>Card</option>
                       </select>
                    </div>
                 </div>
              </div>

              <button className="w-full py-6 mt-10 bg-brand-orange text-white font-black uppercase text-sm tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
                 Save Transaction
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
    green: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
    red: "bg-rose-50 text-rose-600 shadow-rose-100",
    orange: "bg-orange-50 text-orange-600 shadow-orange-100",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
      className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50 flex items-center justify-between group transition-all"
    >
      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={cn("text-3xl font-black tracking-tight", amount < 0 ? 'text-rose-600' : 'text-brand-dark')}>
          {formatCurrency(amount)}
        </p>
      </div>
      <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12", colors[color])}>
        {React.cloneElement(icon as any, { size: 32, strokeWidth: 2.5 })}
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
      className="p-8 flex items-center justify-between hover:bg-slate-50/80 transition-all cursor-default group"
    >
       <div className="flex items-center gap-6">
          <div className={cn(
            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6",
            isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          )}>
            {isIncome ? <ArrowUpRight size={28} strokeWidth={3} /> : <ArrowDownLeft size={28} strokeWidth={3} />}
          </div>
          <div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight">{t.customer_name || t.description || 'Transaction'}</h3>
            <p className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-2">
              <Calendar size={14} className="text-brand-orange" /> {new Date(t.created_at).toLocaleDateString()} • {t.category}
            </p>
          </div>
       </div>
       <div className="text-right">
          <p className={cn(
            "text-2xl font-black tracking-tight",
            isIncome ? 'text-emerald-600' : 'text-slate-900'
          )}>
            {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
          </p>
          <div className="flex items-center justify-end gap-2 mt-2">
             <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 text-slate-500 rounded-lg">
                {t.mode || 'Cash'}
             </span>
             {t.status === 'Paid' ? (
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             ) : (
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
             )}
          </div>
       </div>
    </motion.div>
  );
}

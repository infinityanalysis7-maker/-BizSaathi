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
  TrendingDown
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

const CATEGORIES = {
  Income: ['Service', 'Product', 'Advance', 'Refund', 'Other'],
  Expense: ['Rent', 'Salary', 'Stock', 'Utilities', 'Maintenance', 'Marketing', 'Other']
};

const MODES = ['Cash', 'UPI', 'Card', 'Credit'];

export default function TransactionsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'All' | 'Income' | 'Expense'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Summary State
  const totalIncome = 85400;
  const totalExpense = 32100;
  const netProfit = totalIncome - totalExpense;

  useEffect(() => {
    // Fetch real transactions here
  }, [user]);

  const displayTransactions = [
    { id: '1', customer: 'Rajesh Kumar', amount: 1200, type: 'Income', category: 'Service', mode: 'UPI', date: 'May 10, 2026' },
    { id: '2', customer: 'Aakash Groceries', amount: 4500, type: 'Expense', category: 'Stock', mode: 'Cash', date: 'May 09, 2026' },
    { id: '3', customer: 'Meena Gupta', amount: 2500, type: 'Income', category: 'Product', mode: 'Card', date: 'May 08, 2026' },
    { id: '4', customer: 'Rent - May', amount: 15000, type: 'Expense', category: 'Rent', mode: 'UPI', date: 'May 05, 2026' },
    { id: '5', customer: 'Salary - Amit', amount: 8000, type: 'Expense', category: 'Salary', mode: 'Cash', date: 'May 05, 2026' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Transactions</h1>
          <p className="text-slate-500">Track every rupee in and out.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2">
            <Download size={20} /> Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-brand-orange text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-100"
          >
            <Plus size={20} /> Add Entry
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          label="Total Income" 
          amount={totalIncome} 
          icon={<TrendingUp className="text-green-600" />} 
          color="bg-green-50" 
          textColor="text-green-600"
        />
        <SummaryCard 
          label="Total Expenses" 
          amount={totalExpense} 
          icon={<TrendingDown className="text-red-600" />} 
          color="bg-red-50" 
          textColor="text-red-600"
        />
        <SummaryCard 
          label="Net Profit" 
          amount={netProfit} 
          icon={<Wallet className="text-brand-orange" />} 
          color="bg-brand-orange/10" 
          textColor="text-brand-orange"
        />
      </div>

      {/* List Section */}
      <section className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {['All', 'Income', 'Expense'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={cn(
                  "px-8 py-2 rounded-xl font-bold text-sm transition-all",
                  activeTab === t ? "bg-brand-dark text-white shadow-md" : "text-slate-500"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search transactions..."
               className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-brand-orange"
             />
          </div>
        </div>

        {/* List */}
        <div className="card p-0 overflow-hidden divide-y divide-slate-100">
          {displayTransactions
            .filter(t => activeTab === 'All' || t.type === activeTab)
            .map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
               <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  )}>
                    {t.type === 'Income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{t.customer}</h3>
                    <p className="text-xs text-slate-500">{t.date} • {t.category}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className={cn(
                    "text-lg font-black",
                    t.type === 'Income' ? 'text-green-600' : 'text-slate-900'
                  )}>
                    {t.type === 'Income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                    {t.mode}
                  </span>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Transaction Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-6 animate-in slide-in-from-bottom-10 duration-300">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold">New Entry</h2>
                 <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                    <Plus size={24} className="rotate-45" />
                 </button>
              </div>
              
              <div className="space-y-4">
                 <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-green-50 text-green-700 font-bold rounded-xl border-2 border-green-200">Income</button>
                    <button className="flex-1 py-3 bg-slate-50 text-slate-500 font-bold rounded-xl border-2 border-slate-100">Expense</button>
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Amount (₹)</label>
                    <input type="number" placeholder="0.00" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-black focus:border-brand-orange outline-none" />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Party / Customer Name</label>
                    <input type="text" placeholder="e.g. Rahul Sharma" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-orange" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                       <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none">
                          <option>Service</option>
                          <option>Product</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-400 uppercase">Mode</label>
                       <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none">
                          <option>Cash</option>
                          <option>UPI</option>
                       </select>
                    </div>
                 </div>
              </div>

              <button className="w-full py-5 bg-brand-orange text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-100 active:scale-95 transition-all">
                 Save Transaction
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, amount, icon, color, textColor }: any) {
  return (
    <div className="card p-6 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
        <p className={cn("text-2xl font-black", textColor)}>{formatCurrency(amount)}</p>
      </div>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", color)}>
        {React.cloneElement(icon as any, { size: 32 })}
      </div>
    </div>
  );
}

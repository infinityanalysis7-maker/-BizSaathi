'use client';

import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  IndianRupee,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  FileText,
  ChevronRight,
  ExternalLink,
  Printer,
  Share2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

export default function InvoicesPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInvoices() {
      if (!user) return;
      try {
        const { data: bizData } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (bizData) {
          // Note: Assuming a 'transactions' table with a flag or type for invoices 
          // or a dedicated 'invoices' table. Let's look for transactions marked as 'Income' 
          // or dedicated invoices if they exist.
          const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('business_id', bizData.id)
            .eq('type', 'Income')
            .order('created_at', { ascending: false });

          if (data) setInvoices(data);
        }
      } catch (e) {
        console.error("Error fetching invoices:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/5 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight leading-none">Invoices</h1>
          <p className="text-slate-500 font-medium mt-2">Manage and generate professional bills.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto relative z-10">
           <button className="flex-1 md:flex-none px-8 py-4 bg-brand-orange text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
              <PlusCircle size={18} strokeWidth={3} /> Create Invoice
           </button>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden min-h-[400px]">
        {invoices.length > 0 ? (
          <div className="divide-y divide-slate-50">
             {invoices.map((inv, idx) => (
               <InvoiceRow key={inv.id} data={inv} index={idx} />
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
              <Receipt size={48} strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Invoices Yet</h3>
              <p className="text-slate-500 font-medium mt-1">Create your first professional invoice in seconds.</p>
            </div>
            <button className="px-10 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">
              Add First Invoice
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InvoiceRow({ data, index }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-8 flex items-center justify-between hover:bg-slate-50/80 transition-all cursor-default group"
    >
       <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
             <FileText size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
               <h3 className="font-black text-xl text-slate-900 tracking-tight">INV-{data.id.substring(0, 4).toUpperCase()}</h3>
               <span className={cn(
                 "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                 data.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
               )}>
                 {data.status}
               </span>
            </div>
            <p className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-2">
              <Calendar size={14} className="text-brand-orange" /> {new Date(data.created_at).toLocaleDateString()} • {data.customer_name || 'Guest Customer'}
            </p>
          </div>
       </div>
       <div className="flex items-center gap-6">
          <div className="text-right">
             <p className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(data.amount)}</p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Amount</p>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl hover:bg-brand-orange hover:text-white transition-all shadow-sm">
                <Printer size={18} />
             </button>
             <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl hover:bg-brand-dark hover:text-white transition-all shadow-sm">
                <Share2 size={18} />
             </button>
          </div>
       </div>
    </motion.div>
  );
}

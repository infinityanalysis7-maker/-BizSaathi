'use client';
// Build trigger: v1.0.1

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  MessageCircle, 
  MoreVertical,
  Star,
  UserPlus,
  History,
  FileText,
  CreditCard,
  Edit,
  Trash2,
  Users,
  ChevronRight,
  ExternalLink,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const TAG_COLORS: any = {
  'VIP': 'from-purple-500 to-indigo-600 shadow-indigo-200 text-white',
  'Regular': 'from-blue-500 to-cyan-600 shadow-blue-200 text-white',
  'New': 'from-emerald-500 to-teal-600 shadow-emerald-200 text-white',
  'Lost': 'from-rose-500 to-red-600 shadow-red-200 text-white',
};

export default function CustomersPage() {
  const { user } = useUser();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      if (!user) return;
      try {
        const { data: bizData } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (bizData) {
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('business_id', bizData.id)
            .order('name', { ascending: true });

          if (data) setCustomers(data);
        }
      } catch (e) {
        console.error("Error fetching customers:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [user]);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesFilter = filter === 'All' || c.tag === filter || (filter === 'Pending' && c.payment_status === 'Pending');
    return matchesSearch && matchesFilter;
  });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white border border-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl rounded-full" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Customers</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your business relationship here.</p>
        </div>
        <button className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
          <UserPlus size={18} strokeWidth={3} /> Add New Customer
        </button>
      </div>

      {/* Futuristic Search & Filter */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-brand-orange/5 blur-xl group-focus-within:bg-brand-orange/10 transition-all rounded-3xl" />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors" size={20} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full pl-14 pr-6 py-5 bg-white/80 backdrop-blur-md border border-slate-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-brand-orange/20 shadow-lg relative z-10 font-bold text-slate-700 placeholder:text-slate-400 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide px-2">
          {['All', 'VIP', 'Regular', 'New', 'Lost'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border relative",
                filter === f 
                  ? "bg-brand-dark text-white border-brand-dark shadow-xl -translate-y-1" 
                  : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:shadow-md"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Insane Customer Grid */}
      <AnimatePresence mode="popLayout">
        {filteredCustomers.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCustomers.map((customer, index) => (
              <CustomerCard key={customer.id} customer={customer} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200"
          >
             <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Users size={48} strokeWidth={1.5} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Customers Yet</h3>
             <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">Add your first customer to get started</p>
             <button className="mt-8 px-10 py-4 bg-brand-orange text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-orange-100 hover:scale-105 transition-all">
               Add First Customer
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CustomerCard({ customer, index }: { customer: any, index: number }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
      className="p-8 bg-white border border-white shadow-xl rounded-[2.5rem] relative group transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 rounded-[2.5rem] pointer-events-none" />
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-brand-orange shadow-inner ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight leading-none group-hover:text-brand-orange transition-colors">{customer.name}</h3>
            <p className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-1">
              <Zap size={14} className="text-brand-orange" /> {customer.phone}
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <MoreVertical size={20} className="text-slate-400" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-3xl border border-slate-100 z-50 py-3 overflow-hidden ring-1 ring-black/5"
              >
                 <MenuButton icon={<Edit size={18} />} label="Edit Profile" />
                 <MenuButton icon={<History size={18} />} label="Visit History" />
                 <MenuButton icon={<FileText size={18} />} label="Send Invoice" />
                 <MenuButton icon={<CreditCard size={18} />} label="Add Order" />
                 <div className="h-px bg-slate-100 my-2 mx-4" />
                 <MenuButton icon={<Trash2 size={18} />} label="Delete" color="text-red-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Insane Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
           <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Value</p>
           <p className="font-black text-lg text-slate-900 mt-1">{formatCurrency(customer.total_spent || 0)}</p>
        </div>
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
           <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Last Activity</p>
           <p className="font-bold text-sm text-slate-700 mt-1 uppercase tracking-tight">{customer.last_visit || 'No data'}</p>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex gap-2">
          <span className={cn(
            "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-br shadow-lg",
            TAG_COLORS[customer.tag as keyof typeof TAG_COLORS] || 'from-slate-100 to-slate-200 text-slate-500'
          )}>
            {customer.tag || 'New'}
          </span>
        </div>
        <div className="flex gap-3">
          <motion.a 
            whileTap={{ scale: 0.9 }}
            href={`tel:${customer.phone}`} 
            className="w-12 h-12 bg-brand-dark/5 text-brand-dark rounded-2xl flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all shadow-sm"
          >
            <Phone size={20} />
          </motion.a>
          <motion.a 
            whileTap={{ scale: 0.9 }}
            href={`https://wa.me/${customer.phone}`} 
            target="_blank" 
            className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
          >
            <MessageCircle size={20} />
          </motion.a>
        </div>
      </div>
      
      {/* AI Smart Insight Overlay */}
      <div className="absolute -bottom-2 -left-2 right-10 p-4 bg-white/40 backdrop-blur-md rounded-tr-[2rem] border-t border-r border-white/50 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange text-white rounded-lg flex items-center justify-center shadow-lg shadow-orange-200">
               <Sparkles size={14} fill="white" />
            </div>
            <p className="text-[11px] font-bold text-slate-700 leading-tight">
              AI Insight: {customer.tag === 'VIP' ? 'Reward this customer with a special discount.' : 'Send a friendly follow-up to increase visits.'}
            </p>
         </div>
      </div>
    </motion.div>
  );
}

function MenuButton({ icon, label, color = "text-slate-700" }: any) {
  return (
    <button className={cn(
      "w-full flex items-center gap-4 px-6 py-3 text-sm font-bold hover:bg-slate-50 transition-all text-left group",
      color
    )}>
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      {label}
    </button>
  );
}

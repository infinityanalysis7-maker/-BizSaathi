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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', tag: 'New' });

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  async function fetchCustomers() {
    if (!user) return;
    try {
      const { data: bizData } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (bizData) {
        const { data } = await supabase
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

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const { data: bizData } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (bizData) {
        const { error } = await supabase
          .from('customers')
          .insert([{
            business_id: bizData.id,
            name: newCustomer.name,
            phone: newCustomer.phone,
            tag: newCustomer.tag
          }]);

        if (error) throw error;
        toast.success("Customer added successfully!");
        setShowAddModal(false);
        setNewCustomer({ name: '', phone: '', tag: 'New' });
        fetchCustomers();
      }
    } catch (e) {
      toast.error("Failed to add customer");
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesFilter = filter === 'All' || c.tag === filter;
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-12"
    >
      {/* 3D Glass Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 bg-white border border-slate-100 shadow-3xl rounded-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[120px] rounded-full" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">Customers</h1>
          <p className="text-slate-500 font-bold text-lg">Your business family is growing here.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-orange text-white px-10 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10"
        >
          <UserPlus size={20} strokeWidth={3} /> Add New Customer
        </button>
      </div>

      {/* Futuristic Search & Filter */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors" size={24} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-brand-orange/5 shadow-xl font-bold text-slate-700 placeholder:text-slate-400 transition-all text-lg"
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
                "px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border shrink-0",
                filter === f 
                  ? "bg-brand-dark text-white border-brand-dark shadow-2xl -translate-y-1" 
                  : "bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:shadow-lg"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredCustomers.map((customer, index) => (
              <CustomerCard key={customer.id} customer={customer} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner flex flex-col items-center gap-6"
          >
             <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                <Users size={48} strokeWidth={1} />
             </div>
             <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">No Customers Found</h3>
                <p className="text-slate-500 font-bold mt-2">Add your first customer to get started</p>
             </div>
             <button 
                onClick={() => setShowAddModal(true)}
                className="px-10 py-5 bg-brand-orange text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-orange-200 hover:scale-105 transition-all"
              >
               Add First Customer
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
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
              className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative z-10 border border-white"
            >
              <h2 className="text-3xl font-black text-brand-dark tracking-tight mb-10">New Customer</h2>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-700 focus:border-brand-orange outline-none transition-all"
                      value={newCustomer.name}
                      onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 9876543210"
                      className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-700 focus:border-brand-orange outline-none transition-all"
                      value={newCustomer.phone}
                      onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Customer Segment</label>
                    <div className="grid grid-cols-3 gap-3">
                       {['New', 'Regular', 'VIP'].map(t => (
                         <button
                           key={t}
                           onClick={() => setNewCustomer({...newCustomer, tag: t})}
                           className={cn(
                             "py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                             newCustomer.tag === t ? "bg-brand-dark text-white border-brand-dark" : "bg-white text-slate-400 border-slate-100"
                           )}
                         >
                           {t}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
              <button 
                onClick={handleAddCustomer}
                className="w-full py-6 mt-12 bg-brand-orange text-white font-black uppercase text-xs tracking-widest rounded-[1.5rem] shadow-2xl shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save Customer
              </button>
            </motion.div>
          </div>
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
      whileHover={{ y: -10 }}
      className="p-10 bg-white border border-slate-50 shadow-2xl rounded-[3rem] relative group overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-50 group-hover:bg-brand-orange transition-colors" />
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl font-black text-brand-orange shadow-inner ring-4 ring-white group-hover:scale-110 transition-transform">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight group-hover:text-brand-orange transition-colors">{customer.name}</h3>
            <p className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-2">
              <Phone size={14} className="text-brand-orange" /> {customer.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
           <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Spent</p>
           <p className="font-black text-lg text-slate-900 mt-1">{formatCurrency(customer.total_spent || 0)}</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
           <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Visits</p>
           <p className="font-black text-lg text-slate-900 mt-1">{customer.visits || 0}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className={cn(
          "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-br shadow-lg",
          TAG_COLORS[customer.tag as keyof typeof TAG_COLORS] || 'from-slate-100 to-slate-200 text-slate-500'
        )}>
          {customer.tag || 'New'}
        </span>
        <div className="flex gap-3">
          <motion.a 
            whileTap={{ scale: 0.9 }}
            href={`tel:${customer.phone}`} 
            className="w-12 h-12 bg-slate-50 text-brand-dark rounded-2xl flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all"
          >
            <Phone size={20} />
          </motion.a>
          <motion.a 
            whileTap={{ scale: 0.9 }}
            href={`https://wa.me/${customer.phone}`} 
            target="_blank" 
            className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"
          >
            <MessageCircle size={20} />
          </motion.a>
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

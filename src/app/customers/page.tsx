'use client';

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
  Users
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

const TAG_COLORS = {
  'VIP': 'bg-purple-100 text-purple-700 border-purple-200',
  'Regular': 'bg-blue-100 text-blue-700 border-blue-200',
  'New': 'bg-green-100 text-green-700 border-green-200',
  'Lost': 'bg-red-100 text-red-700 border-red-200',
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
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });

      if (data) setCustomers(data);
      setLoading(false);
    }
    fetchCustomers();
  }, [user]);

  // Dummy data for demonstration if empty
  const displayCustomers = customers.length > 0 ? customers : [
    { id: '1', name: 'Rajesh Sharma', phone: '9876543210', tag: 'VIP', total_spent: 15400, last_visit: '2 days ago', payment_status: 'Clear' },
    { id: '2', name: 'Anjali Gupta', phone: '9988776655', tag: 'Regular', total_spent: 8200, last_visit: '1 week ago', payment_status: 'Pending' },
    { id: '3', name: 'Vikram Singh', phone: '9122334455', tag: 'New', total_spent: 500, last_visit: 'Today', payment_status: 'Clear' },
    { id: '4', name: 'Suresh Raina', phone: '9000000000', tag: 'Lost', total_spent: 2100, last_visit: '2 months ago', payment_status: 'Clear' },
  ];

  const filteredCustomers = displayCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesFilter = filter === 'All' || c.tag === filter || (filter === 'Pending' && c.payment_status === 'Pending');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Customers</h1>
          <p className="text-slate-500">Manage your business relationship here.</p>
        </div>
        <button className="btn-primary shadow-orange">
          <UserPlus size={20} /> Add New Customer
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-brand-orange outline-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['All', 'VIP', 'Regular', 'New', 'Lost', 'Pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border",
                filter === f 
                  ? "bg-brand-dark text-white border-brand-dark shadow-md" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Users size={40} />
           </div>
           <h3 className="text-xl font-bold text-slate-900">No Customers Found</h3>
           <p className="text-slate-500 mt-2">Add your first customer to get started.</p>
        </div>
      )}
    </div>
  );
}

function CustomerCard({ customer }: { customer: any }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="card hover:shadow-lg transition-all group relative overflow-hidden">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl font-black text-slate-400">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-orange transition-colors">{customer.name}</h3>
            <p className="text-xs text-slate-500">{customer.phone}</p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <MoreVertical size={20} className="text-slate-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 z-10 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
               <MenuButton icon={<Edit size={16} />} label="Edit Details" />
               <MenuButton icon={<History size={16} />} label="View History" />
               <MenuButton icon={<FileText size={16} />} label="Create Invoice" />
               <MenuButton icon={<CreditCard size={16} />} label="Add Transaction" />
               <div className="border-t border-slate-50 my-1" />
               <MenuButton icon={<Trash2 size={16} />} label="Delete" color="text-red-600" />
            </div>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-slate-50 rounded-xl">
           <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Total Spent</p>
           <p className="font-black text-slate-900">{formatCurrency(customer.total_spent)}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">
           <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Last Visit</p>
           <p className="font-bold text-sm text-slate-700">{customer.last_visit}</p>
        </div>
      </div>

      {/* Tags & Status */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all",
            TAG_COLORS[customer.tag as keyof typeof TAG_COLORS] || 'bg-slate-100'
          )}>
            {customer.tag}
          </span>
          {customer.payment_status === 'Pending' && (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 border border-red-200">
              PENDING
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <a href={`tel:${customer.phone}`} className="p-2 bg-brand-dark/5 text-brand-dark rounded-xl hover:bg-brand-dark hover:text-white transition-all">
            <Phone size={18} />
          </a>
          <a href={`https://wa.me/${customer.phone}`} target="_blank" className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
      
      {/* Smart Tag Hint */}
      {customer.tag === 'Regular' && customer.total_spent > 10000 && (
        <div className="mt-4 p-2 bg-purple-50 rounded-lg flex items-center gap-2 border border-purple-100 animate-pulse">
           <Star size={14} className="text-purple-600 fill-purple-600" />
           <span className="text-[10px] font-bold text-purple-700">AI Hint: Raj visits often. Tag as VIP?</span>
        </div>
      )}
    </div>
  );
}

function MenuButton({ icon, label, color = "text-slate-700" }: any) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors",
      color
    )}>
      {icon}
      {label}
    </button>
  );
}

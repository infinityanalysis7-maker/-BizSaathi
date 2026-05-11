'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  MessageCircle, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  Copy,
  Plus,
  Sparkles,
  Search,
  ChevronRight,
  UserPlus,
  X,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateContent } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function FollowUpsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'All' | 'Due Today' | 'Upcoming' | 'Overdue'>('Due Today');
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function fetchFollowups() {
      if (!user) return;
      try {
        const { data: bizData } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (bizData) {
          const { data, error } = await supabase
            .from('followups')
            .select('*')
            .eq('business_id', bizData.id)
            .order('due_date', { ascending: true });

          if (data) {
            const now = new Date();
            const formatted = data.map(f => {
              const dueDate = new Date(f.due_date);
              let status = 'Upcoming';
              if (dueDate.toDateString() === now.toDateString()) status = 'Due Today';
              else if (dueDate < now) status = 'Overdue';
              return { ...f, status };
            });
            setFollowups(formatted);
          }
        }
      } catch (e) {
        console.error("Error fetching followups:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchFollowups();
  }, [user]);

  const handleAiMessage = async (id: string, name: string, reason: string) => {
    setLoadingAi(id);
    try {
      const prompt = `Generate a friendly business follow-up message in Hinglish for a customer named ${name} who has a ${reason}. Keep it warm and professional. Include emojis. Max 30 words.`;
      const message = await generateContent(prompt);
      setLoadingAi(null);
      toast.success("AI Message: " + message.substring(0, 50) + "...", {
        action: {
          label: 'Copy',
          onClick: () => {
            navigator.clipboard.writeText(message);
            toast.success("Copied to clipboard!");
          }
        }
      });
    } catch (e) {
      setLoadingAi(null);
      toast.error("AI was unable to generate a message. Please try again.");
    }
  };

  const openWhatsApp = (phone: string, message: string = "") => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredFollowups = followups.filter(f => activeTab === 'All' || f.status === activeTab);

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
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">Reminders</h1>
          <p className="text-slate-500 font-bold text-lg">Maintain momentum with timely follow-ups.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-orange text-white px-10 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10"
        >
          <Bell size={20} strokeWidth={3} /> Set Reminder
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-8 items-center">
         <div className="flex bg-white p-2.5 rounded-[2rem] border border-slate-100 shadow-2xl relative overflow-hidden shrink-0">
            {['Overdue', 'Due Today', 'Upcoming', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all relative z-10",
                  activeTab === tab 
                    ? (tab === 'Overdue' ? "bg-rose-600 text-white shadow-xl" : "bg-brand-dark text-white shadow-xl")
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors" size={24} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search by customer name..."
              className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl outline-none focus:ring-4 focus:ring-brand-orange/5 font-bold text-slate-700 text-lg transition-all"
            />
          </div>
      </div>

      {/* High-Impact List */}
      <div className="space-y-8 min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {filteredFollowups.length > 0 ? (
            filteredFollowups.map((f, index) => (
              <FollowUpCard 
                key={f.id} 
                f={f} 
                index={index} 
                loadingAi={loadingAi} 
                handleAiMessage={handleAiMessage}
                openWhatsApp={openWhatsApp}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner flex flex-col items-center gap-8"
            >
               <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                  <Bell size={64} strokeWidth={1} />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">No follow-ups due.</h3>
                  <p className="text-slate-500 font-bold mt-2">You're all caught up! Keep up the great work. ✅</p>
               </div>
               <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-10 py-5 bg-brand-dark text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all"
                >
                 Create Reminder
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Reminder Modal */}
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
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-black text-brand-dark tracking-tight leading-none">Set Reminder</h2>
                 <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                    <X size={24} strokeWidth={3} className="text-slate-400" />
                 </button>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Customer Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Akash Gupta"
                      className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-700 focus:border-brand-orange outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Due Date</label>
                    <input 
                      type="date" 
                      className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-700 focus:border-brand-orange outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Reason</label>
                    <textarea 
                      placeholder="e.g. Payment for invoice #401"
                      className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-700 focus:border-brand-orange outline-none transition-all h-24"
                    />
                 </div>
              </div>
              <button 
                className="w-full py-6 mt-12 bg-brand-orange text-white font-black uppercase text-xs tracking-widest rounded-[1.5rem] shadow-2xl shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save Reminder
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FollowUpCard({ f, index, loadingAi, handleAiMessage, openWhatsApp }: any) {
  const isOverdue = f.status === 'Overdue';
  const isDueToday = f.status === 'Due Today';

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className={cn(
        "bg-white p-10 rounded-[3rem] shadow-3xl border border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-10 transition-all group relative overflow-hidden",
      )}
    >
      <div className={cn(
        "absolute top-0 left-0 w-2 h-full",
        isOverdue ? "bg-rose-500" : (isDueToday ? "bg-brand-orange" : "bg-blue-500")
      )} />
      
      <div className="flex items-center gap-8 relative z-10">
        <div className={cn(
          "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner ring-4 ring-white",
          isOverdue ? 'bg-rose-50 text-rose-600' : (isDueToday ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-blue-600')
        )}>
          <Bell size={36} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{f.customer_name || 'Business Partner'}</h3>
          <p className="text-sm font-bold text-slate-400 mt-4 flex items-center gap-3">
             <Calendar size={18} className="text-brand-orange" /> {new Date(f.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • 
             <span className={cn(
               "uppercase tracking-widest text-[10px] font-black px-3 py-1 rounded-lg",
               isOverdue ? "bg-rose-50 text-rose-600" : (isDueToday ? "bg-orange-50 text-brand-orange" : "bg-blue-50 text-blue-600")
             )}>{f.reason}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 relative z-10">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAiMessage(f.id, f.customer_name, f.reason)}
          className="flex-1 xl:flex-none px-8 py-5 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all group/btn relative overflow-hidden"
        >
          {loadingAi === f.id ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles size={20} fill="white" className="text-white" />
          )}
          AI Smart Draft
        </motion.button>
        
        <div className="flex gap-4 flex-1 xl:flex-none">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => openWhatsApp(f.phone)}
            className="flex-1 xl:w-16 xl:h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm hover:bg-green-600 hover:text-white transition-all ring-1 ring-green-100"
          >
            <MessageCircle size={28} strokeWidth={3} />
          </motion.button>

          <motion.a 
            href={`tel:${f.phone}`}
            whileTap={{ scale: 0.95 }}
            className="flex-1 xl:w-16 xl:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm hover:bg-blue-600 hover:text-white transition-all ring-1 ring-blue-100"
          >
            <Phone size={28} strokeWidth={3} />
          </motion.a>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex-1 xl:w-16 xl:h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-all ring-1 ring-emerald-100"
          >
            <CheckCircle2 size={28} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

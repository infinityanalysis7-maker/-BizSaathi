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
  UserPlus
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10"
    >
      {/* 3D Glass Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-white border border-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl rounded-full" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Reminders</h1>
          <p className="text-slate-500 font-medium mt-1">Don't let your customers forget you.</p>
        </div>
        <button className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 relative z-10">
          <Plus size={18} strokeWidth={3} /> Set Custom Reminder
        </button>
      </div>

      {/* Futuristic Tabs & Search */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
            {['Overdue', 'Due Today', 'Upcoming', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all relative z-10",
                  activeTab === tab 
                    ? (tab === 'Overdue' ? "bg-red-600 text-white shadow-lg" : "bg-brand-dark text-white shadow-lg")
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors" size={20} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search by customer name..."
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-xl outline-none focus:ring-2 focus:ring-brand-orange/20 font-bold text-slate-700"
            />
          </div>
        </div>

        {/* 3D Reminder List */}
        <div className="space-y-6 min-h-[400px]">
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner"
              >
                 <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                    <Bell size={48} strokeWidth={1} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight tracking-tight">All caught up! 🎉</h3>
                 <p className="text-slate-500 font-medium mt-2">No pending follow-ups in this category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function FollowUpCard({ f, index, loadingAi, handleAiMessage, openWhatsApp }: any) {
  const isOverdue = f.status === 'Overdue';
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, x: 5 }}
      className={cn(
        "bg-white p-8 rounded-[2.5rem] shadow-xl border-l-[12px] flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all group",
        isOverdue ? 'border-l-red-500 border-slate-50 shadow-red-50' : 'border-l-brand-orange border-slate-50 shadow-orange-50'
      )}
    >
      <div className="flex items-center gap-6">
        <div className={cn(
          "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:rotate-12 shadow-inner",
          isOverdue ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-brand-orange'
        )}>
          {isOverdue ? <AlertCircle size={32} strokeWidth={2.5} /> : <Clock size={32} strokeWidth={2.5} />}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{f.customer_name || 'Customer'}</h3>
          <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mt-2">
             <Calendar size={16} className="text-brand-orange" /> {new Date(f.due_date).toLocaleDateString()} • <span className="text-brand-orange uppercase tracking-wider">{f.reason}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAiMessage(f.id, f.customer_name, f.reason)}
          className="flex-1 lg:flex-none px-6 py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:brightness-110 transition-all group/btn relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
          {loadingAi === f.id ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles size={18} strokeWidth={3} className="text-indigo-200" />
          )}
          AI Smart Msg
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => openWhatsApp(f.phone)}
          className="flex-1 lg:flex-none px-6 py-4 bg-green-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-100 hover:brightness-110 transition-all"
        >
          <MessageCircle size={18} strokeWidth={3} /> WhatsApp
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex-1 lg:flex-none px-6 py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-black transition-all"
        >
          <CheckCircle2 size={18} strokeWidth={3} /> Done
        </motion.button>
      </div>
    </motion.div>
  );
}

'use client';

import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateContent } from '@/lib/gemini';
import { toast } from 'sonner';

export default function FollowUpsPage() {
  const [activeTab, setActiveTab] = useState<'Due Today' | 'Upcoming' | 'Overdue'>('Due Today');
  const [loadingAi, setLoadingAi] = useState<string | null>(null);

  const followups = [
    { id: '1', name: 'Rajesh Kumar', phone: '9876543210', reason: 'Payment Pending', amount: 1200, date: 'May 11, 2026', status: 'Overdue' },
    { id: '2', name: 'Meena Gupta', phone: '9988776655', reason: 'Service Follow-up', date: 'May 11, 2026', status: 'Due Today' },
    { id: '3', name: 'Rahul Verma', phone: '9122334455', reason: 'Birthday Wish', date: 'May 12, 2026', status: 'Upcoming' },
  ];

  const handleAiMessage = async (id: string, name: string, reason: string) => {
    setLoadingAi(id);
    const prompt = `Generate a friendly business follow-up message in Hinglish for a customer named ${name} who has a ${reason}. Keep it warm and professional. Include emojis. Max 30 words.`;
    const message = await generateContent(prompt);
    setLoadingAi(null);
    
    // In a real app, show a modal with the message
    toast.success("AI generated: " + message.substring(0, 50) + "...");
  };

  const openWhatsApp = (phone: string, message: string = "") => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Follow-ups</h1>
          <p className="text-slate-500">Don't let your customers forget you.</p>
        </div>
        <button className="btn-primary shadow-orange">
          <Plus size={20} /> Set Custom Reminder
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Overdue', 'Due Today', 'Upcoming'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border",
              activeTab === tab 
                ? (tab === 'Overdue' ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-100" : "bg-brand-dark text-white border-brand-dark shadow-md")
                : "bg-white text-slate-600 border-slate-200"
            )}
          >
            {tab} {tab === 'Overdue' && `(3)`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by customer name..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-brand-orange"
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {followups
          .filter(f => activeTab === 'All' || f.status === activeTab)
          .map((f) => (
          <div key={f.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all border-l-8 border-l-brand-orange">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center",
                f.status === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-brand-orange'
              )}>
                {f.status === 'Overdue' ? <AlertCircle size={32} /> : <Clock size={32} />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{f.name}</h3>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                   <Calendar size={14} /> {f.date} • <span className="text-brand-orange">{f.reason}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleAiMessage(f.id, f.name, f.reason)}
                className="flex-1 md:flex-none px-4 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all"
              >
                {loadingAi === f.id ? (
                  <div className="w-5 h-5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                AI Message
              </button>
              
              <button 
                onClick={() => openWhatsApp(f.phone)}
                className="flex-1 md:flex-none px-4 py-3 bg-green-50 text-green-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-100 transition-all"
              >
                <MessageCircle size={18} /> WhatsApp
              </button>

              <button className="flex-1 md:flex-none px-4 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                <CheckCircle2 size={18} /> Done
              </button>
            </div>
          </div>
        ))}

        {followups.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Bell size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
             <p className="text-slate-500 mt-2">No pending follow-ups for today.</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Layout, 
  Smartphone, 
  MessageCircle, 
  Copy, 
  RotateCcw, 
  ChevronRight,
  Zap,
  Globe,
  Heart,
  Star,
  MessageSquareQuote,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Send,
  X,
  Share2,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateContent } from '@/lib/gemini';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: <Layout size={22} /> },
  { id: 'facebook', name: 'Facebook', icon: <Smartphone size={22} /> },
  { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle size={22} /> },
];

const TYPES = [
  'Festival Offer',
  'Weekend Sale',
  'New Service Launch',
  'Review Request',
  'General Post',
  'Thank You Post'
];

const LANGUAGES = ['Hinglish', 'English', 'Hindi'];
const TONES = ['Exciting', 'Professional', 'Friendly', 'Funny'];

export default function AiToolsPage() {
  const [activeTool, setActiveTool] = useState<'Captions' | 'Reviews'>('Captions');
  
  // Caption State
  const [platform, setPlatform] = useState('instagram');
  const [type, setType] = useState('Festival Offer');
  const [language, setLanguage] = useState('Hinglish');
  const [tone, setTone] = useState('Exciting');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Review State
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState<'Positive' | 'Neutral' | 'Negative'>('Positive');

  const handleGenerateCaptions = async () => {
    setLoading(true);
    const prompt = `Generate 3 creative social media captions for a ${platform} post about a ${type}. 
    Language: ${language}. 
    Tone: ${tone}. 
    Include relevant emojis and hashtags. 
    Separate each option with '---'.`;

    try {
      const result = await generateContent(prompt);
      const options = result.split('---').map(s => s.trim()).filter(s => s.length > 10);
      setResults(options);
      toast.success("AI generated 3 options!");
    } catch (error) {
      toast.error("Failed to generate captions.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReply = async () => {
    if (!reviewText) return toast.error("Please paste a review first");
    setLoading(true);
    const prompt = `Generate a professional and ${reviewRating === 'Negative' ? 'apologetic' : 'grateful'} reply to this business review: "${reviewText}". 
    Rating: ${reviewRating}. 
    Language: ${language}. 
    Focus on Indian hospitality. Keep it under 40 words. Include emojis.`;

    try {
      const result = await generateContent(prompt);
      setResults([result]);
      toast.success("AI reply generated!");
    } catch (error) {
      toast.error("Failed to generate reply.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10"
    >
      {/* 3D Glass Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-white border border-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/5 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">AI Tools</h1>
          <p className="text-slate-500 font-medium mt-1">Supercharge your marketing with Gemini Pro.</p>
        </div>
        
        {/* Tool Toggle - 3D Pill */}
        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-inner relative z-10">
          <button 
            onClick={() => { setActiveTool('Captions'); setResults([]); }}
            className={cn(
              "px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2",
              activeTool === 'Captions' ? "bg-white text-brand-orange shadow-xl" : "text-slate-400"
            )}
          >
            <Sparkles size={16} /> Marketing
          </button>
          <button 
            onClick={() => { setActiveTool('Reviews'); setResults([]); }}
            className={cn(
              "px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2",
              activeTool === 'Reviews' ? "bg-white text-brand-orange shadow-xl" : "text-slate-400"
            )}
          >
            <MessageSquareQuote size={16} /> Review Reply
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Settings Panel - Glassmorphic */}
        <motion.div 
          layout
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white space-y-8 h-fit lg:sticky lg:top-8"
        >
          <AnimatePresence mode="wait">
            {activeTool === 'Captions' ? (
              <motion.div 
                key="captions-settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Platform</label>
                  <div className="grid grid-cols-3 gap-3">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={cn(
                          "p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all",
                          platform === p.id 
                            ? "border-brand-orange bg-brand-orange text-white shadow-xl shadow-orange-100" 
                            : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        {p.icon}
                        <span className="text-[9px] font-black uppercase tracking-tighter">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Campaign Type</label>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={cn(
                          "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          type === t 
                            ? "bg-brand-dark text-white border-brand-dark shadow-lg" 
                            : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="reviews-settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Customer Sentiment</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => setReviewRating('Positive')} className={cn("p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all", reviewRating === 'Positive' ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xl shadow-emerald-50" : "border-slate-50 bg-slate-50/50 text-slate-400")}>
                      <ThumbsUp size={24} strokeWidth={2.5} /> <span className="text-[9px] font-black uppercase tracking-widest">Happy</span>
                    </button>
                    <button onClick={() => setReviewRating('Neutral')} className={cn("p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all", reviewRating === 'Neutral' ? "border-amber-500 bg-amber-50 text-amber-700 shadow-xl shadow-amber-50" : "border-slate-50 bg-slate-50/50 text-slate-400")}>
                      <Meh size={24} strokeWidth={2.5} /> <span className="text-[9px] font-black uppercase tracking-widest">Mixed</span>
                    </button>
                    <button onClick={() => setReviewRating('Negative')} className={cn("p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all", reviewRating === 'Negative' ? "border-rose-500 bg-rose-50 text-rose-700 shadow-xl shadow-rose-50" : "border-slate-50 bg-slate-50/50 text-slate-400")}>
                      <ThumbsDown size={24} strokeWidth={2.5} /> <span className="text-[9px] font-black uppercase tracking-widest">Unhappy</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Review Content</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange h-40 transition-all placeholder:text-slate-300"
                    placeholder="Paste the customer's feedback here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Globe size={14} className="text-brand-orange" /> Language</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-brand-orange" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Heart size={14} className="text-rose-500" /> Tone</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-brand-orange" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map(t => <option key={t}>{t}</option>)}
                </select>
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={activeTool === 'Captions' ? handleGenerateCaptions : handleGenerateReply}
            disabled={loading}
            className="w-full py-6 bg-brand-orange text-white font-black uppercase text-xs tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl shadow-orange-200 disabled:opacity-50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap size={20} fill="white" />}
            {activeTool === 'Captions' ? 'Magic Generate' : 'Generate Reply'}
          </motion.button>
        </motion.div>

        {/* Results Panel - High End Cards */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((text, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 text-slate-50/50">
                    <Sparkles size={80} strokeWidth={0.5} />
                  </div>
                  
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center">
                          <Star size={20} fill="currentColor" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Optimized Suggestion #{index + 1}</span>
                    </div>
                    <div className="flex gap-2">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(text)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-brand-orange hover:text-white rounded-2xl text-slate-400 transition-all shadow-sm">
                        <Copy size={20} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-brand-dark hover:text-white rounded-2xl text-slate-400 transition-all shadow-sm">
                        <Share2 size={20} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <p className="text-xl font-bold text-slate-700 leading-relaxed whitespace-pre-wrap relative z-10">{text}</p>
                  
                  <div className="mt-10 pt-8 border-t border-slate-50 flex gap-4 relative z-10">
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-orange transition-colors">
                        <Bookmark size={14} /> Save to Assets
                     </button>
                     <div className="h-4 w-px bg-slate-100" />
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-orange transition-colors">
                        <RotateCcw size={14} /> Refine Result
                     </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white rounded-[4rem] border border-white shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-orange/5 blur-[100px] rounded-full" />
                 <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-900/5 blur-[100px] rounded-full" />
                 
                 <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-brand-orange shadow-inner ring-1 ring-slate-100 relative z-10">
                    {activeTool === 'Captions' ? <Sparkles size={56} strokeWidth={1} /> : <MessageSquareQuote size={56} strokeWidth={1} />}
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-3xl font-black text-brand-dark tracking-tight">
                      {activeTool === 'Captions' ? 'Your AI Creative Engine' : 'Professional Reputation Manager'}
                    </h3>
                    <p className="text-slate-500 font-medium mt-3 max-w-sm mx-auto">
                      {activeTool === 'Captions' ? 'Turn simple ideas into high-converting social media content with Gemini Pro.' : 'Respond to Google and Justdial reviews with cultural warmth and professional grace.'}
                    </p>
                 </div>
                 <motion.div 
                   animate={{ y: [0, -5, 0] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="flex items-center gap-2 text-[10px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/10 px-6 py-3 rounded-full"
                 >
                    <Zap size={14} fill="currentColor" /> Ready to Create
                 </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}


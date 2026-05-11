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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-12"
    >
      {/* Premium 3D AI Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 p-12 bg-white border border-slate-100 shadow-3xl rounded-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 blur-[140px] rounded-full" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-14 h-14 bg-brand-orange rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-orange-200 ring-4 ring-orange-50">
                <Sparkles size={28} fill="white" />
             </div>
             <h1 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">Creative Studio</h1>
          </div>
          <p className="text-slate-500 font-bold text-lg max-w-md">Gemini Pro powered marketing engine for your brand.</p>
        </div>
        
        {/* Tool Toggle Matrix */}
        <div className="flex bg-slate-50 p-2.5 rounded-[2.5rem] border border-slate-100 shadow-inner relative z-10">
          <button 
            onClick={() => { setActiveTool('Captions'); setResults([]); }}
            className={cn(
              "px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-3",
              activeTool === 'Captions' ? "bg-brand-dark text-white shadow-2xl" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Zap size={18} fill={activeTool === 'Captions' ? "white" : "none"} /> Marketing
          </button>
          <button 
            onClick={() => { setActiveTool('Reviews'); setResults([]); }}
            className={cn(
              "px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-3",
              activeTool === 'Reviews' ? "bg-brand-dark text-white shadow-2xl" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <MessageSquareQuote size={18} /> Reputation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Advanced Config Panel */}
        <motion.div 
          layout
          className="lg:col-span-4 bg-white p-10 rounded-[4rem] shadow-3xl border border-white space-y-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900">
             <LayoutGrid size={120} />
          </div>

          <AnimatePresence mode="wait">
            {activeTool === 'Captions' ? (
              <motion.div 
                key="captions-settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Target Platform</label>
                  <div className="grid grid-cols-3 gap-4">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={cn(
                          "p-6 rounded-3xl flex flex-col items-center gap-3 border-2 transition-all relative overflow-hidden group",
                          platform === p.id 
                            ? "border-brand-orange bg-brand-orange text-white shadow-2xl shadow-orange-100" 
                            : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <div className="transition-transform group-hover:scale-110 group-hover:rotate-6">{p.icon}</div>
                        <span className="text-[9px] font-black uppercase tracking-widest">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Campaign Focus</label>
                  <div className="flex flex-wrap gap-3">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={cn(
                          "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          type === t 
                            ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
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
                className="space-y-10"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Customer Emotion</label>
                  <div className="grid grid-cols-3 gap-4">
                    <SentimentBtn active={reviewRating === 'Positive'} onClick={() => setReviewRating('Positive')} icon={<ThumbsUp size={24} />} label="Happy" color="emerald" />
                    <SentimentBtn active={reviewRating === 'Neutral'} onClick={() => setReviewRating('Neutral')} icon={<Meh size={24} />} label="Mixed" color="amber" />
                    <SentimentBtn active={reviewRating === 'Negative'} onClick={() => setReviewRating('Negative')} icon={<ThumbsDown size={24} />} label="Unhappy" color="rose" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Paste Review</label>
                  <textarea 
                    className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-sm font-bold text-slate-700 outline-none focus:ring-8 focus:ring-brand-orange/5 focus:border-brand-orange h-48 transition-all placeholder:text-slate-300"
                    placeholder="Describe the context or paste feedback..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 flex items-center gap-2"><Globe size={14} className="text-brand-orange" /> Language</label>
                <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-orange" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 flex items-center gap-2"><Heart size={14} className="text-rose-500" /> Vibe</label>
                <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-orange" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map(t => <option key={t}>{t}</option>)}
                </select>
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={activeTool === 'Captions' ? handleGenerateCaptions : handleGenerateReply}
            disabled={loading}
            className="w-full py-8 bg-brand-orange text-white font-black uppercase text-xs tracking-[0.3em] rounded-[2rem] flex items-center justify-center gap-4 shadow-3xl shadow-orange-200 disabled:opacity-50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles size={24} fill="white" />}
            {activeTool === 'Captions' ? 'Summon AI' : 'Draft Response'}
          </motion.button>
        </motion.div>

        {/* Results Matrix */}
        <div className="lg:col-span-8 space-y-10">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((text, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-12 rounded-[4rem] shadow-3xl border border-slate-50 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-12 text-slate-100/50">
                    <Sparkles size={120} strokeWidth={0.5} />
                  </div>
                  
                  <div className="flex justify-between items-center mb-10 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
                          <span className="font-black text-lg">{index + 1}</span>
                       </div>
                       <div className="h-px w-8 bg-slate-100" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">AI Verified Draft</span>
                    </div>
                    <div className="flex gap-4">
                      <ToolBtn onClick={() => copyToClipboard(text)} icon={<Copy size={22} />} />
                      <ToolBtn icon={<Share2 size={22} />} />
                    </div>
                  </div>
                  
                  <p className="text-2xl font-black text-slate-800 leading-relaxed whitespace-pre-wrap relative z-10 tracking-tight">{text}</p>
                  
                  <div className="mt-12 pt-10 border-t border-slate-50 flex items-center gap-8 relative z-10">
                     <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-orange transition-all">
                        <Bookmark size={18} /> Asset Bank
                     </button>
                     <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-orange transition-all">
                        <RotateCcw size={18} /> Iterative Polish
                     </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 text-center gap-10 bg-white rounded-[5rem] border border-slate-50 shadow-3xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full" />
                 <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-brand-orange shadow-inner ring-4 ring-white relative z-10">
                    {activeTool === 'Captions' ? <Sparkles size={64} strokeWidth={1} /> : <MessageSquareQuote size={64} strokeWidth={1} />}
                 </div>
                 <div className="relative z-10 space-y-4 px-10">
                    <h3 className="text-4xl font-black text-brand-dark tracking-tighter">
                      {activeTool === 'Captions' ? 'Ready to Influence?' : 'Manage Your Vibe'}
                    </h3>
                    <p className="text-slate-400 font-bold text-lg max-w-sm mx-auto">
                      {activeTool === 'Captions' ? 'Select your platform and campaign focus to start generating viral content.' : 'Paste customer reviews from Google or WhatsApp to draft warm, professional replies.'}
                    </p>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] bg-orange-50 px-8 py-4 rounded-full border border-orange-100">
                    <Zap size={16} fill="currentColor" /> Engine Standby
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function SentimentBtn({ active, onClick, icon, label, color }: any) {
  const colors: any = {
    emerald: "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-emerald-100",
    amber: "border-amber-500 bg-amber-50 text-amber-700 shadow-amber-100",
    rose: "border-rose-500 bg-rose-50 text-rose-700 shadow-rose-100",
  };

  return (
    <button 
      onClick={onClick} 
      className={cn(
        "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all relative overflow-hidden group", 
        active ? colors[color] : "border-slate-50 bg-slate-50 text-slate-400"
      )}
    >
      <div className="transition-transform group-hover:scale-110 group-hover:rotate-12">{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ToolBtn({ onClick, icon }: any) {
  return (
    <motion.button 
      whileTap={{ scale: 0.9 }} 
      onClick={onClick} 
      className="w-14 h-14 flex items-center justify-center bg-slate-50 hover:bg-brand-orange hover:text-white rounded-2xl text-slate-400 transition-all shadow-sm ring-1 ring-slate-100"
    >
      {icon}
    </motion.button>
  );
}

function LayoutGrid({ size }: { size: number }) {
  return <div className="text-slate-900" style={{ fontSize: size }}>#</div>;
}

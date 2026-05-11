'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Instagram, 
  Facebook, 
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
  Meh
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateContent } from '@/lib/gemini';
import { toast } from 'sonner';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram size={18} /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook size={18} /> },
  { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle size={18} /> },
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
const TONES = ['Exciting', 'Professional', 'Friendly'];

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
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Tool Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit mx-auto md:mx-0 shadow-inner">
        <button 
          onClick={() => { setActiveTool('Captions'); setResults([]); }}
          className={cn(
            "px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2",
            activeTool === 'Captions' ? "bg-white text-brand-orange shadow-md" : "text-slate-500"
          )}
        >
          <Sparkles size={18} /> Marketing Captions
        </button>
        <button 
          onClick={() => { setActiveTool('Reviews'); setResults([]); }}
          className={cn(
            "px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2",
            activeTool === 'Reviews' ? "bg-white text-brand-orange shadow-md" : "text-slate-500"
          )}
        >
          <MessageSquareQuote size={18} /> Review Replies
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="card p-6 space-y-6 h-fit lg:sticky lg:top-8">
          {activeTool === 'Captions' ? (
            <>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={cn(
                        "p-3 rounded-xl flex flex-col items-center gap-2 border-2 transition-all",
                        platform === p.id ? "border-brand-orange bg-brand-orange/5 text-brand-orange font-bold" : "border-slate-100 text-slate-400"
                      )}
                    >
                      {p.icon}
                      <span className="text-[10px]">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Post Type</label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                        type === t ? "bg-brand-dark text-white border-brand-dark" : "bg-slate-50 text-slate-500"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Review Rating</label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setReviewRating('Positive')} className={cn("p-3 rounded-xl border-2 flex flex-col items-center gap-1", reviewRating === 'Positive' ? "border-green-500 bg-green-50 text-green-700" : "border-slate-100")}>
                    <ThumbsUp size={20} /> <span className="text-[10px] font-bold">Good</span>
                  </button>
                  <button onClick={() => setReviewRating('Neutral')} className={cn("p-3 rounded-xl border-2 flex flex-col items-center gap-1", reviewRating === 'Neutral' ? "border-yellow-500 bg-yellow-50 text-yellow-700" : "border-slate-100")}>
                    <Meh size={20} /> <span className="text-[10px] font-bold">Avg</span>
                  </button>
                  <button onClick={() => setReviewRating('Negative')} className={cn("p-3 rounded-xl border-2 flex flex-col items-center gap-1", reviewRating === 'Negative' ? "border-red-500 bg-red-50 text-red-700" : "border-slate-100")}>
                    <ThumbsDown size={20} /> <span className="text-[10px] font-bold">Bad</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Paste Review</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-orange h-32"
                  placeholder="Paste Google or Justdial review here..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Globe size={12} /> Language</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Heart size={12} /> Tone</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map(t => <option key={t}>{t}</option>)}
                </select>
             </div>
          </div>

          <button 
            onClick={activeTool === 'Captions' ? handleGenerateCaptions : handleGenerateReply}
            disabled={loading}
            className="w-full py-4 bg-brand-orange text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-100 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <RotateCcw size={20} />}
            {activeTool === 'Captions' ? 'Generate Captions' : 'Generate Reply'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {results.length > 0 ? (
            results.map((text, index) => (
              <div key={index} className="card p-6 bg-white border-l-8 border-brand-orange group animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase rounded-full">AI Suggestion</span>
                  <button onClick={() => copyToClipboard(text)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-brand-orange transition-all">
                    <Copy size={20} />
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{text}</p>
                <div className="mt-6 flex gap-2">
                   <button className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-100">Save</button>
                   <button className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-100">Edit</button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-orange shadow-lg">
                  {activeTool === 'Captions' ? <Sparkles size={40} /> : <MessageSquareQuote size={40} />}
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {activeTool === 'Captions' ? 'Ready to boost your sales?' : 'Respond like a pro!'}
                  </h3>
                  <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                    {activeTool === 'Captions' ? 'Select a post type and let Gemini write captions.' : 'Paste a review and let Gemini write a professional reply.'}
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


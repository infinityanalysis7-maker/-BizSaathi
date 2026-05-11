import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Receipt, Users, Smartphone, TrendingUp } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function LandingPage() {
  const { userId } = auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white font-bold text-xl">B</div>
          <span className="text-2xl font-bold text-brand-dark">BizSaathi</span>
        </div>
        <Link 
          href="/sign-in" 
          className="text-brand-dark font-semibold hover:text-brand-orange transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full font-bold text-sm mb-8 animate-bounce">
          <Sparkles size={16} />
          <span>Made for Indian Small Businesses</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-brand-dark leading-tight mb-6">
          Ek App. <br className="md:hidden" /> 
          <span className="text-brand-orange text-shadow-glow">Poora Business.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          Manage customers, invoices, transactions, and AI marketing in one simple app. 
          BizSaathi is your digital partner for growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/sign-up" 
            className="px-8 py-5 bg-brand-orange text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Start Free Now <ArrowRight size={24} />
          </Link>
          <button className="px-8 py-5 bg-white text-brand-dark border-2 border-slate-200 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all">
            See Demo
          </button>
        </div>
        
        {/* Mobile App Mockup Placeholder */}
        <div className="mt-20 relative w-full max-w-lg aspect-[9/16] bg-slate-100 rounded-[3rem] border-[8px] border-brand-dark overflow-hidden shadow-2xl mx-auto">
          <div className="absolute inset-0 flex flex-col p-6">
             <div className="flex justify-between items-center mb-8">
               <div className="w-12 h-12 bg-brand-orange/20 rounded-full" />
               <div className="w-8 h-8 bg-slate-200 rounded-md" />
             </div>
             <div className="space-y-4">
               <div className="h-32 bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-end">
                  <div className="h-4 w-24 bg-slate-100 rounded mb-2" />
                  <div className="h-8 w-32 bg-brand-orange/10 rounded" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="h-24 bg-white rounded-2xl shadow-sm" />
                 <div className="h-24 bg-white rounded-2xl shadow-sm" />
               </div>
               <div className="h-48 bg-white rounded-2xl shadow-sm" />
             </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-slate-50 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Sab Kuch Jo Aapko Chahiye</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="text-brand-orange" />}
              title="Customer Management"
              desc="Keep track of every customer, their visit history, and special notes."
            />
            <FeatureCard 
              icon={<Receipt className="text-brand-orange" />}
              title="Professional Invoices"
              desc="Generate GST-ready invoices and share them instantly on WhatsApp."
            />
            <FeatureCard 
              icon={<Smartphone className="text-brand-orange" />}
              title="Mobile First"
              desc="Built to run perfectly on your phone. Simple buttons, large text."
            />
            <FeatureCard 
              icon={<Sparkles className="text-brand-orange" />}
              title="AI Marketing"
              desc="Let Gemini write your Instagram captions and Google review replies."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-brand-orange" />}
              title="Secure Data"
              desc="Your business data is safely stored in the cloud. Access anywhere."
            />
            <FeatureCard 
              icon={<TrendingUp className="text-brand-orange" />}
              title="Smart Reports"
              desc="See your daily sales, expenses, and profits with beautiful charts."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-brand-dark mb-4">3 Simple Steps to Digital Success</h2>
          <p className="text-slate-500">Business management has never been this easy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          <StepCard number="01" title="Register Business" desc="Sign up and enter your basic business details in 2 minutes." />
          <StepCard number="02" title="Add Customers" desc="Import your contacts and track their visits and payments." />
          <StepCard number="03" title="Grow with AI" desc="Use Gemini to send follow-ups and generate viral marketing posts." />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-24 bg-brand-dark text-white rounded-[4rem] mx-4 md:mx-10 my-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/20 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Choose Your Growth Plan</h2>
          <p className="text-slate-400 mb-16 max-w-xl">Start for free and upgrade as your business grows. No hidden charges.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <PricingCard 
              title="Free Plan" 
              price="₹0" 
              features={['Up to 50 Customers', '10 Invoices / Month', 'Basic AI Tips', 'Community Support']} 
              buttonText="Start Free"
              isPopular={false}
            />
            <PricingCard 
              title="Pro Plan" 
              price="₹999" 
              features={['Unlimited Customers', 'Unlimited Invoices', 'Full AI Suite', 'Advanced Reports', 'Priority Support']} 
              buttonText="Upgrade to Pro"
              isPopular={true}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-black text-brand-dark">Bharosa Bharat Ka</h2>
            <p className="text-slate-500 mt-2">Hear from business owners like you.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-orange transition-colors cursor-pointer">←</div>
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-orange transition-colors cursor-pointer">→</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="BizSaathi ne mere salon ka kaam itna aasaan kar diya hai. AI follow-ups se purane customers wapas aa rahe hain!"
            author="Sunita Sharma"
            business="Glow & Shine Parlour"
          />
          <TestimonialCard 
            quote="Invoice banana ab seconds ka kaam hai. GST reports bhi ready milti hain. Very professional app."
            author="Amit Patel"
            business="Patel Medical Store"
          />
          <TestimonialCard 
            quote="The Instagram caption generator is a lifesaver. Ab mujhe content likhne ki chinta nahi hoti."
            author="Rahul Verma"
            business="Royal Repair Shop"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-slate-100 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white font-bold text-xl">B</div>
            <span className="text-2xl font-bold text-brand-dark">BizSaathi</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            BizSaathi is on a mission to digitize every small business in India with the power of AI.
          </p>
          <div className="flex gap-4">
             <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-orange transition-all cursor-pointer">FB</div>
             <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-orange transition-all cursor-pointer">IG</div>
             <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-orange transition-all cursor-pointer">TW</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
           <div className="space-y-4">
              <h4 className="font-bold">Product</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                 <li>Features</li>
                 <li>Pricing</li>
                 <li>AI Tools</li>
                 <li>Reports</li>
              </ul>
           </div>
           <div className="space-y-4">
              <h4 className="font-bold">Company</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                 <li>About Us</li>
                 <li>Careers</li>
                 <li>Contact</li>
                 <li>Blog</li>
              </ul>
           </div>
           <div className="space-y-4">
              <h4 className="font-bold">Legal</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                 <li>Terms</li>
                 <li>Privacy</li>
                 <li>Cookies</li>
                 <li>Security</li>
              </ul>
           </div>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ title, price, features, buttonText, isPopular }: any) {
  return (
    <div className={cn(
      "p-10 rounded-[3rem] border transition-all flex flex-col items-start text-left relative",
      isPopular ? "bg-white text-brand-dark border-white shadow-2xl scale-105 z-10" : "bg-slate-800/50 text-white border-slate-700"
    )}>
      {isPopular && (
        <span className="absolute top-6 right-10 bg-brand-orange text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">Best Value</span>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-black">{price}</span>
        <span className={isPopular ? "text-slate-400" : "text-slate-500"}>/month</span>
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <CheckCircle2 size={18} className="text-brand-orange" /> {f}
          </li>
        ))}
      </ul>
      <button className={cn(
        "w-full py-4 rounded-2xl font-bold transition-all",
        isPopular ? "bg-brand-orange text-white shadow-xl shadow-orange-100" : "bg-white text-brand-dark"
      )}>
        {buttonText}
      </button>
    </div>
  );
}

function StepCard({ number, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 relative z-10">
      <div className="w-16 h-16 bg-white border-4 border-slate-50 rounded-3xl flex items-center justify-center text-2xl font-black text-brand-orange shadow-xl">
        {number}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, business }: any) {
  return (
    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
      <div className="flex gap-1 mb-6">
        {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-brand-orange fill-brand-orange" />)}
      </div>
      <p className="text-slate-700 italic mb-8 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-orange rounded-full" />
        <div>
          <p className="font-bold text-sm">{author}</p>
          <p className="text-[10px] text-slate-500 uppercase font-black">{business}</p>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle2, Star } from 'lucide-react';


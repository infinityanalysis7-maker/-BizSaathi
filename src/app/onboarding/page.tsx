'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Store, User, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const businessTypes = [
  'Salon/Parlour',
  'Medical Store',
  'Kirana Store',
  'Coaching Centre',
  'Repair Shop',
  'Restaurant/Dhaba',
  'Clothing Store',
  'Other'
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    ownerName: user?.fullName || '',
    city: '',
    whatsapp: ''
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.businessName) return toast.error('Please enter business name');
    if (step === 2 && !formData.businessType) return toast.error('Please select business type');
    if (step === 3 && !formData.ownerName) return toast.error('Please enter owner name');
    if (step === 4 && !formData.city) return toast.error('Please enter city');
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          name: formData.businessName,
          type: formData.businessType,
          owner_name: formData.ownerName,
          city: formData.city,
          whatsapp: formData.whatsapp,
          plan: 'free'
        });

      if (error) throw error;

      toast.success('Welcome to BizSaathi!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Onboarding Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Business Name',
      subtitle: 'Aapki dukaan ya business ka naam kya hai?',
      field: (
        <input
          autoFocus
          type="text"
          placeholder="e.g. Sharma Kirana Store"
          className="w-full p-4 text-xl border-2 border-slate-200 rounded-xl focus:border-brand-orange outline-none transition-all"
          value={formData.businessName}
          onChange={(e) => updateForm('businessName', e.target.value)}
        />
      ),
      icon: <Store className="text-brand-orange" size={32} />
    },
    {
      title: 'Business Type',
      subtitle: 'Aap kis tarah ka business karte hain?',
      field: (
        <div className="grid grid-cols-1 gap-3">
          {businessTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                updateForm('businessType', type);
                nextStep();
              }}
              className={`p-4 text-left text-lg rounded-xl border-2 transition-all ${
                formData.businessType === type 
                  ? 'border-brand-orange bg-brand-orange/5 font-bold' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      ),
      icon: <Store className="text-brand-orange" size={32} />
    },
    {
      title: 'Owner Name',
      subtitle: 'Aapka poora naam kya hai?',
      field: (
        <input
          autoFocus
          type="text"
          placeholder="e.g. Rahul Sharma"
          className="w-full p-4 text-xl border-2 border-slate-200 rounded-xl focus:border-brand-orange outline-none transition-all"
          value={formData.ownerName}
          onChange={(e) => updateForm('ownerName', e.target.value)}
        />
      ),
      icon: <User className="text-brand-orange" size={32} />
    },
    {
      title: 'City',
      subtitle: 'Aapka business kaunse sheher mein hai?',
      field: (
        <input
          autoFocus
          type="text"
          placeholder="e.g. Jaipur"
          className="w-full p-4 text-xl border-2 border-slate-200 rounded-xl focus:border-brand-orange outline-none transition-all"
          value={formData.city}
          onChange={(e) => updateForm('city', e.target.value)}
        />
      ),
      icon: <MapPin className="text-brand-orange" size={32} />
    },
    {
      title: 'WhatsApp Number',
      subtitle: 'Customers se judne ke liye number dein (Optional)',
      field: (
        <input
          autoFocus
          type="tel"
          placeholder="e.g. 9876543210"
          className="w-full p-4 text-xl border-2 border-slate-200 rounded-xl focus:border-brand-orange outline-none transition-all"
          value={formData.whatsapp}
          onChange={(e) => updateForm('whatsapp', e.target.value)}
        />
      ),
      icon: <Phone className="text-brand-orange" size={32} />
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all ${
                i + 1 <= step ? 'bg-brand-orange' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 bg-brand-orange/10 rounded-2xl">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{currentStepData.title}</h2>
                <p className="text-slate-500 mt-2">{currentStepData.subtitle}</p>
              </div>
            </div>

            <div className="mt-8">
              {currentStepData.field}
            </div>

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="flex-1 p-4 flex items-center justify-center gap-2 text-slate-500 font-bold text-lg rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <ArrowLeft size={20} /> Back
                </button>
              )}
              {step < steps.length ? (
                step !== 2 && ( // Skip next button for step 2 as it's auto-next
                  <button
                    onClick={nextStep}
                    className="flex-[2] p-4 flex items-center justify-center gap-2 bg-brand-orange text-white font-bold text-lg rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    Next <ArrowRight size={20} />
                  </button>
                )
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] p-4 flex items-center justify-center gap-2 bg-brand-orange text-white font-bold text-lg rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Start Business'} <CheckCircle2 size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

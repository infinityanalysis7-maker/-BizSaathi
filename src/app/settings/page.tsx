'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Receipt, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight,
  LogOut,
  Save,
  Trash2,
  Camera,
  Crown,
  FileDown,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Business' | 'Invoice' | 'Account'>('Business');
  const [plan, setPlan] = useState<'free' | 'pro'>('free');

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Settings</h1>
          <p className="text-slate-500">Manage your business and app preferences.</p>
        </div>
        <button onClick={handleLogout} className="px-6 py-3 text-red-600 font-bold flex items-center gap-2 hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Pro Plan Banner */}
      {plan === 'free' && (
        <div className="card bg-gradient-to-r from-brand-orange to-amber-500 text-white p-6 border-none shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
           <div className="absolute -right-10 -top-10 opacity-20 rotate-12">
              <Crown size={180} />
           </div>
           <div className="space-y-2 relative">
              <div className="flex items-center gap-2">
                 <Crown size={24} className="fill-white" />
                 <h2 className="text-2xl font-black">Upgrade to BizSaathi Pro</h2>
              </div>
              <p className="text-orange-50 max-w-md">Unlock unlimited customers, invoices, advanced AI insights and professional reports.</p>
           </div>
           <button className="px-8 py-4 bg-white text-brand-orange font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap z-10">
              Upgrade for ₹999/mo
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
           <SettingsTab active={activeTab === 'Business'} onClick={() => setActiveTab('Business')} icon={<Store size={20} />} label="Business Info" />
           <SettingsTab active={activeTab === 'Invoice'} onClick={() => setActiveTab('Invoice')} icon={<Receipt size={20} />} label="Invoicing" />
           <SettingsTab active={activeTab === 'Account'} onClick={() => setActiveTab('Account')} icon={<ShieldCheck size={20} />} label="Account & Safety" />
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">
           {activeTab === 'Business' && (
             <div className="card p-8 space-y-8 animate-in fade-in slide-in-from-right duration-300">
                <div className="flex items-center gap-6">
                   <div className="w-24 h-24 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 relative group cursor-pointer overflow-hidden">
                      <Camera size={24} />
                      <span className="text-[10px] font-bold mt-1 uppercase">Logo</span>
                      <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                         <Camera size={24} />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-bold">Business Branding</h3>
                      <p className="text-sm text-slate-500">Update your business identity.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Business Name" value="Sharma Hair Salon" />
                   <InputField label="Business Type" value="Salon/Parlour" isSelect options={['Salon/Parlour', 'Medical Store', 'Other']} />
                   <InputField label="City" value="Jaipur" />
                   <InputField label="WhatsApp Number" value="9876543210" />
                   <InputField label="GST Number (Optional)" value="22AAAAA0000A1Z5" />
                </div>

                <button className="btn-primary w-full md:w-auto">
                   <Save size={20} /> Save Changes
                </button>
             </div>
           )}

           {activeTab === 'Invoice' && (
              <div className="card p-8 space-y-8 animate-in fade-in slide-in-from-right duration-300">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                    <Receipt className="text-brand-orange" /> Invoice Customization
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Default GST %" value="18" />
                    <InputField label="Default Discount Type" value="Amount" isSelect options={['Amount', 'Percentage']} />
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase">Bank Details (Account No, IFSC, etc.)</label>
                       <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-orange h-24 text-sm" placeholder="HDFC Bank, AC: 1234567890, IFSC: HDFC0001234" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase">Footer Message</label>
                       <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-orange h-20 text-sm" value="Thank you for visiting! Come again soon." />
                    </div>
                 </div>
                 <button className="btn-primary w-full md:w-auto">
                    <Save size={20} /> Update Invoices
                 </button>
              </div>
           )}

           {activeTab === 'Account' && (
              <div className="card p-8 space-y-8 animate-in fade-in slide-in-from-right duration-300">
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold">Data Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <button className="p-4 border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-brand-dark transition-all group">
                          <div className="flex items-center gap-3">
                             <FileDown className="text-brand-dark" />
                             <div className="text-left">
                                <p className="font-bold">Export All Data</p>
                                <p className="text-[10px] text-slate-500 uppercase">CSV Format</p>
                             </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-dark" />
                       </button>
                       <button className="p-4 border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-brand-dark transition-all group">
                          <div className="flex items-center gap-3">
                             <Building2 className="text-brand-dark" />
                             <div className="text-left">
                                <p className="font-bold">Team Access</p>
                                <p className="text-[10px] text-slate-500 uppercase">Coming Soon</p>
                             </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-dark" />
                       </button>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-100 space-y-4">
                    <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
                    <p className="text-sm text-slate-500">Deleting your account will permanently remove all business data, customers, and invoices. This action cannot be undone.</p>
                    <button className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                       <Trash2 size={18} /> Delete Account
                    </button>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-2xl transition-all",
        active ? "bg-brand-dark text-white shadow-xl shadow-slate-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-bold">{label}</span>
      </div>
      <ChevronRight size={18} className={active ? "text-white" : "text-slate-300"} />
    </button>
  );
}

function InputField({ label, value, isSelect, options }: any) {
  return (
    <div className="space-y-2">
       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
       {isSelect ? (
         <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange font-medium appearance-none">
            {options.map((o: string) => <option key={o}>{o}</option>)}
         </select>
       ) : (
         <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange font-medium" value={value} />
       )}
    </div>
  );
}

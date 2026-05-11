'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  Share2, 
  CheckCircle2,
  IndianRupee,
  UserPlus
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [discount, setDiscount] = useState(0);
  const [useGst, setUseGst] = useState(false);
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const gstAmount = useGst ? subtotal * 0.18 : 0;
  const total = subtotal + gstAmount - discount;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, key: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [key]: value } : item));
  };

  const generatePDF = () => {
    if (!customer.name) return toast.error('Please add customer name');
    
    const doc = new jsPDF();
    const primaryColor = [249, 115, 22]; // brand-orange
    
    // Header
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('BizSaathi Invoice', 20, 25);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Invoice No: INV-${new Date().getFullYear()}-001`, 150, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 65);
    
    // Customer Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(customer.name, 20, 68);
    doc.text(customer.phone, 20, 74);
    
    // Table Header
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 90, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 25, 96);
    doc.text('Qty', 110, 96);
    doc.text('Price', 135, 96);
    doc.text('Total', 170, 96);
    
    // Items
    let y = 105;
    doc.setFont('helvetica', 'normal');
    items.forEach((item) => {
      doc.text(item.name || 'Service/Product', 25, y);
      doc.text(item.quantity.toString(), 110, y);
      doc.text(item.price.toString(), 135, y);
      doc.text((item.quantity * item.price).toString(), 170, y);
      y += 10;
    });
    
    // Summary
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 10;
    doc.text('Subtotal:', 140, y);
    doc.text(`Rs. ${subtotal}`, 170, y);
    y += 8;
    if (useGst) {
       doc.text('GST (18%):', 140, y);
       doc.text(`Rs. ${gstAmount}`, 170, y);
       y += 8;
    }
    if (discount > 0) {
       doc.text('Discount:', 140, y);
       doc.text(`-Rs. ${discount}`, 170, y);
       y += 8;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', 140, y);
    doc.text(`Rs. ${total}`, 170, y);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', 105, 270, { align: 'center' });
    doc.text('Generated via BizSaathi', 105, 275, { align: 'center' });
    
    doc.save(`Invoice_${customer.name}_${Date.now()}.pdf`);
    toast.success('Invoice Downloaded!');
  };

  const handleShare = () => {
    const message = `Namaste ${customer.name}! Aapka BizSaathi invoice ready hai. Total amount: ${formatCurrency(total)}. Dhanyawad!`;
    window.open(`https://wa.me/${customer.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-brand-dark">Create Invoice</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Customer Section */}
        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
               <UserPlus size={18} className="text-brand-orange" /> Customer Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Customer Name</label>
              <input 
                type="text" 
                placeholder="e.g. Rahul Kumar"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-orange"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
              <input 
                type="tel" 
                placeholder="e.g. 9876543210"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-orange"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Items Section */}
        <section className="card p-6 space-y-6">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <FileText size={18} className="text-brand-orange" /> Items & Services
          </h2>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                <div className="flex gap-3">
                   <div className="flex-[3] space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase">Item Name</label>
                     <input 
                       type="text" 
                       placeholder="e.g. Haircut"
                       className="w-full bg-transparent border-b border-slate-200 py-1 outline-none focus:border-brand-orange"
                       value={item.name}
                       onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                     />
                   </div>
                   <button 
                     onClick={() => removeItem(item.id)}
                     className="text-red-400 p-2 hover:text-red-600"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity</label>
                    <input 
                      type="number" 
                      className="w-full bg-transparent border-b border-slate-200 py-1 outline-none focus:border-brand-orange"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Price (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-transparent border-b border-slate-200 py-1 outline-none focus:border-brand-orange"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex-1 space-y-1 text-right">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Total</label>
                    <p className="py-1 font-bold">{formatCurrency(item.quantity * item.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addItem}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:border-brand-orange hover:text-brand-orange transition-all"
          >
            <Plus size={18} /> Add Another Item
          </button>
        </section>

        {/* Totals Section */}
        <section className="card p-6 space-y-4 bg-slate-900 text-white border-none shadow-xl">
           <div className="flex items-center justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-bold">{formatCurrency(subtotal)}</span>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Apply GST (18%)</span>
                <button 
                  onClick={() => setUseGst(!useGst)}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all",
                    useGst ? "bg-brand-orange" : "bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all",
                    useGst ? "left-5" : "left-1"
                  )} />
                </button>
              </div>
              <span className="font-bold">{useGst ? formatCurrency(gstAmount) : '₹0'}</span>
           </div>

           <div className="flex items-center justify-between">
              <span className="text-slate-400">Discount (₹)</span>
              <input 
                type="number"
                className="w-24 bg-slate-800 text-right p-1 rounded outline-none focus:ring-1 ring-brand-orange"
                value={discount}
                onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
              />
           </div>

           <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xl font-bold">Grand Total</span>
              <span className="text-2xl font-black text-brand-orange">{formatCurrency(total)}</span>
           </div>
        </section>

        {/* Status Section */}
        <section className="card p-6 flex items-center justify-between">
           <span className="font-bold text-slate-700">Payment Status</span>
           <div className="flex bg-slate-100 p-1 rounded-xl">
              {['Paid', 'Pending'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s as any)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-bold text-sm transition-all",
                    status === s ? "bg-white text-brand-dark shadow-sm" : "text-slate-500"
                  )}
                >
                  {s}
                </button>
              ))}
           </div>
        </section>
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:relative md:bg-transparent md:border-none flex gap-4 max-w-2xl mx-auto z-40">
        <button 
          onClick={generatePDF}
          className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200"
        >
          <Download size={20} /> PDF
        </button>
        <button 
          onClick={handleShare}
          className="flex-1 py-4 bg-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-100"
        >
          <Share2 size={20} /> WhatsApp
        </button>
        <button 
          className="flex-1 py-4 bg-brand-orange text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-100"
        >
          <CheckCircle2 size={20} /> Save
        </button>
      </div>
    </div>
  );
}

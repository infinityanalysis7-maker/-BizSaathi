export type BusinessPlan = 'free' | 'pro';

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  city: string;
  whatsapp?: string;
  logo_url?: string;
  gst_number?: string;
  plan: BusinessPlan;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  notes?: string;
  tag: 'VIP' | 'Regular' | 'New' | 'Lost';
  total_spent: number;
  last_visit?: string;
  payment_status: 'Clear' | 'Pending';
  created_at: string;
}

export interface Transaction {
  id: string;
  business_id: string;
  customer_id?: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
  payment_mode: 'Cash' | 'UPI' | 'Card' | 'Credit';
  notes?: string;
  date: string;
  created_at: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  business_id: string;
  customer_id: string;
  invoice_number: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Partial';
  notes?: string;
  created_at: string;
}

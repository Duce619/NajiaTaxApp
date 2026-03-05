import React from 'react';

export const PageHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
    <p className="text-slate-500 mt-1">{description}</p>
  </div>
);

export const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    {...props}
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${className}`}
  >
    {children}
  </div>
);

export const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input 
      {...props}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
    />
  </div>
);

export const ResultRow = ({ label, value, isTotal = false }: { label: string, value: string | number, isTotal?: boolean }) => (
  <div className={`flex justify-between items-center py-3 ${isTotal ? 'border-t border-slate-200 mt-2 font-bold text-lg' : 'border-b border-slate-50 text-slate-600'}`}>
    <span>{label}</span>
    <span className={isTotal ? 'text-emerald-700' : 'text-slate-900'}>{value}</span>
  </div>
);

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount);
};

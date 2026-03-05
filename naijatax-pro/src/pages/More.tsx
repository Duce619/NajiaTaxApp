import React from 'react';
import { PageHeader, Card } from '../components/UI';
import { 
  HandCoins, 
  ShieldCheck, 
  History, 
  ExternalLink,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MoreLink = ({ to, icon: Icon, label, description, external }: { to: string, icon: any, label: string, description: string, external?: boolean }) => {
  const Component = external ? 'a' : Link;
  const props = external ? { href: to, target: "_blank", rel: "noopener noreferrer" } : { to };

  return (
    <Component 
      {...props as any}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
    >
      <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-900">{label}</h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-400" />
    </Component>
  );
};

export default function More() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="More Tools" 
        description="Additional calculators, account settings, and legal information."
      />

      <div className="space-y-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Calculators & Tools</div>
        <MoreLink 
          to="/wht" 
          icon={HandCoins} 
          label="WHT Calculator" 
          description="Calculate Withholding Tax deductions." 
        />
        <MoreLink 
          to="/reminders" 
          icon={Bell} 
          label="Tax Reminders" 
          description="Manage automated filing alerts." 
        />
        <MoreLink 
          to="/history" 
          icon={History} 
          label="Calculation History" 
          description="View your saved tax estimates." 
        />

        <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Account & Support</div>
        <MoreLink 
          to="/legal" 
          icon={ShieldCheck} 
          label="Legal & Disclaimer" 
          description="Terms of use and tax authority disclaimer." 
        />

        <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">External Resources</div>
        <MoreLink 
          to="https://www.firs.gov.ng" 
          icon={ExternalLink} 
          label="FIRS Official Website" 
          description="Federal Inland Revenue Service portal." 
          external
        />
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NaijaTax Pro v1.0.0</p>
      </div>
    </div>
  );
}

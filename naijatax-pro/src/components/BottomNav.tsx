import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  Building2, 
  Users, 
  MoreHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors relative",
        isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
      )}
    >
      <div className="relative">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </NavLink>
  );
};

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        <NavItem to="/" icon={LayoutDashboard} label="Home" />
        <NavItem to="/vat" icon={Calculator} label="VAT" />
        <NavItem to="/cit" icon={Building2} label="CIT" />
        <NavItem to="/paye" icon={Users} label="PAYE" />
        <NavItem to="/more" icon={MoreHorizontal} label="More" />
      </div>
    </nav>
  );
};

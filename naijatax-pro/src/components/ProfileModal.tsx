import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Building2, Briefcase, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from './UI';

export const ProfileModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addProfile } = useApp();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !industry) return;
    
    const success = addProfile({ name, industry });
    if (success) {
      setName('');
      setIndustry('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={24} className="text-emerald-600" />
              Add Business Profile
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <Input 
              label="Business Name" 
              placeholder="e.g. Acme Corp Nigeria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Industry</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Services">Services</option>
                  <option value="Construction">Construction</option>
                  <option value="Oil & Gas">Oil & Gas</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Briefcase size={16} />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Create Profile
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

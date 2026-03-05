import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Input, formatCurrency } from '../components/UI';
import { calculatePAYE } from '../utils/taxEngine';
import { Users, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { historyEngine } from '../utils/historyEngine';

export default function PAYECalculator() {
  const { activeBusiness } = useApp();
  const [monthlyGross, setMonthlyGross] = useState<number>(0);

  const results = calculatePAYE(monthlyGross);

  // Auto-save logic
  useEffect(() => {
    if (!activeBusiness || results.monthlyTax === 0) return;

    const timer = setTimeout(() => {
      historyEngine.saveRecord({
        businessId: activeBusiness.id,
        businessName: activeBusiness.name,
        taxType: 'PAYE',
        inputValues: { monthlyGross },
        result: results.monthlyTax,
        taxYear: new Date().getFullYear(),
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [results.monthlyTax, activeBusiness, monthlyGross]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="PAYE Calculator" 
        description="Personal Income Tax (PAYE) calculation for employees based on current Nigerian tax laws."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-6 text-emerald-700 font-bold">
              <Users size={20} />
              Salary Details
            </div>
            
            <div className="space-y-4">
              <Input 
                label="Monthly Gross Salary" 
                type="number" 
                placeholder="0.00"
                value={monthlyGross || ''}
                onChange={(e) => setMonthlyGross(Number(e.target.value))}
              />
            </div>
          </Card>

          <Card className="bg-emerald-50 border-emerald-100">
            <div className="flex gap-3">
              <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">Reliefs & Deductions Applied</h4>
                <ul className="text-xs text-emerald-700 mt-2 space-y-1 list-disc ml-4">
                  <li>Pension Contribution: 8% of Gross</li>
                  <li>Consolidated Relief Allowance (CRA)</li>
                  <li>Progressive Tax Brackets (7% to 24%)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none">
            <h3 className="text-lg font-bold mb-6 text-slate-400">Monthly Breakdown</h3>
            
            <div className="space-y-1">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">Gross Monthly</span>
                <span>{formatCurrency(monthlyGross)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">Pension (8%)</span>
                <span className="text-red-400">-{formatCurrency(results.pension / 12)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">PAYE Tax</span>
                <span className="text-red-400">-{formatCurrency(results.monthlyTax)}</span>
              </div>
              
              <div className="flex justify-between items-center py-8 mt-4 border-t border-white/20">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-bold">
                    Net Take-Home Pay
                  </p>
                  <p className="text-4xl font-bold text-emerald-400">
                    {formatCurrency(results.netMonthly)}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Annual Overview</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-400 uppercase">Annual Tax</p>
                    <p className="font-bold text-sm">{formatCurrency(results.annualTax)}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-400 uppercase">Taxable Income</p>
                    <p className="font-bold text-sm">{formatCurrency(results.taxableIncome)}</p>
                  </div>
                </div>
              </div>
            </div>

            {activeBusiness && (
              <p className="text-[10px] text-slate-500 text-center mt-6 uppercase tracking-widest font-bold">
                Calculation saved to {activeBusiness.name} history
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

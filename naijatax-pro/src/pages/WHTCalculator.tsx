import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Input, formatCurrency } from '../components/UI';
import { calculateWHT } from '../utils/taxEngine';
import { WHT_RATES } from '../constants';
import { HandCoins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { historyEngine } from '../utils/historyEngine';

export default function WHTCalculator() {
  const { activeBusiness } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [selectedRate, setSelectedRate] = useState(WHT_RATES[0].rate);

  const results = calculateWHT(amount, selectedRate);

  // Auto-save logic
  useEffect(() => {
    if (!activeBusiness || results.deduction === 0) return;

    const timer = setTimeout(() => {
      historyEngine.saveRecord({
        businessId: activeBusiness.id,
        businessName: activeBusiness.name,
        taxType: 'WHT',
        inputValues: { amount, rate: selectedRate },
        result: results.deduction,
        taxYear: new Date().getFullYear(),
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [results.deduction, activeBusiness, amount, selectedRate]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="WHT Calculator" 
        description="Calculate Withholding Tax (WHT) deductions for various transaction types."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-6 text-emerald-700 font-bold">
              <HandCoins size={20} />
              Transaction Details
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Transaction Type</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={selectedRate}
                  onChange={(e) => setSelectedRate(Number(e.target.value))}
                >
                  {WHT_RATES.map((item, idx) => (
                    <option key={idx} value={item.rate}>{item.label} ({(item.rate * 100).toFixed(0)}%)</option>
                  ))}
                </select>
              </div>
              <Input 
                label="Gross Transaction Amount" 
                type="number" 
                placeholder="0.00"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none">
            <h3 className="text-lg font-bold mb-6 text-slate-400">WHT Summary</h3>
            
            <div className="space-y-1">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">Gross Amount</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">WHT Rate</span>
                <span className="font-bold">{(selectedRate * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between items-center py-6 mt-4">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-bold">
                    WHT Deduction
                  </p>
                  <p className="text-3xl font-bold text-amber-400">
                    {formatCurrency(results.deduction)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center py-6 border-t border-white/10">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-bold">
                    Net Amount Payable
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(results.netAmount)}
                  </p>
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

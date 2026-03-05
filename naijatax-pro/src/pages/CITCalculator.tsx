import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Input, formatCurrency } from '../components/UI';
import { calculateCIT } from '../utils/taxEngine';
import { Building2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { historyEngine } from '../utils/historyEngine';

export default function CITCalculator() {
  const { activeBusiness } = useApp();
  const [turnover, setTurnover] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);

  const results = calculateCIT(turnover, profit);

  // Auto-save logic
  useEffect(() => {
    if (!activeBusiness || results.finalTax === 0) return;

    const timer = setTimeout(() => {
      historyEngine.saveRecord({
        businessId: activeBusiness.id,
        businessName: activeBusiness.name,
        taxType: 'CIT',
        inputValues: { turnover, profit },
        result: results.finalTax,
        taxYear: new Date().getFullYear(),
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [results.finalTax, activeBusiness, turnover, profit]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="CIT Calculator" 
        description="Company Income Tax calculation based on turnover thresholds and minimum tax rules."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-6 text-emerald-700 font-bold">
              <Building2 size={20} />
              Financial Data
            </div>
            
            <div className="space-y-4">
              <Input 
                label="Annual Turnover (Revenue)" 
                type="number" 
                placeholder="0.00"
                value={turnover || ''}
                onChange={(e) => setTurnover(Number(e.target.value))}
              />
              <Input 
                label="Assessable Profit" 
                type="number" 
                placeholder="0.00"
                value={profit || ''}
                onChange={(e) => setProfit(Number(e.target.value))}
              />
            </div>
          </Card>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
            <Info size={20} className="shrink-0" />
            <div>
              <p className="font-bold mb-1">Small Company Exemption:</p>
              Companies with turnover less than ₦25 million are exempt from CIT, but must still file tax returns.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none">
            <h3 className="text-lg font-bold mb-6 text-slate-400">CIT Breakdown</h3>
            
            <div className="space-y-1">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">Applicable CIT Rate</span>
                <span className="font-bold">{(results.citRate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">CIT on Profit</span>
                <span>{formatCurrency(results.citAmount)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">Minimum Tax (0.5% of Turnover)</span>
                <span>{formatCurrency(results.minTax)}</span>
              </div>
              
              <div className="flex justify-between items-center py-6 mt-4">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-bold">
                    Final Tax Payable
                  </p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatCurrency(results.finalTax)}
                  </p>
                  {results.isMinTaxApplied && (
                    <p className="text-[10px] text-amber-400 mt-1 uppercase font-bold tracking-widest">
                      Minimum Tax Rule Applied
                    </p>
                  )}
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

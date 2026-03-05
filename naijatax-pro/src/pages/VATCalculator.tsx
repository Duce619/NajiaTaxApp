import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Input, formatCurrency } from '../components/UI';
import { calculateVAT } from '../utils/taxEngine';
import { Calculator, Download, Share2, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { historyEngine } from '../utils/historyEngine';

export default function VATCalculator() {
  const { activeBusiness } = useApp();
  const [sales, setSales] = useState<number>(0);
  const [purchases, setPurchases] = useState<number>(0);

  const results = calculateVAT(sales, purchases);

  // Auto-save logic
  useEffect(() => {
    if (!activeBusiness || results.payable === 0) return;

    const timer = setTimeout(() => {
      historyEngine.saveRecord({
        businessId: activeBusiness.id,
        businessName: activeBusiness.name,
        taxType: 'VAT',
        inputValues: { amount: sales, rate: 0.075, purchases },
        result: Math.abs(results.payable),
        taxYear: new Date().getFullYear(),
      });
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [results.payable, activeBusiness, sales, purchases]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="VAT Calculator" 
        description="Calculate Value Added Tax (VAT) payable or refundable based on 7.5% rate."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-6 text-emerald-700 font-bold">
              <Calculator size={20} />
              Input Details
            </div>
            
            <div className="space-y-4">
              <Input 
                label="Total Sales (Output VAT Base)" 
                type="number" 
                placeholder="0.00"
                value={sales || ''}
                onChange={(e) => setSales(Number(e.target.value))}
              />
              <Input 
                label="Total Purchases (Input VAT Base)" 
                type="number" 
                placeholder="0.00"
                value={purchases || ''}
                onChange={(e) => setPurchases(Number(e.target.value))}
              />
            </div>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-bold mb-1">Tax Tip:</p>
            Input VAT can only be claimed on goods purchased for resale or goods that form the stock-in-trade used for the direct production of new products.
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none">
            <h3 className="text-lg font-bold mb-6 text-slate-400">Calculation Summary</h3>
            
            <div className="space-y-1">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">Output VAT (7.5%)</span>
                <span>{formatCurrency(results.outputVAT)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400">Input VAT (7.5%)</span>
                <span>{formatCurrency(results.inputVAT)}</span>
              </div>
              
              <div className="flex justify-between items-center py-6 mt-4">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-bold">
                    {results.isRefundable ? 'VAT Refundable' : 'VAT Payable'}
                  </p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatCurrency(Math.abs(results.payable))}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${results.isRefundable ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {results.isRefundable ? 'Refund' : 'Payable'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl transition-colors text-sm font-bold">
                <Download size={16} /> Export
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl transition-colors text-sm font-bold">
                <Share2 size={16} /> Share
              </button>
            </div>
            
            {activeBusiness && (
              <p className="text-[10px] text-slate-500 text-center mt-4 uppercase tracking-widest font-bold">
                Calculation saved to {activeBusiness.name} history
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

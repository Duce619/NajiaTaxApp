import React from 'react';
import { PageHeader, Card, formatCurrency } from '../components/UI';
import { useApp } from '../context/AppContext';
import { useHistory } from '../hooks/useHistory';
import { Trash2, Calendar, History as HistoryIcon, Filter } from 'lucide-react';

export default function History() {
  const { profiles, activeProfileId } = useApp();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const { records, sortOrder, setSortOrder, removeRecord } = useHistory(activeProfileId || undefined);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTaxTypeLabel = (type: string) => {
    switch (type) {
      case 'VAT': return 'Value Added Tax';
      case 'CIT': return 'Company Income Tax';
      case 'PAYE': return 'Personal Income Tax';
      case 'WHT': return 'Withholding Tax';
      default: return type;
    }
  };

  const getInputSummary = (record: any) => {
    const { taxType, inputValues } = record;
    if (taxType === 'VAT') {
      return `Amount: ${formatCurrency(inputValues.amount)} @ ${(inputValues.rate * 100).toFixed(1)}%`;
    }
    if (taxType === 'CIT') {
      return `Turnover: ${formatCurrency(inputValues.turnover)}, Profit: ${formatCurrency(inputValues.profit)}`;
    }
    if (taxType === 'PAYE') {
      return `Monthly Gross: ${formatCurrency(inputValues.monthlyGross)}`;
    }
    if (taxType === 'WHT') {
      return `Amount: ${formatCurrency(inputValues.amount)} @ ${(inputValues.rate * 100).toFixed(0)}%`;
    }
    return '';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Calculation History" 
        description={activeProfile ? `Previous tax calculations for ${activeProfile.name}` : "View your previous tax calculation records."}
      />

      {!activeProfile ? (
        <Card className="text-center py-12">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Business Selected</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Please select a business profile from the Dashboard to view its specific calculation history.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <HistoryIcon size={16} />
              <span>{records.length} Records found</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort:</label>
              <select 
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {records.length === 0 ? (
            <Card className="text-center py-12 border-dashed">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="text-slate-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No History Yet</h3>
              <p className="text-slate-500">
                Calculations you perform for <strong>{activeProfile.name}</strong> will appear here automatically.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {records.map((record) => (
                <Card key={record.id} className="group hover:border-emerald-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          record.taxType === 'VAT' ? 'bg-blue-100 text-blue-700' :
                          record.taxType === 'CIT' ? 'bg-purple-100 text-purple-700' :
                          record.taxType === 'PAYE' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {record.taxType}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(record.createdAt)}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900">{getTaxTypeLabel(record.taxType)}</h4>
                      <p className="text-xs text-slate-500">{getInputSummary(record)}</p>
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-2">
                      <button 
                        onClick={() => removeRecord(record.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Tax Result</p>
                        <p className="text-xl font-bold text-emerald-600 leading-none">
                          {formatCurrency(record.result)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

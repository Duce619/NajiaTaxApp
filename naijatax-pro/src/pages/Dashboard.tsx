import React, { useMemo } from 'react';
import { PageHeader, Card, formatCurrency } from '../components/UI';
import { ProfileModal } from '../components/ProfileModal';
import { useApp } from '../context/AppContext';
import { useHistory } from '../hooks/useHistory';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  HandCoins, 
  Plus,
  ArrowRight,
  Trash2,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <Card className="flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </Card>
);

export default function Dashboard() {
  const { profiles, activeProfileId, setActiveProfileId, deleteProfile } = useApp();
  const { records } = useHistory(activeProfileId || undefined);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const totals = useMemo(() => {
    return records.reduce((acc, curr) => {
      acc[curr.taxType] = (acc[curr.taxType] || 0) + curr.result;
      return acc;
    }, {} as Record<string, number>);
  }, [records]);

  const recentRecords = records.slice(0, 3);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back{activeProfile ? `, ${activeProfile.name}` : ''}
          </h1>
          <p className="text-slate-500 mt-1">Here's your business tax overview for 2025.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StatCard 
              title="Total VAT" 
              value={formatCurrency(totals['VAT'] || 0)} 
              icon={TrendingUp} 
              color="bg-emerald-100 text-emerald-600" 
            />
            <StatCard 
              title="Total PAYE" 
              value={formatCurrency(totals['PAYE'] || 0)} 
              icon={Users} 
              color="bg-blue-100 text-blue-600" 
            />
            <StatCard 
              title="Total CIT" 
              value={formatCurrency(totals['CIT'] || 0)} 
              icon={Building2} 
              color="bg-purple-100 text-purple-600" 
            />
            <StatCard 
              title="Total WHT" 
              value={formatCurrency(totals['WHT'] || 0)} 
              icon={HandCoins} 
              color="bg-orange-100 text-orange-600" 
            />
          </div>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Recent Calculations</h3>
              <Link to="/history" className="text-emerald-600 text-sm font-bold hover:underline">View All</Link>
            </div>
            
            {recentRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <TrendingUp size={32} />
                </div>
                <p className="text-slate-500 max-w-xs">No recent calculations found. Start by using one of our tax tools.</p>
                <Link to="/vat" className="mt-4 text-emerald-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  Try VAT Calculator <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRecords.map(record => (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        record.taxType === 'VAT' ? 'bg-blue-100 text-blue-600' :
                        record.taxType === 'CIT' ? 'bg-purple-100 text-purple-600' :
                        record.taxType === 'PAYE' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{record.taxType} Calculation</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900">{formatCurrency(record.result)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Business Profiles</h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            
            {profiles.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 mb-4">Create profiles to manage multiple businesses.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Add First Profile
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {profiles.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setActiveProfileId(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${activeProfileId === p.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.industry}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProfile(p.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
            <h4 className="font-bold text-lg mb-2">Tax Calendar</h4>
            <p className="text-emerald-100 text-sm mb-4">Next VAT filing deadline is the 21st of next month.</p>
            <Link 
              to="/reminders"
              className="block w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors text-center"
            >
              Set Reminders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

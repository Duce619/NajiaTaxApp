import React from 'react';
import { ShieldCheck, Download, X } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
        setShow(false);
      });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-4 animate-in slide-in-from-bottom-4">
      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
        <Download size={20} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900">Install NaijaTax</p>
        <p className="text-xs text-slate-500">Add to home screen for offline use.</p>
      </div>
      <button 
        onClick={handleInstall}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
      >
        Install
      </button>
      <button onClick={() => setShow(false)} className="text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
    </div>
  );
};

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstallPrompt />
      
      {/* Top Header (Optional but good for branding) */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldCheck size={24} className="text-emerald-600" />
          <span className="font-bold text-slate-900 tracking-tight">NaijaTax</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        <div className="max-w-2xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

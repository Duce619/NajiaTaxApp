import React from 'react';
import { PageHeader, Card } from '../components/UI';
import { ShieldAlert, ExternalLink, Scale } from 'lucide-react';

export default function Legal() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <PageHeader 
        title="Legal & Compliance" 
        description="Important information regarding the use of this application."
      />

      <div className="space-y-8">
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex gap-4">
            <ShieldAlert className="text-amber-500 shrink-0" size={24} />
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Disclaimer</h3>
              <p className="text-slate-600 leading-relaxed">
                NaijaTax is a private software application designed for informational and estimation purposes only. 
                <strong> This app is not affiliated with, endorsed by, or connected to any government tax authority</strong>, 
                including the Federal Inland Revenue Service (FIRS) or any State Internal Revenue Service (SIRS).
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Scale size={20} className="text-emerald-600" />
            Terms of Use
          </h3>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
            <p>
              1. <strong>Accuracy:</strong> While we strive to maintain accurate and up-to-date tax logic based on the Finance Act, 
              tax laws are subject to frequent changes. We do not guarantee the absolute accuracy of any calculation.
            </p>
            <p>
              2. <strong>Professional Advice:</strong> The results provided by this application should not be considered professional tax, legal, or accounting advice. 
              Users are strongly encouraged to consult with qualified tax professionals or chartered accountants before making any financial decisions or tax filings.
            </p>
            <p>
              3. <strong>Liability:</strong> The developers of NaijaTax shall not be held liable for any errors, omissions, or financial losses 
              resulting from the use of this application.
            </p>
          </div>
        </div>

        <Card>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Official Resources</h3>
          <div className="space-y-3">
            <a 
              href="https://www.firs.gov.ng" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
            >
              <span className="font-medium text-slate-700">Federal Inland Revenue Service (FIRS)</span>
              <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-600" />
            </a>
            <a 
              href="https://www.firs.gov.ng/Tax-Laws" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
            >
              <span className="font-medium text-slate-700">Nigerian Tax Laws & Finance Acts</span>
              <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-600" />
            </a>
          </div>
        </Card>

        <div className="text-center text-slate-400 text-xs pt-8">
          Last Updated: March 2025
        </div>
      </div>
    </div>
  );
}

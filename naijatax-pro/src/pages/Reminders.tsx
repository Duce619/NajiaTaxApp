import React from 'react';
import { PageHeader, Card } from '../components/UI';
import { useReminders } from '../hooks/useReminders';
import { calculateNextDeadline, calculateNextReminderDate, formatReminderDate } from '../utils/reminderEngine';
import { 
  Bell, 
  BellOff, 
  Calendar, 
  Settings2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Reminders() {
  const { 
    reminders, 
    permission, 
    requestPermission, 
    toggleReminder, 
    updateDaysBefore,
    sendTestNotification 
  } = useReminders();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Tax Reminders" 
        description="Stay compliant with automated filing deadlines and remittance alerts."
      />

      <div className="space-y-6">
        {permission !== 'granted' && (
          <Card className="bg-amber-50 border-amber-100">
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                <BellOff size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900">Notifications Disabled</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Enable notifications to receive timely tax alerts on this device.
                </p>
                <button 
                  onClick={requestPermission}
                  className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors"
                >
                  Enable Notifications
                </button>
              </div>
            </div>
          </Card>
        )}

        {permission === 'granted' && (
          <Card className="bg-emerald-50 border-emerald-100">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-emerald-900">Notifications Active</h3>
                <p className="text-sm text-emerald-700">
                  You will receive alerts based on your settings below.
                </p>
              </div>
              <button 
                onClick={sendTestNotification}
                className="text-emerald-600 text-sm font-bold hover:underline"
              >
                Send Test
              </button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-1">
            <Settings2 size={20} className="text-emerald-600" />
            Reminder Settings
          </h3>

          {reminders.map((reminder) => {
            const nextDeadline = calculateNextDeadline(reminder);
            const nextReminder = calculateNextReminderDate(reminder);

            return (
              <Card key={reminder.id} className="overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{reminder.label}</h4>
                      {!reminder.enabled && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">Disabled</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{reminder.description}</p>
                    
                    {reminder.enabled && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Next Deadline</p>
                          <p className="text-xs font-bold text-slate-700">{formatReminderDate(nextDeadline)}</p>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-lg">
                          <p className="text-[10px] text-emerald-600 uppercase font-bold">Reminder Set For</p>
                          <p className="text-xs font-bold text-emerald-700">{formatReminderDate(nextReminder)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={reminder.enabled}
                        onChange={() => toggleReminder(reminder.id)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>

                    {reminder.enabled && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Days Before:</span>
                        <select 
                          value={reminder.daysBefore}
                          onChange={(e) => updateDaysBefore(reminder.id, Number(e.target.value))}
                          className="text-xs font-bold bg-slate-100 border-none rounded p-1 outline-none"
                        >
                          {[1, 2, 3, 5, 7, 14].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="text-blue-600 shrink-0" size={20} />
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Note:</strong> Reminders are device-specific and rely on your browser's notification system. 
            Ensure you have notifications enabled for this site in your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
}

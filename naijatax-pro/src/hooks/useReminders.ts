import { useState, useEffect, useCallback } from 'react';
import { 
  TaxReminder, 
  DEFAULT_REMINDERS, 
  calculateNextReminderDate 
} from '../utils/reminderEngine';

export const useReminders = () => {
  const [reminders, setReminders] = useState<TaxReminder[]>(() => {
    const saved = localStorage.getItem('tax_reminders');
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
  });

  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    localStorage.setItem('tax_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const updateDaysBefore = (id: string, days: number) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, daysBefore: days } : r
    ));
  };

  const sendTestNotification = () => {
    if (permission !== 'granted') {
      alert('Please enable notifications first.');
      return;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('NaijaTax Test', {
          body: 'This is a test notification from your Tax Calculator.',
          icon: 'https://picsum.photos/id/119/192/192',
          badge: 'https://picsum.photos/id/119/192/192',
          tag: 'test-notification',
        });
      });
    }
  };

  const checkAndTriggerReminders = useCallback(() => {
    if (permission !== 'granted') return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const lastCheck = localStorage.getItem('last_reminder_check');

    if (lastCheck === todayStr) return;

    reminders.forEach(reminder => {
      if (!reminder.enabled) return;

      const reminderDate = calculateNextReminderDate(reminder);
      const reminderDateStr = reminderDate.toISOString().split('T')[0];

      if (todayStr === reminderDateStr) {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(`${reminder.label} Reminder`, {
              body: `Your ${reminder.label} is due soon. Don't forget to file!`,
              icon: 'https://picsum.photos/id/119/192/192',
              tag: `tax-reminder-${reminder.id}-${todayStr}`,
            });
          });
        }
      }
    });

    localStorage.setItem('last_reminder_check', todayStr);
  }, [reminders, permission]);

  useEffect(() => {
    checkAndTriggerReminders();
  }, [checkAndTriggerReminders]);

  return {
    reminders,
    permission,
    requestPermission,
    toggleReminder,
    updateDaysBefore,
    sendTestNotification,
  };
};

export interface TaxReminder {
  id: string;
  label: string;
  description: string;
  dayOfMonth: number; // Deadline day
  monthOfYear?: number; // For annual taxes (0-11)
  enabled: boolean;
  daysBefore: number;
}

export const DEFAULT_REMINDERS: TaxReminder[] = [
  {
    id: 'vat',
    label: 'VAT Filing',
    description: 'Monthly Value Added Tax return filing.',
    dayOfMonth: 21,
    enabled: true,
    daysBefore: 5,
  },
  {
    id: 'paye',
    label: 'PAYE Remittance',
    description: 'Monthly Personal Income Tax remittance.',
    dayOfMonth: 10,
    enabled: true,
    daysBefore: 3,
  },
  {
    id: 'wht',
    label: 'WHT Filing',
    description: 'Monthly Withholding Tax return filing.',
    dayOfMonth: 21,
    enabled: true,
    daysBefore: 5,
  },
  {
    id: 'cit',
    label: 'Annual CIT',
    description: 'Annual Company Income Tax return.',
    dayOfMonth: 30,
    monthOfYear: 5, // June
    enabled: true,
    daysBefore: 14,
  },
];

export const calculateNextDeadline = (reminder: TaxReminder): Date => {
  const now = new Date();
  let deadline = new Date(now.getFullYear(), now.getMonth(), reminder.dayOfMonth);

  if (reminder.monthOfYear !== undefined) {
    deadline.setMonth(reminder.monthOfYear);
    if (deadline < now) {
      deadline.setFullYear(deadline.getFullYear() + 1);
    }
  } else {
    if (deadline < now) {
      deadline.setMonth(deadline.getMonth() + 1);
    }
  }

  return deadline;
};

export const calculateNextReminderDate = (reminder: TaxReminder): Date => {
  const deadline = calculateNextDeadline(reminder);
  const reminderDate = new Date(deadline);
  reminderDate.setDate(deadline.getDate() - reminder.daysBefore);
  return reminderDate;
};

export const formatReminderDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

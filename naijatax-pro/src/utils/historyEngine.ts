export type TaxType = 'VAT' | 'CIT' | 'PAYE' | 'WHT';

export interface HistoryRecord {
  id: string;
  businessId: string;
  businessName: string;
  taxType: TaxType;
  inputValues: Record<string, any>;
  result: number;
  taxYear: number;
  createdAt: string;
}

const STORAGE_KEY = 'tax_history';

export const historyEngine = {
  saveRecord: (record: Omit<HistoryRecord, 'id' | 'createdAt'>): HistoryRecord => {
    const history = historyEngine.getRecords();
    
    // Check for duplicates (same business, same tax type, same inputs, same result within last 5 minutes)
    const now = new Date();
    const isDuplicate = history.some(r => {
      const rDate = new Date(r.createdAt);
      const timeDiff = (now.getTime() - rDate.getTime()) / 1000 / 60;
      return r.businessId === record.businessId &&
             r.taxType === record.taxType &&
             r.result === record.result &&
             JSON.stringify(r.inputValues) === JSON.stringify(record.inputValues) &&
             timeDiff < 5;
    });

    if (isDuplicate) {
      return history.find(r => r.businessId === record.businessId && r.taxType === record.taxType)!;
    }

    const newRecord: HistoryRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: now.toISOString(),
    };

    const updatedHistory = [newRecord, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newRecord;
  },

  getRecords: (): HistoryRecord[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse tax history', e);
      return [];
    }
  },

  deleteRecord: (id: string): void => {
    const history = historyEngine.getRecords();
    const updatedHistory = history.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  },

  sortRecords: (records: HistoryRecord[], order: 'newest' | 'oldest'): HistoryRecord[] => {
    return [...records].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }
};

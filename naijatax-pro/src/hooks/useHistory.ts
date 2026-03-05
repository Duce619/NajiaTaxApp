import { useState, useEffect, useCallback } from 'react';
import { historyEngine, HistoryRecord } from '../utils/historyEngine';

export function useHistory(businessId?: string) {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const refreshHistory = useCallback(() => {
    let allRecords = historyEngine.getRecords();
    
    if (businessId) {
      allRecords = allRecords.filter(r => r.businessId === businessId);
    }

    const sorted = historyEngine.sortRecords(allRecords, sortOrder);
    setRecords(sorted);
  }, [businessId, sortOrder]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const addRecord = (record: Omit<HistoryRecord, 'id' | 'createdAt'>) => {
    historyEngine.saveRecord(record);
    refreshHistory();
  };

  const removeRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this calculation record?')) {
      historyEngine.deleteRecord(id);
      refreshHistory();
    }
  };

  return {
    records,
    sortOrder,
    setSortOrder,
    addRecord,
    removeRecord,
    refreshHistory
  };
}

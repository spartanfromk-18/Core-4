import { useState } from 'react';

export interface LogicTrace {
  id: string;
  timestamp: number;
  query: string;
  university: string;
  result: string;
  confidenceScore: number;
}

const STORAGE_KEY = 'unsmart_logic_traces';
const PREF_KEY = 'unsmart_pref_university';

export const useSearchHistory = () => {
  const [traces, setTraces] = useState<LogicTrace[]>(() => {
    const storedTraces = localStorage.getItem(STORAGE_KEY);
    if (storedTraces) {
      try {
        return JSON.parse(storedTraces);
      } catch (e) {
        console.error('Failed to parse logic traces', e);
      }
    }
    return [];
  });
  
  const [preferredUniversity, setPreferredUniversity] = useState<string>(() => {
    return localStorage.getItem(PREF_KEY) || 'AKTU';
  });

  const addTrace = (trace: Omit<LogicTrace, 'id' | 'timestamp'>) => {
    const newTrace: LogicTrace = {
      ...trace,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setTraces((prevTraces) => {
      const updatedTraces = [newTrace, ...prevTraces].slice(0, 5); // Keep last 5
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTraces));
      return updatedTraces;
    });
  };

  const updatePreferredUniversity = (uni: string) => {
    setPreferredUniversity(uni);
    localStorage.setItem(PREF_KEY, uni);
  };

  const clearHistory = () => {
    setTraces([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    traces,
    addTrace,
    preferredUniversity,
    updatePreferredUniversity,
    clearHistory,
  };
};

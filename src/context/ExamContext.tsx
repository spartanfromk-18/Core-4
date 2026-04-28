import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import universityPatterns from '../data/university_patterns.json';

export interface ExamContextType {
  university: string;
  setUniversity: (uni: string) => void;
  college: string;
  setCollege: (col: string) => void;
  semester: string;
  setSemester: (sem: string) => void;
  getAiPromptInstructions: () => string[];
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [university, setUniversity] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [semester, setSemester] = useState<string>('');

  const getAiPromptInstructions = React.useCallback(() => {
    if (university === 'AKTU') {
      const pattern = (universityPatterns as Record<string, { aiInstructions?: string[] }>).AKTU;
      if (pattern && pattern.aiInstructions) {
        return pattern.aiInstructions;
      }
    }
    return [];
  }, [university]);

  const value = useMemo(
    () => ({
      university,
      setUniversity,
      college,
      setCollege,
      semester,
      setSemester,
      getAiPromptInstructions,
    }),
    [university, college, semester, getAiPromptInstructions]
  );

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useExamContext = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExamContext must be used within an ExamProvider');
  }
  return context;
};

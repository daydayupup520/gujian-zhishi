import { useState, createContext, useContext, type ReactNode } from 'react';
import type { RecognitionResult } from '../types/ai';

interface AppContextType {
  recognitionResult: RecognitionResult | null;
  setRecognitionResult: (result: RecognitionResult | null) => void;
  clearRecognitionResult: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [recognitionResult, setRecognitionResultState] = useState<RecognitionResult | null>(() => {
    // 从 localStorage 恢复数据
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gujian-recognition-result');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const setRecognitionResult = (result: RecognitionResult | null) => {
    setRecognitionResultState(result);
    if (result) {
      localStorage.setItem('gujian-recognition-result', JSON.stringify(result));
    } else {
      localStorage.removeItem('gujian-recognition-result');
    }
  };

  const clearRecognitionResult = () => {
    setRecognitionResultState(null);
    localStorage.removeItem('gujian-recognition-result');
  };

  return (
    <AppContext.Provider value={{ recognitionResult, setRecognitionResult, clearRecognitionResult }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

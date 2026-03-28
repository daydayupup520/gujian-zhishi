import { useState, type ReactNode } from 'react';
import { AppContext } from './AppContextDef';
import type { RecognitionResult } from '../types/ai';

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

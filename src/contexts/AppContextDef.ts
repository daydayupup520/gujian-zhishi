import { createContext } from 'react';
import type { RecognitionResult } from '../types/ai';

export interface AppContextType {
  recognitionResult: RecognitionResult | null;
  setRecognitionResult: (result: RecognitionResult | null) => void;
  clearRecognitionResult: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

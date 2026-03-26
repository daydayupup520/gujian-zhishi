/**
 * AI 相关类型定义
 */

export interface RecognitionResult {
  name: string;
  category: '民居' | '官府' | '皇宫' | '桥梁' | '其他';
  era: string;
  year: string;
  location: string;
  features: string[];
  description: string;
  confidence: number;
  components?: {
    dougongType: string;
    beastCount: number;
    beastTypes: string[];
    paintingPattern: string;
    roofType: string;
    confidence: number;
  };
  fusion?: {
    imageCount: number;
    consistency: number;
    crossViewSummary: string;
  };
  gis?: {
    placeName: string;
    lat: number;
    lng: number;
    dynastyContext: string;
    territoryLevel: string;
    timeline: Array<{
      period: string;
      territoryContext: string;
      locationRole: string;
    }>;
  };
}

export interface AIResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

import Dexie, { type Table } from 'dexie';
import type { RecognitionResult } from '../../types/ai';

// 识别历史记录
export interface RecognitionHistory {
  id?: number;
  timestamp: number;
  result: RecognitionResult;
  imageCount: number;
  notes?: string;
}

// 收藏的建筑
export interface FavoriteBuilding {
  id?: number;
  buildingId: string;
  name: string;
  category: string;
  era: string;
  location: string;
  addedAt: number;
}

// 病害记录
export interface DiseaseRecord {
  id?: number;
  buildingId: string;
  buildingName: string;
  diseaseType: string;
  severity: '轻微' | '中度' | '严重';
  position: string;
  description: string;
  recommendation: string;
  estimatedCost: string;
  urgency: '立即处理' | '近期处理' | '定期监测';
  recordedAt: number;
  status: 'pending' | 'in_progress' | 'completed';
}

// 建筑对比组
export interface ComparisonGroup {
  id?: number;
  name: string;
  buildingIds: string[];
  createdAt: number;
  notes?: string;
}

// 用户设置
export interface UserSettings {
  id?: number;
  key: string;
  value: unknown;
  updatedAt: number;
}

class GujianDatabase extends Dexie {
  recognitionHistory!: Table<RecognitionHistory>;
  favoriteBuildings!: Table<FavoriteBuilding>;
  diseaseRecords!: Table<DiseaseRecord>;
  comparisonGroups!: Table<ComparisonGroup>;
  settings!: Table<UserSettings>;

  constructor() {
    super('GujianZhishiDB');
    
    this.version(1).stores({
      recognitionHistory: '++id, timestamp, [result.category]',
      favoriteBuildings: '++id, buildingId, category, addedAt',
      diseaseRecords: '++id, buildingId, diseaseType, severity, recordedAt, status',
      comparisonGroups: '++id, name, createdAt',
      settings: '++id, key, updatedAt'
    });
  }
}

export const db = new GujianDatabase();

// 识别历史操作
export const recognitionHistoryDB = {
  async add(result: RecognitionResult, imageCount: number, notes?: string): Promise<number> {
    return await db.recognitionHistory.add({
      timestamp: Date.now(),
      result,
      imageCount,
      notes
    });
  },

  async getAll(): Promise<RecognitionHistory[]> {
    return await db.recognitionHistory
      .orderBy('timestamp')
      .reverse()
      .toArray();
  },

  async getByCategory(category: string): Promise<RecognitionHistory[]> {
    return await db.recognitionHistory
      .where('result.category')
      .equals(category)
      .reverse()
      .sortBy('timestamp');
  },

  async delete(id: number): Promise<void> {
    await db.recognitionHistory.delete(id);
  },

  async clear(): Promise<void> {
    await db.recognitionHistory.clear();
  }
};

// 收藏建筑操作
export const favoriteBuildingsDB = {
  async add(building: Omit<FavoriteBuilding, 'id' | 'addedAt'>): Promise<number> {
    const existing = await db.favoriteBuildings
      .where('buildingId')
      .equals(building.buildingId)
      .first();
    
    if (existing) {
      return existing.id!;
    }

    return await db.favoriteBuildings.add({
      ...building,
      addedAt: Date.now()
    });
  },

  async getAll(): Promise<FavoriteBuilding[]> {
    return await db.favoriteBuildings
      .orderBy('addedAt')
      .reverse()
      .toArray();
  },

  async isFavorite(buildingId: string): Promise<boolean> {
    const count = await db.favoriteBuildings
      .where('buildingId')
      .equals(buildingId)
      .count();
    return count > 0;
  },

  async remove(buildingId: string): Promise<void> {
    await db.favoriteBuildings
      .where('buildingId')
      .equals(buildingId)
      .delete();
  },

  async toggle(building: Omit<FavoriteBuilding, 'id' | 'addedAt'>): Promise<boolean> {
    const isFav = await this.isFavorite(building.buildingId);
    if (isFav) {
      await this.remove(building.buildingId);
      return false;
    } else {
      await this.add(building);
      return true;
    }
  }
};

// 病害记录操作
export const diseaseRecordsDB = {
  async add(record: Omit<DiseaseRecord, 'id' | 'recordedAt'>): Promise<number> {
    return await db.diseaseRecords.add({
      ...record,
      recordedAt: Date.now()
    });
  },

  async getByBuilding(buildingId: string): Promise<DiseaseRecord[]> {
    return await db.diseaseRecords
      .where('buildingId')
      .equals(buildingId)
      .reverse()
      .sortBy('recordedAt');
  },

  async getAll(): Promise<DiseaseRecord[]> {
    return await db.diseaseRecords
      .orderBy('recordedAt')
      .reverse()
      .toArray();
  },

  async updateStatus(id: number, status: DiseaseRecord['status']): Promise<void> {
    await db.diseaseRecords.update(id, { status });
  },

  async delete(id: number): Promise<void> {
    await db.diseaseRecords.delete(id);
  },

  async getStatistics() {
    const records = await this.getAll();
    return {
      total: records.length,
      bySeverity: {
        严重: records.filter(r => r.severity === '严重').length,
        中度: records.filter(r => r.severity === '中度').length,
        轻微: records.filter(r => r.severity === '轻微').length
      },
      byStatus: {
        pending: records.filter(r => r.status === 'pending').length,
        in_progress: records.filter(r => r.status === 'in_progress').length,
        completed: records.filter(r => r.status === 'completed').length
      }
    };
  }
};

// 对比组操作
export const comparisonGroupsDB = {
  async add(name: string, buildingIds: string[], notes?: string): Promise<number> {
    return await db.comparisonGroups.add({
      name,
      buildingIds,
      createdAt: Date.now(),
      notes
    });
  },

  async getAll(): Promise<ComparisonGroup[]> {
    return await db.comparisonGroups
      .orderBy('createdAt')
      .reverse()
      .toArray();
  },

  async update(id: number, updates: Partial<Omit<ComparisonGroup, 'id'>>): Promise<void> {
    await db.comparisonGroups.update(id, updates);
  },

  async delete(id: number): Promise<void> {
    await db.comparisonGroups.delete(id);
  }
};

// 设置操作
export const settingsDB = {
  async set(key: string, value: unknown): Promise<void> {
    const existing = await db.settings.where('key').equals(key).first();
    if (existing) {
      await db.settings.update(existing.id!, { value, updatedAt: Date.now() });
    } else {
      await db.settings.add({ key, value, updatedAt: Date.now() });
    }
  },

  async get(key: string, defaultValue?: unknown): Promise<unknown> {
    const setting = await db.settings.where('key').equals(key).first();
    return setting ? setting.value : defaultValue;
  },

  async remove(key: string): Promise<void> {
    await db.settings.where('key').equals(key).delete();
  }
};

export default db;

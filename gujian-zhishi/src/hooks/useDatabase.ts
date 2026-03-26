import { useState, useEffect, useCallback } from 'react';
import { recognitionHistoryDB, favoriteBuildingsDB, diseaseRecordsDB, comparisonGroupsDB } from '../lib/db';
import type { RecognitionHistory, FavoriteBuilding, DiseaseRecord, ComparisonGroup } from '../lib/db';
import type { RecognitionResult } from '../types/ai';

// 识别历史 Hook
export function useRecognitionHistory() {
  const [history, setHistory] = useState<RecognitionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recognitionHistoryDB.getAll();
      setHistory(data);
    } catch (error) {
      console.error('加载识别历史失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(async (result: RecognitionResult, imageCount: number, notes?: string) => {
    try {
      const id = await recognitionHistoryDB.add(result, imageCount, notes);
      await loadHistory();
      return id;
    } catch (error) {
      console.error('添加识别历史失败:', error);
      return null;
    }
  }, [loadHistory]);

  const deleteFromHistory = useCallback(async (id: number) => {
    try {
      await recognitionHistoryDB.delete(id);
      await loadHistory();
    } catch (error) {
      console.error('删除识别历史失败:', error);
    }
  }, [loadHistory]);

  const clearHistory = useCallback(async () => {
    try {
      await recognitionHistoryDB.clear();
      await loadHistory();
    } catch (error) {
      console.error('清空识别历史失败:', error);
    }
  }, [loadHistory]);

  return { history, loading, addToHistory, deleteFromHistory, clearHistory, refresh: loadHistory };
}

// 收藏建筑 Hook
export function useFavoriteBuildings() {
  const [favorites, setFavorites] = useState<FavoriteBuilding[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await favoriteBuildingsDB.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('加载收藏失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback(async (buildingId: string): Promise<boolean> => {
    return await favoriteBuildingsDB.isFavorite(buildingId);
  }, []);

  const toggleFavorite = useCallback(async (building: {
    buildingId: string;
    name: string;
    category: string;
    era: string;
    location: string;
  }) => {
    try {
      const isFav = await favoriteBuildingsDB.toggle(building);
      await loadFavorites();
      return isFav;
    } catch (error) {
      console.error('切换收藏失败:', error);
      return false;
    }
  }, [loadFavorites]);

  const removeFavorite = useCallback(async (buildingId: string) => {
    try {
      await favoriteBuildingsDB.remove(buildingId);
      await loadFavorites();
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  }, [loadFavorites]);

  return { favorites, loading, isFavorite, toggleFavorite, removeFavorite, refresh: loadFavorites };
}

// 病害记录 Hook
export function useDiseaseRecords(buildingId?: string) {
  const [records, setRecords] = useState<DiseaseRecord[]>([]);
  const [statistics, setStatistics] = useState<{
    total: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      let data: DiseaseRecord[];
      if (buildingId) {
        data = await diseaseRecordsDB.getByBuilding(buildingId);
      } else {
        data = await diseaseRecordsDB.getAll();
      }
      setRecords(data);
      
      const stats = await diseaseRecordsDB.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('加载病害记录失败:', error);
    } finally {
      setLoading(false);
    }
  }, [buildingId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const addRecord = useCallback(async (record: Omit<DiseaseRecord, 'id' | 'recordedAt'>) => {
    try {
      const id = await diseaseRecordsDB.add(record);
      await loadRecords();
      return id;
    } catch (error) {
      console.error('添加病害记录失败:', error);
      return null;
    }
  }, [loadRecords]);

  const updateStatus = useCallback(async (id: number, status: DiseaseRecord['status']) => {
    try {
      await diseaseRecordsDB.updateStatus(id, status);
      await loadRecords();
    } catch (error) {
      console.error('更新病害状态失败:', error);
    }
  }, [loadRecords]);

  const deleteRecord = useCallback(async (id: number) => {
    try {
      await diseaseRecordsDB.delete(id);
      await loadRecords();
    } catch (error) {
      console.error('删除病害记录失败:', error);
    }
  }, [loadRecords]);

  return { records, statistics, loading, addRecord, updateStatus, deleteRecord, refresh: loadRecords };
}

// 对比组 Hook
export function useComparisonGroups() {
  const [groups, setGroups] = useState<ComparisonGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await comparisonGroupsDB.getAll();
      setGroups(data);
    } catch (error) {
      console.error('加载对比组失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const createGroup = useCallback(async (name: string, buildingIds: string[], notes?: string) => {
    try {
      const id = await comparisonGroupsDB.add(name, buildingIds, notes);
      await loadGroups();
      return id;
    } catch (error) {
      console.error('创建对比组失败:', error);
      return null;
    }
  }, [loadGroups]);

  const updateGroup = useCallback(async (id: number, updates: Partial<Omit<ComparisonGroup, 'id'>>) => {
    try {
      await comparisonGroupsDB.update(id, updates);
      await loadGroups();
    } catch (error) {
      console.error('更新对比组失败:', error);
    }
  }, [loadGroups]);

  const deleteGroup = useCallback(async (id: number) => {
    try {
      await comparisonGroupsDB.delete(id);
      await loadGroups();
    } catch (error) {
      console.error('删除对比组失败:', error);
    }
  }, [loadGroups]);

  return { groups, loading, createGroup, updateGroup, deleteGroup, refresh: loadGroups };
}

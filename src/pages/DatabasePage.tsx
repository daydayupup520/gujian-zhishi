import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Database,
  History,
  Heart,
  Activity,
  GitCompare,
  Trash2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import {
  recognitionHistoryDB,
  favoriteBuildingsDB,
  diseaseRecordsDB,
  comparisonGroupsDB,
  db
} from '../lib/db';
import type { RecognitionHistory, FavoriteBuilding, DiseaseRecord, ComparisonGroup } from '../lib/db';

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites' | 'diseases' | 'groups'>('history');
  const [history, setHistory] = useState<RecognitionHistory[]>([]);
  const [favorites, setFavorites] = useState<FavoriteBuilding[]>([]);
  const [diseases, setDiseases] = useState<DiseaseRecord[]>([]);
  const [groups, setGroups] = useState<ComparisonGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    history: 0,
    favorites: 0,
    diseases: 0,
    groups: 0
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [h, f, d, g] = await Promise.all([
        recognitionHistoryDB.getAll(),
        favoriteBuildingsDB.getAll(),
        diseaseRecordsDB.getAll(),
        comparisonGroupsDB.getAll()
      ]);
      setHistory(h);
      setFavorites(f);
      setDiseases(d);
      setGroups(g);
      setStats({
        history: h.length,
        favorites: f.length,
        diseases: d.length,
        groups: g.length
      });
    } catch {
      // 静默处理加载错误
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const clearDatabase = async () => {
    if (!confirm('确定要清空所有数据吗？此操作不可恢复！')) return;

    try {
      await Promise.all([
        db.recognitionHistory.clear(),
        db.favoriteBuildings.clear(),
        db.diseaseRecords.clear(),
        db.comparisonGroups.clear()
      ]);
      await loadData();
      alert('数据库已清空');
    } catch {
      alert('清空失败');
    }
  };

  const deleteHistoryItem = async (id: number) => {
    try {
      await recognitionHistoryDB.delete(id);
      await loadData();
    } catch {
      // 静默处理
    }
  };

  const deleteFavorite = async (buildingId: string) => {
    try {
      await favoriteBuildingsDB.remove(buildingId);
      await loadData();
    } catch {
      // 静默处理
    }
  };

  const deleteDiseaseRecord = async (id: number) => {
    try {
      await diseaseRecordsDB.delete(id);
      await loadData();
    } catch {
      // 静默处理
    }
  };

  const deleteComparisonGroup = async (id: number) => {
    try {
      await comparisonGroupsDB.delete(id);
      await loadData();
    } catch {
      // 静默处理
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 page-container">
      <div className="premium-shell rounded-[30px] p-6 md:p-8">
        {/* 导航栏 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 返回首页
            </Link>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg shadow-slate-500/30">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">数据库管理</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              className="premium-btn flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 border border-indigo-500/10 hover:shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" /> 刷新
            </button>
            <button
              type="button"
              onClick={clearDatabase}
              className="premium-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/15 to-rose-500/15 hover:from-red-500/25 hover:to-rose-500/25 text-red-400 rounded-xl border border-red-500/20 hover:shadow-md transition-all"
            >
              <Trash2 className="w-4 h-4" /> 清空
            </button>
          </div>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: History, label: '识别历史', value: stats.history, color: 'blue', tab: 'history' as const },
            { icon: Heart, label: '收藏建筑', value: stats.favorites, color: 'rose', tab: 'favorites' as const },
            { icon: Activity, label: '病害记录', value: stats.diseases, color: 'red', tab: 'diseases' as const },
            { icon: GitCompare, label: '对比组', value: stats.groups, color: 'indigo', tab: 'groups' as const }
          ].map((stat) => (
            <button
              type="button"
              key={stat.label}
              onClick={() => setActiveTab(stat.tab)}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                activeTab === stat.tab
                  ? 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border-blue-500/30 shadow-md shadow-blue-500/10'
                  : 'bg-[rgba(15,20,40,0.5)] border-indigo-500/10 hover:border-blue-500/20 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/15 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* 数据列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-indigo-500/10 rounded-2xl p-6"
        >
          {loading ? (
            <div className="text-center py-12 text-slate-400">加载中...</div>
          ) : (
            <>
              {activeTab === 'history' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-400" /> 识别历史
                  </h3>
                  {history.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>暂无识别历史</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((item) => (
                        <div key={item.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{item.result.name}</span>
                              <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 rounded text-xs">
                                {item.result.category}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-1">{item.result.description}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(item.timestamp).toLocaleString()} · {item.imageCount} 张图片
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => item.id && deleteHistoryItem(item.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-400" /> 收藏建筑
                  </h3>
                  {favorites.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>暂无收藏建筑</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favorites.map((item) => (
                        <div key={item.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{item.name}</span>
                              <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 rounded text-xs">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">{item.location}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              收藏于 {new Date(item.addedAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteFavorite(item.buildingId)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'diseases' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-400" /> 病害记录
                  </h3>
                  {diseases.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>暂无病害记录</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {diseases.map((item) => (
                        <div key={item.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{item.buildingName}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                item.severity === '严重' ? 'bg-red-500/20 text-red-400' :
                                item.severity === '中度' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {item.severity}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                item.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-slate-500/20 text-slate-400'
                              }`}>
                                {item.status === 'completed' ? '已完成' : item.status === 'in_progress' ? '处理中' : '待处理'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">{item.diseaseType} - {item.position}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              记录于 {new Date(item.recordedAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => item.id && deleteDiseaseRecord(item.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'groups' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <GitCompare className="w-5 h-5 text-indigo-400" /> 对比组
                  </h3>
                  {groups.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>暂无对比组</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {groups.map((item) => (
                        <div key={item.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{item.name}</span>
                              <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-400 rounded text-xs">
                                {item.buildingIds.length} 个建筑
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">{item.notes || '无备注'}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              创建于 {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => item.id && deleteComparisonGroup(item.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* 提示信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-blue-500/10 border border-blue-500/15 rounded-xl flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-400">
            <p className="font-medium text-blue-300 mb-1">关于数据存储</p>
            <p>所有数据存储在浏览器本地（IndexedDB），不会上传到服务器。清除浏览器数据会导致数据丢失。</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

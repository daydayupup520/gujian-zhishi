/**
 * 快速切换高性能AI模型
 * 把原来的recognition.ts备份，然后使用recognition-multi.ts
 */

import { recognizeBuilding, recognizeBuildingMulti, fileToBase64, fileToBase64Many } from './recognition-multi';

// 导出兼容接口
export { recognizeBuilding, recognizeBuildingMulti, fileToBase64, fileToBase64Many };

// 默认导出
export default {
  recognizeBuilding,
  recognizeBuildingMulti,
  fileToBase64,
  fileToBase64Many,
};

/**
 * 试剂索引优化
 * 
 * 问题：reagents 是一个大数组（80+ 项），每次搜索都需要遍历
 * 解决：建立多维索引，实现 O(1) 查找
 */

import { reagents } from "./reagents";

// ==================== 索引结构 ====================

/** ID 索引：O(1) 查找 */
const idIndex = new Map();

/** 分类索引：按 category 分组 */
const categoryIndex = new Map();

/** 物相索引：按 phase 分组 */
const phaseIndex = new Map();

/** 搜索索引：名称/公式/ID 的小写映射 */
const searchIndex = new Map();

// ==================== 构建索引 ====================

function buildIndexes() {
  reagents.forEach((reagent) => {
    // ID 索引
    idIndex.set(reagent.id, reagent);

    // 分类索引
    if (!categoryIndex.has(reagent.category)) {
      categoryIndex.set(reagent.category, []);
    }
    categoryIndex.get(reagent.category).push(reagent);

    // 物相索引
    const phase = reagent.phase || "solid";
    if (!phaseIndex.has(phase)) {
      phaseIndex.set(phase, []);
    }
    phaseIndex.get(phase).push(reagent);

    // 搜索索引（预处理小写）
    const searchKey = `${reagent.name}|${reagent.formula}|${reagent.id}`.toLowerCase();
    searchIndex.set(reagent.id, searchKey);
  });
}

// 初始化时构建索引
buildIndexes();

// ==================== 导出查询函数 ====================

/**
 * 通过 ID 获取试剂 - O(1)
 */
export function getReagentById(id) {
  return idIndex.get(id) || null;
}

/**
 * 通过 ID 批量获取试剂 - O(n)
 */
export function getReagentsByIds(ids) {
  return ids.map((id) => idIndex.get(id)).filter(Boolean);
}

/**
 * 获取指定分类的试剂 - O(1)
 */
export function getReagentsByCategory(category) {
  return categoryIndex.get(category) || [];
}

/**
 * 获取指定物相的试剂 - O(1)
 */
export function getReagentsByPhase(phase) {
  return phaseIndex.get(phase) || [];
}

/**
 * 获取所有分类
 */
export function getAllCategories() {
  return Array.from(categoryIndex.keys());
}

/**
 * 获取所有物相
 */
export function getAllPhases() {
  return Array.from(phaseIndex.keys());
}

/**
 * 高性能搜索 - 使用预构建的搜索索引
 * @param {string} query - 搜索词
 * @param {Object} filters - 筛选条件
 * @returns {Array} 匹配的试剂
 */
export function searchReagents(query, filters = {}) {
  const { category, phase } = filters;
  const lowerQuery = query.toLowerCase().trim();

  // 如果有分类筛选，先缩小范围
  let candidates = reagents;
  if (category && category !== "all") {
    candidates = categoryIndex.get(category) || [];
  }
  if (phase && phase !== "all") {
    candidates = candidates.filter((r) => (r.phase || "solid") === phase);
  }

  // 如果没有搜索词，返回筛选结果
  if (!lowerQuery) return candidates;

  // 使用搜索索引进行匹配
  return candidates.filter((reagent) => {
    const searchKey = searchIndex.get(reagent.id);
    return searchKey.includes(lowerQuery);
  });
}

/**
 * 分组试剂
 * @param {Array} reagentList - 试剂列表
 * @param {string} groupBy - 分组字段（默认 category）
 * @returns {Object} 分组结果
 */
export function groupReagents(reagentList, groupBy = "category") {
  const groups = {};
  for (const r of reagentList) {
    const key = r[groupBy] || "unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }
  return groups;
}

/**
 * 检查试剂是否在烧杯中 - O(1)
 * @param {string} reagentId - 试剂 ID
 * @param {Array} beakerContents - 烧杯内容
 * @returns {boolean}
 */
export function isReagentInBeaker(reagentId, beakerContents) {
  // 如果烧杯内容较多，使用 Set 优化
  if (beakerContents.length > 10) {
    const beakerSet = new Set(beakerContents);
    return beakerSet.has(reagentId);
  }
  return beakerContents.includes(reagentId);
}

/**
 * 创建烧杯内容 Set（用于批量检查）
 */
export function createBeakerSet(beakerContents) {
  return new Set(beakerContents);
}

// ==================== 导出索引（高级用法） ====================

export const indexes = {
  idIndex,
  categoryIndex,
  phaseIndex,
  searchIndex,
};

export default {
  getReagentById,
  getReagentsByIds,
  getReagentsByCategory,
  getReagentsByPhase,
  getAllCategories,
  getAllPhases,
  searchReagents,
  groupReagents,
  isReagentInBeaker,
  createBeakerSet,
  indexes,
};

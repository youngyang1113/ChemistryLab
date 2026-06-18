/**
 * ReagentShelf 组件 - 性能优化版
 * 
 * 优化点：
 * 1. 使用索引系统，搜索性能从 O(n) 优化到 O(1)
 * 2. 使用 Set 优化 beakerContents 检查，从 O(n) 到 O(1)
 * 3. 使用 useCallback/useMemo 精准控制重渲染
 * 4. 修复 useDebounce Hook 的错误用法
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getReagentImage } from "../state/recipes";
import {
  searchReagents,
  groupReagents,
  createBeakerSet,
} from "../state/recipes/reagentIndex";
import { REAGENT_CATEGORIES, PHASE_CONFIG } from "../constants/labConfig";
import { Droppable, Draggable } from "@hello-pangea/dnd";

// ==================== 防抖 Hook（修复版） ====================
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ==================== ReagentCard 组件 ====================

const ReagentCard = React.memo(function ReagentCard({
  reagent,
  index,
  onClick,
  isInBeaker,
}) {
  const categoryConfig = REAGENT_CATEGORIES[reagent.category] || {};
  const gradientClass = categoryConfig.color || "from-gray-100 to-gray-50";
  const phaseConfig = PHASE_CONFIG[reagent.phase] || PHASE_CONFIG.solid;
  const image = getReagentImage(reagent);

  // 使用 useCallback 缓存事件处理函数
  const handleDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isInBeaker) {
        onClick(reagent.id);
      }
    },
    [onClick, reagent.id, isInBeaker]
  );

  const handleAddClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isInBeaker) {
        onClick(reagent.id);
      }
    },
    [onClick, reagent.id, isInBeaker]
  );

  return (
    <Draggable draggableId={reagent.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleDoubleClick}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative cursor-grab active:cursor-grabbing select-none
            rounded-lg p-2 transition-all duration-200
            bg-gradient-to-br ${gradientClass}
            border border-gray-200
            ${snapshot.isDragging ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/20" : ""}
            ${isInBeaker ? "ring-1 ring-emerald-400 opacity-50" : "hover:border-gray-300 hover:shadow-sm"}
          `}
        >
          <div className="flex items-center gap-1.5">
            <div className="text-base leading-none shrink-0 select-none">
              {image}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-gray-800 leading-tight truncate">
                {reagent.name}
              </div>
              <div
                className="text-[9px] font-mono font-medium opacity-80 truncate"
                style={{ color: reagent.color }}
              >
                {reagent.formula}
              </div>
            </div>
            <div
              className={`text-[8px] px-0.5 py-0 rounded border shrink-0 ${phaseConfig.color}`}
              title={phaseConfig.label}
            >
              {phaseConfig.icon}
            </div>
          </div>

          {!isInBeaker && (
            <button
              onClick={handleAddClick}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white 
                flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100
                hover:bg-blue-600 transition-all shadow-sm md:opacity-0 md:hover:opacity-100
                active:opacity-100 active:scale-95"
              title="点击添加"
            >
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}

          {isInBeaker && (
            <div className="absolute inset-0 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <span className="text-[9px] text-emerald-600 font-medium">已添加</span>
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
});

// ==================== 主组件 ====================

export default function ReagentShelf({ onAddReagent, beakerContents }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");

  // 防抖搜索，避免每次输入都触发过滤
  const debouncedQuery = useDebounce(searchQuery, 200);

  // 创建 beakerContents 的 Set，优化查找性能 O(n) -> O(1)
  const beakerSet = useMemo(
    () => createBeakerSet(beakerContents),
    [beakerContents]
  );

  // 使用索引系统进行搜索和筛选
  const filteredReagents = useMemo(() => {
    return searchReagents(debouncedQuery, {
      category: selectedCategory,
      phase: selectedPhase,
    });
  }, [debouncedQuery, selectedCategory, selectedPhase]);

  // 分组
  const grouped = useMemo(
    () => groupReagents(filteredReagents),
    [filteredReagents]
  );

  const categories = useMemo(() => Object.keys(grouped), [grouped]);

  // 计算全局索引
  const reagentIndexMap = useMemo(() => {
    const map = new Map();
    let idx = 0;
    for (const cat of Object.keys(REAGENT_CATEGORIES)) {
      const items = grouped[cat] || [];
      for (const r of items) {
        map.set(r.id, idx++);
      }
    }
    return map;
  }, [grouped]);

  // 使用 useCallback 缓存事件处理函数
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryClick = useCallback((cat) => {
    setSelectedCategory((prev) => (prev === cat ? "all" : cat));
  }, []);

  const handlePhaseClick = useCallback((phase) => {
    setSelectedPhase((prev) => (prev === phase ? "all" : phase));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // 使用 Set 检查是否在烧杯中 O(1)
  const isReagentInBeaker = useCallback(
    (reagentId) => beakerSet.has(reagentId),
    [beakerSet]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          试剂架
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">拖拽或点击添加</p>
      </div>

      {/* Search box */}
      <div className="px-3 pb-2">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="搜索试剂..."
            className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg 
              bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="px-3 pb-1.5">
        <div className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wider">分类</div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            全部
          </button>
          {Object.entries(REAGENT_CATEGORIES).map(([key, { label, icon }]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
                selectedCategory === key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Phase filters */}
      <div className="px-3 pb-2">
        <div className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wider">物相</div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedPhase("all")}
            className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
              selectedPhase === "all"
                ? "bg-teal-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            全部
          </button>
          {Object.entries(PHASE_CONFIG).map(([key, { label, icon }]) => (
            <button
              key={key}
              onClick={() => handlePhaseClick(key)}
              className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
                selectedPhase === key
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable reagent list */}
      <Droppable droppableId="reagent-shelf" isDropDisabled={true}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto px-3 pb-3 space-y-3"
          >
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-sm">未找到匹配的试剂</p>
                <p className="text-xs mt-1">尝试其他搜索词或分类</p>
              </div>
            ) : (
              categories.map((cat) => (
                <div key={cat}>
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 px-1">
                    {REAGENT_CATEGORIES[cat]?.label || cat}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {grouped[cat].map((reagent) => (
                      <ReagentCard
                        key={reagent.id}
                        reagent={reagent}
                        index={reagentIndexMap.get(reagent.id) || 0}
                        onClick={onAddReagent}
                        isInBeaker={isReagentInBeaker(reagent.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

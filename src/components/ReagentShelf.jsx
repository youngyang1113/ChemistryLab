import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reagents } from "../state/recipes";
import { REAGENT_CATEGORIES, SEARCH } from "../constants/labConfig";
import { Droppable, Draggable } from "@hello-pangea/dnd";

// 防抖 Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function ReagentCard({ reagent, index, onClick, isInBeaker }) {
  const categoryConfig = REAGENT_CATEGORIES[reagent.category] || {};
  const gradientClass = categoryConfig.color || "from-gray-100 to-gray-50";

  // 双击添加
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInBeaker) {
      onClick(reagent.id);
    }
  }, [onClick, reagent.id, isInBeaker]);

  // 点击"+"按钮添加
  const handleAddClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInBeaker) {
      onClick(reagent.id);
    }
  }, [onClick, reagent.id, isInBeaker]);

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
            rounded-xl p-3 transition-all duration-200
            bg-gradient-to-br ${gradientClass}
            border border-gray-200
            ${snapshot.isDragging ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/20" : ""}
            ${isInBeaker ? "ring-1 ring-emerald-400 opacity-50" : "hover:border-gray-300 hover:shadow-sm"}
          `}
        >
          {/* Glow dot */}
          <div
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: reagent.color, boxShadow: `0 0 6px ${reagent.color}` }}
          />

          {/* Add button for touch devices */}
          {!isInBeaker && (
            <button
              onClick={handleAddClick}
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-blue-500 text-white 
                flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100
                hover:bg-blue-600 transition-all shadow-sm md:opacity-0 md:hover:opacity-100
                active:opacity-100 active:scale-95"
              title="点击添加"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}

          <div className="text-xs font-semibold text-gray-500 tracking-wide mb-1">
            {categoryConfig.icon || "🧪"}
          </div>

          <div className="text-sm font-semibold text-gray-800 leading-tight mb-0.5">
            {reagent.name}
          </div>

          <div
            className="text-xs font-mono font-medium opacity-80"
            style={{ color: reagent.color }}
          >
            {reagent.formula}
          </div>

          {isInBeaker && (
            <div className="absolute inset-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <span className="text-[10px] text-emerald-600 font-medium">已添加</span>
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
}

export default function ReagentShelf({ onAddReagent, beakerContents }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 搜索过滤
  const filteredReagents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return reagents.filter((r) => {
      // 分类筛选
      if (selectedCategory !== "all" && r.category !== selectedCategory) {
        return false;
      }
      // 搜索筛选
      if (query) {
        return (
          r.name.toLowerCase().includes(query) ||
          r.formula.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Group filtered reagents by category
  const grouped = useMemo(() => {
    const groups = {};
    for (const r of filteredReagents) {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    }
    return groups;
  }, [filteredReagents]);

  const categories = Object.keys(grouped);

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

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryClick = useCallback((cat) => {
    setSelectedCategory((prev) => (prev === cat ? "all" : cat));
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          试剂架
        </h2>
        <p className="text-[11px] text-gray-400 mt-1">拖拽或点击添加试剂</p>
      </div>

      {/* Search box */}
      <div className="px-4 pb-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            placeholder="搜索试剂名称或化学式..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg 
              bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
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
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
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

      {/* Scrollable reagent list */}
      <Droppable droppableId="reagent-shelf" isDropDisabled={true}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto px-4 pb-4 space-y-4"
          >
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                        isInBeaker={beakerContents.includes(reagent.id)}
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

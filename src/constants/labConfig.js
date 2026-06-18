// 实验室配置常量
// 集中管理所有魔法数字，便于维护和修改

// ==================== 温度配置 ====================
export const TEMPERATURE = {
  ROOM_TEMP: 25,           // 室温 (°C)
  MIN_TEMP: 5,             // 最低温度
  MAX_TEMP: 100,           // 最高温度
  FREEZING_POINT: 0,       // 冰点
  BOILING_POINT: 100,      // 沸点
};

// ==================== 液位配置 ====================
export const LIQUID_LEVEL = {
  INITIAL: 10,             // 初始液位 (%)
  ADD_REAGENT: 8,          // 添加试剂增加量 (%)
  REACTION_BONUS: 12,      // 反应额外增加量 (%)
  MAX_LEVEL: 85,           // 最大液位 (%)
  MIN_LEVEL: 0,            // 最小液位 (%)
};

// ==================== pH 配置 ====================
export const PH = {
  NEUTRAL: 7,              // 中性 pH
  MIN_PH: 0,               // 最酸
  MAX_PH: 14,              // 最碱
  ACID_THRESHOLD: 4,       // 酸性阈值
  BASE_THRESHOLD: 10,      // 碱性阈值
};

// ==================== 反应动画配置 ====================
export const ANIMATION = {
  REACTION_DURATION: 2500, // 反应动画持续时间 (ms)
  COLOR_TRANSITION: 1500,  // 颜色过渡时间 (ms)
  SHAKE_DURATION: 400,     // 摇晃动画持续时间 (ms)
};

// ==================== 震动强度配置 ====================
export const SHAKE_INTENSITY = {
  NONE: 0,                 // 无震动
  LOW: 1,                  // 轻微震动 (tempDelta >= 15)
  MEDIUM: 2,               // 中等震动 (tempDelta >= 25)
  HIGH: 3,                 // 强烈震动 (tempDelta >= 50)
};

// ==================== 震动阈值配置 ====================
export const SHAKE_THRESHOLDS = {
  HIGH: 50,                // 强烈震动阈值
  MEDIUM: 25,              // 中等震动阈值
  LOW: 15,                 // 轻微震动阈值
};

// ==================== 历史记录配置 ====================
export const HISTORY = {
  MAX_STEPS: 20,           // 最大撤销步数
};

// ==================== 搜索配置 ====================
export const SEARCH = {
  DEBOUNCE_DELAY: 300,     // 搜索防抖延迟 (ms)
  MIN_QUERY_LENGTH: 1,     // 最小搜索长度
};

// ==================== 存储配置 ====================
export const STORAGE = {
  LAB_STATE_KEY: "chemistryLab_state",  // localStorage 键名
  VERSION_KEY: "chemistryLab_version",  // 版本号键名
  CURRENT_VERSION: "1.0.0",             // 当前版本
};

// ==================== 默认颜色 ====================
export const DEFAULT_COLORS = {
  LIQUID: "#1e293b",       // 默认液体颜色
  PRECIPITATE: "#f5f5f4",  // 默认沉淀颜色
};

// ==================== 试剂分类配置 ====================
export const REAGENT_CATEGORIES = {
  acid: { label: "酸", icon: "🧪", color: "from-amber-100 to-orange-50" },
  base: { label: "碱", icon: "💧", color: "from-indigo-100 to-violet-50" },
  salt: { label: "盐", icon: "🧂", color: "from-emerald-100 to-teal-50" },
  metal: { label: "金属", icon: "⚙️", color: "from-slate-100 to-gray-50" },
  nonmetal: { label: "非金属", icon: "🌫️", color: "from-yellow-100 to-amber-50" },
  oxide: { label: "氧化物", icon: "🔥", color: "from-red-100 to-rose-50" },
  gas: { label: "气体", icon: "💨", color: "from-sky-100 to-cyan-50" },
  indicator: { label: "指示剂", icon: "🎨", color: "from-pink-100 to-fuchsia-50" },
};

// ==================== 反应类型配置 ====================
export const REACTION_TYPES = {
  Neutralization: "中和反应",
  "Gas Production": "产气反应",
  Precipitation: "沉淀反应",
  Displacement: "置换反应",
  "Oxide Reaction": "氧化物反应",
  "Single Displacement": "置换反应",
  "Double Decomposition": "复分解反应",
  Redox: "氧化还原反应",
  Decomposition: "分解反应",
  Combination: "化合反应",
  Complexation: "络合反应",
};

// ==================== 特效类型 ====================
export const EFFECTS = {
  NONE: "none",
  HEAT: "heat",
  GAS: "gas",
  PRECIPITATE: "precipitate",
  SMOKE: "smoke",
  COLOR_CHANGE: "colorChange",
};

// ==================== 物相配置 ====================
export const PHASE = {
  SOLID: "solid",
  LIQUID: "liquid",
  GAS: "gas",
};

export const PHASE_CONFIG = {
  solid: { label: "固体", icon: "🪨", color: "bg-stone-100 text-stone-600 border-stone-200" },
  liquid: { label: "液体", icon: "💧", color: "bg-sky-100 text-sky-600 border-sky-200" },
  gas: { label: "气体", icon: "💨", color: "bg-cyan-100 text-cyan-600 border-cyan-200" },
};

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export default function TeacherConsole({ state, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  const getReactionStats = () => {
    const stats = {};
    state.reactionLog.forEach((log) => {
      if (!stats[log.type]) stats[log.type] = 0;
      stats[log.type]++;
    });
    return stats;
  };

  const reactionStats = getReactionStats();

  const tabs = [
    { id: "overview", label: "概览" },
    { id: "reactions", label: "反应记录" },
    { id: "knowledge", label: "知识库" },
    { id: "qrcode", label: "二维码" },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[1000px] h-[80vh] max-h-[700px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">教师控制台</h2>
              <p className="text-xs text-gray-500">AI 虚拟化学实验室管理</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ height: "calc(100% - 140px)" }}>
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <StatCard
                    title="当前试剂"
                    value={state.beakerContents.length}
                    icon="🧪"
                    color="blue"
                  />
                  <StatCard
                    title="反应次数"
                    value={state.reactionLog.length}
                    icon="⚡"
                    color="yellow"
                  />
                  <StatCard
                    title="当前温度"
                    value={`${state.temperature}°C`}
                    icon="🌡️"
                    color="orange"
                  />
                  <StatCard
                    title="pH 值"
                    value={state.ph.toFixed(1)}
                    icon="📊"
                    color="green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">反应类型统计</h3>
                    <div className="space-y-2">
                      {Object.entries(reactionStats).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{type}</span>
                          <span className="text-sm font-medium text-gray-900">{count} 次</span>
                        </div>
                      ))}
                      {Object.keys(reactionStats).length === 0 && (
                        <p className="text-sm text-gray-400 italic">暂无反应记录</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">当前烧杯内容物</h3>
                    <div className="flex flex-wrap gap-2">
                      {state.beakerContents.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">空</p>
                      ) : (
                        state.beakerContents.map((id) => (
                          <span
                            key={id}
                            className="px-3 py-1 bg-white rounded-full text-sm font-mono text-gray-700 border border-gray-200"
                          >
                            {id}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "reactions" && (
              <motion.div
                key="reactions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="space-y-3">
                  {state.reactionLog.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 3h6v4l3 8H6l3-8V3z" />
                        <path d="M6 15h12v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z" />
                      </svg>
                      <p>暂无反应记录</p>
                      <p className="text-sm mt-1">拖拽试剂到烧杯开始实验</p>
                    </div>
                  ) : (
                    state.reactionLog.map((log, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-xl p-4 border-l-4"
                        style={{ borderLeftColor: log.color }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 rounded-full text-gray-700">
                                {log.type}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="font-mono text-sm text-gray-800">{log.equation}</p>
                            <p className="text-sm text-gray-500 mt-1">{log.description}</p>
                          </div>
                          <div className="flex gap-1">
                            {log.reagents.map((r) => (
                              <span
                                key={r}
                                className="text-xs px-2 py-0.5 bg-white rounded border border-gray-200 text-gray-600"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "knowledge" && (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <KnowledgeBase />
              </motion.div>
            )}

            {activeTab === "qrcode" && (
              <motion.div
                key="qrcode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <QRCodeSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QRCodeSection() {
  const [url, setUrl] = useState(window.location.href);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-6">
        <QRCodeSVG value={url} size={200} level="H" includeMargin />
      </div>
      <p className="text-sm text-gray-500 mb-4">扫描二维码打开虚拟化学实验室</p>
      <div className="flex items-center gap-2 w-full max-w-md">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="输入网址"
        />
        <button
          onClick={() => navigator.clipboard?.writeText(url)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
        >
          复制
        </button>
      </div>
    </div>
  );
}

function KnowledgeBase() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", label: "全部" },
    { id: "acid-base", label: "酸碱反应" },
    { id: "precipitation", label: "沉淀反应" },
    { id: "redox", label: "氧化还原" },
    { id: "decomposition", label: "分解反应" },
    { id: "combination", label: "化合反应" },
  ];

  const knowledgeItems = [
    {
      category: "acid-base",
      title: "酸碱中和反应",
      content: "酸和碱反应生成盐和水的反应称为中和反应。强酸强碱完全中和时，溶液呈中性。",
      examples: ["HCl + NaOH → NaCl + H₂O", "H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O"],
      keyPoints: ["放热反应", "pH趋向7", "生成盐和水"],
    },
    {
      category: "acid-base",
      title: "弱酸弱碱的电离",
      content: "弱酸弱碱在水中部分电离，存在电离平衡。电离常数Ka/Kb越小，酸性/碱性越弱。",
      examples: ["CH₃COOH ⇌ CH₃COO⁻ + H⁺", "NH₃·H₂O ⇌ NH₄⁺ + OH⁻"],
      keyPoints: ["部分电离", "存在平衡", "温度影响电离"],
    },
    {
      category: "precipitation",
      title: "沉淀反应",
      content: "两种电解质溶液反应生成难溶性物质的反应。沉淀的生成取决于溶度积常数Ksp。",
      examples: ["AgNO₃ + NaCl → AgCl↓ + NaNO₃", "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl"],
      keyPoints: ["离子浓度积>Ksp", "白色沉淀常见", "可用于离子检验"],
    },
    {
      category: "precipitation",
      title: "常见沉淀的颜色",
      content: "AgCl(白色)、BaSO₄(白色)、CaCO₃(白色)、Cu(OH)₂(蓝色)、Fe(OH)₃(红褐色)、AgI(黄色)",
      examples: ["Cu²⁺ + 2OH⁻ → Cu(OH)₂↓(蓝色)", "Fe³⁺ + 3OH⁻ → Fe(OH)₃↓(红褐色)"],
      keyPoints: ["颜色可用于鉴别离子", "沉淀不溶于酸(除弱酸盐)"],
    },
    {
      category: "redox",
      title: "氧化还原反应",
      content: "有电子转移(化合价变化)的反应。氧化剂得电子被还原，还原剂失电子被氧化。",
      examples: ["Fe + CuSO₄ → FeSO₄ + Cu", "2Na + Cl₂ → 2NaCl"],
      keyPoints: ["化合价变化", "电子转移", "升失氧还"],
    },
    {
      category: "redox",
      title: "原电池原理",
      content: "将化学能转化为电能的装置。活泼金属作负极失电子，不活泼金属作正极得电子。",
      examples: ["Zn-Cu原电池：Zn为负极，Cu为正极", "负极：Zn - 2e⁻ → Zn²⁺"],
      keyPoints: ["负极氧化", "正极还原", "电子从负极流向正极"],
    },
    {
      category: "decomposition",
      title: "分解反应",
      content: "一种化合物分解成两种或多种较简单物质的反应。AB → A + B",
      examples: ["2H₂O₂ → 2H₂O + O₂↑", "CaCO₃ → CaO + CO₂↑"],
      keyPoints: ["一变多", "需要条件(加热/催化剂)", "吸热或放热"],
    },
    {
      category: "combination",
      title: "化合反应",
      content: "两种或多种物质生成一种新物质的反应。A + B → AB",
      examples: ["2H₂ + O₂ → 2H₂O", "CaO + H₂O → Ca(OH)₂"],
      keyPoints: ["多变一", "通常放热", "生成物只有一种"],
    },
    {
      category: "acid-base",
      title: "盐类水解",
      content: "盐的离子与水电离出的H⁺或OH⁻结合生成弱电解质的反应。强酸弱碱盐水解呈酸性，强碱弱酸盐水解呈碱性。",
      examples: ["NH₄Cl + H₂O ⇌ NH₃·H₂O + HCl", "CH₃COONa + H₂O ⇌ CH₃COOH + NaOH"],
      keyPoints: ["谁弱谁水解", "越弱越水解", "盐类水解是吸热反应"],
    },
    {
      category: "redox",
      title: "电解原理",
      content: "将电能转化为化学能的装置。阳极发生氧化反应，阴极发生还原反应。",
      examples: ["电解水：2H₂O → 2H₂↑ + O₂↑", "电解CuCl₂：CuCl₂ → Cu + Cl₂↑"],
      keyPoints: ["阳极氧化", "阴极还原", "与原电池相反"],
    },
    {
      category: "precipitation",
      title: "离子检验",
      content: "利用特征反应检验溶液中的离子。Cl⁻用AgNO₃，SO₄²⁻用BaCl₂，NH₄⁺用NaOH加热。",
      examples: ["Cl⁻ + Ag⁺ → AgCl↓(白色，不溶于HNO₃)", "SO₄²⁻ + Ba²⁺ → BaSO₄↓(白色)"],
      keyPoints: ["特征沉淀", "排除干扰离子", "配合酸碱检验"],
    },
    {
      category: "acid-base",
      title: "酸碱指示剂",
      content: "能随溶液pH变化而改变颜色的物质。石蕊：酸红碱蓝；酚酞：酸无碱红。",
      examples: ["石蕊试液遇酸变红", "酚酞遇碱变红"],
      keyPoints: ["变色范围不同", "可用于判断酸碱性", "不能用于判断pH具体值"],
    },
  ];

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      item.title.includes(searchTerm) ||
      item.content.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="搜索知识点..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredItems.map((item, i) => (
          <details key={i} className="bg-gray-50 rounded-xl overflow-hidden group">
            <summary className="p-4 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {item.category === "acid-base" ? "⚗️" : item.category === "precipitation" ? "💧" : item.category === "redox" ? "⚡" : "🔬"}
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1">{item.content}</p>
                </div>
              </div>
            </summary>
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-700 mb-3">{item.content}</p>
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">示例反应：</p>
                {item.examples.map((ex, j) => (
                  <code key={j} className="block text-sm font-mono bg-white px-3 py-1.5 rounded-lg mb-1 text-gray-800">
                    {ex}
                  </code>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">要点：</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.keyPoints.map((point, j) => (
                    <span key={j} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

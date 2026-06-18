/**
 * AI 实验面板组件
 * 
 * 功能：
 * 1. 实验步骤生成
 * 2. 学生操作评估
 * 3. 实验建议
 * 4. 安全分析
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAIEngine } from "../services/aiEngine";

// 图标组件
const Icons = {
  ai: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  experiment: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 3h6v4l3 8H6l3-8V3z" />
      <path d="M8 15h8v5a1 1 0 01-1 1H9a1 1 0 01-1-1v-5z" />
    </svg>
  ),
  evaluate: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  suggest: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" />
    </svg>
  ),
  safety: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  loading: (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeDasharray="30 60" />
    </svg>
  ),
};

// 风险等级颜色
const riskColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function AIExperimentPanel({ state, onClose }) {
  const [activeTab, setActiveTab] = useState("experiment");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 实验生成状态
  const [experimentGoal, setExperimentGoal] = useState("");
  const [experimentResult, setExperimentResult] = useState(null);

  // 评估状态
  const [evaluationResult, setEvaluationResult] = useState(null);

  // 建议状态
  const [suggestions, setSuggestions] = useState(null);

  // 安全分析状态
  const [safetyResult, setSafetyResult] = useState(null);

  const aiEngine = getAIEngine();

  // 初始化 AI 引擎
  useEffect(() => {
    aiEngine.initialize();
  }, []);

  // 生成实验
  const handleGenerateExperiment = useCallback(async () => {
    if (!experimentGoal.trim()) {
      setError("请输入实验目标");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiEngine.generateExperiment(
        experimentGoal,
        state.beakerContents
      );
      setExperimentResult(result);
    } catch (err) {
      setError("生成实验失败：" + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [experimentGoal, state.beakerContents]);

  // 评估实验
  const handleEvaluate = useCallback(async () => {
    if (!state.reactionLog || state.reactionLog.length === 0) {
      setError("暂无操作记录可评估");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiEngine.evaluateExperiment(
        state.reactionLog,
        experimentGoal
      );
      setEvaluationResult(result);
    } catch (err) {
      setError("评估失败：" + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [state.reactionLog, experimentGoal]);

  // 获取建议
  const handleGetSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiEngine.getSuggestions(state);
      setSuggestions(result);
    } catch (err) {
      setError("获取建议失败：" + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  // 安全分析
  const handleSafetyAnalysis = useCallback(async () => {
    if (!state.currentReaction) {
      setError("请先进行一个反应");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiEngine.analyzeSafety(state.currentReaction);
      setSafetyResult(result);
    } catch (err) {
      setError("安全分析失败：" + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [state.currentReaction]);

  const tabs = [
    { id: "experiment", label: "实验设计", icon: Icons.experiment },
    { id: "evaluate", label: "操作评估", icon: Icons.evaluate },
    { id: "suggest", label: "实验建议", icon: Icons.suggest },
    { id: "safety", label: "安全分析", icon: Icons.safety },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-4 top-20 bottom-4 w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-40 flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              {Icons.ai}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">AI 实验引擎</h3>
              <p className="text-xs text-gray-500">智能实验设计与评估</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Experiment Tab */}
        {activeTab === "experiment" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                实验目标
              </label>
              <textarea
                value={experimentGoal}
                onChange={(e) => setExperimentGoal(e.target.value)}
                placeholder="例如：验证金属活动性顺序"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={handleGenerateExperiment}
              disabled={isLoading || !experimentGoal.trim()}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? Icons.loading : Icons.experiment}
              {isLoading ? "生成中..." : "生成实验方案"}
            </button>

            {experimentResult && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{experimentResult.title}</h4>
                {experimentResult.description && (
                  <p className="text-sm text-gray-600">{experimentResult.description}</p>
                )}

                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-gray-500 uppercase">实验步骤</h5>
                  {experimentResult.steps?.map((step, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {step.order || i + 1}
                        </span>
                        <div>
                          <p className="text-sm text-gray-800">{step.action}</p>
                          {step.reagent && (
                            <p className="text-xs text-gray-500 mt-0.5">试剂：{step.reagent}</p>
                          )}
                          {step.expectedResult && (
                            <p className="text-xs text-gray-500">预期：{step.expectedResult}</p>
                          )}
                          {step.riskLevel && (
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${riskColors[step.riskLevel]}`}>
                              {step.riskLevel === "low" ? "低风险" : step.riskLevel === "medium" ? "中风险" : "高风险"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {experimentResult.safetyNotes?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">安全注意事项</h5>
                    <ul className="space-y-1">
                      {experimentResult.safetyNotes.map((note, i) => (
                        <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Evaluate Tab */}
        {activeTab === "evaluate" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              AI 将根据你的操作历史评估实验表现。
            </p>

            <button
              onClick={handleEvaluate}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? Icons.loading : Icons.evaluate}
              {isLoading ? "评估中..." : "评估我的操作"}
            </button>

            {evaluationResult && (
              <div className="space-y-4">
                {/* Score */}
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <div className="text-4xl font-bold text-indigo-600">
                    {evaluationResult.score}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">总分</div>
                  {evaluationResult.safetyCompliance !== undefined && (
                    <div className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs ${
                      evaluationResult.safetyCompliance
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {evaluationResult.safetyCompliance ? "✓ 符合安全规范" : "✗ 存在安全隐患"}
                    </div>
                  )}
                </div>

                {/* Feedback */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-xs font-medium text-gray-500 mb-1">总体评价</h5>
                  <p className="text-sm text-gray-700">{evaluationResult.feedback}</p>
                </div>

                {/* Strengths */}
                {evaluationResult.strengths?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-green-600 mb-2">优点</h5>
                    <ul className="space-y-1">
                      {evaluationResult.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {evaluationResult.improvements?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-orange-600 mb-2">改进建议</h5>
                    <ul className="space-y-1">
                      {evaluationResult.improvements.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-500">→</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Suggest Tab */}
        {activeTab === "suggest" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              AI 将根据当前实验状态提供建议。
            </p>

            <button
              onClick={handleGetSuggestions}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? Icons.loading : Icons.suggest}
              {isLoading ? "分析中..." : "获取实验建议"}
            </button>

            {suggestions && (
              <div className="space-y-4">
                {suggestions.currentAnalysis && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="text-xs font-medium text-blue-700 mb-1">状态分析</h5>
                    <p className="text-sm text-blue-800">{suggestions.currentAnalysis}</p>
                  </div>
                )}

                {suggestions.suggestions?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-2">建议操作</h5>
                    <div className="space-y-2">
                      {suggestions.suggestions.map((s, i) => (
                        <div
                          key={i}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {s.reagent || s.action}
                              </p>
                              {s.reason && (
                                <p className="text-xs text-gray-500 mt-0.5">{s.reason}</p>
                              )}
                              {s.expectedReaction && (
                                <p className="text-xs text-indigo-600 mt-0.5">
                                  预期：{s.expectedReaction}
                                </p>
                              )}
                              {s.riskLevel && (
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${riskColors[s.riskLevel]}`}>
                                  {s.riskLevel === "low" ? "低风险" : s.riskLevel === "medium" ? "中风险" : "高风险"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Safety Tab */}
        {activeTab === "safety" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {state.currentReaction
                ? "AI 将分析当前反应的安全性。"
                : "请先进行一个反应，然后进行安全分析。"}
            </p>

            <button
              onClick={handleSafetyAnalysis}
              disabled={isLoading || !state.currentReaction}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? Icons.loading : Icons.safety}
              {isLoading ? "分析中..." : "分析安全性"}
            </button>

            {safetyResult && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl text-center ${
                  safetyResult.overallRisk === "low"
                    ? "bg-green-50"
                    : safetyResult.overallRisk === "medium"
                    ? "bg-yellow-50"
                    : "bg-red-50"
                }`}>
                  <div className="text-lg font-bold">
                    {safetyResult.overallRisk === "low"
                      ? "🟢 低风险"
                      : safetyResult.overallRisk === "medium"
                      ? "🟡 中等风险"
                      : "🔴 高风险"}
                  </div>
                </div>

                {safetyResult.hazards?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-red-600 mb-2">潜在危害</h5>
                    <ul className="space-y-2">
                      {safetyResult.hazards.map((h, i) => (
                        <li key={i} className="p-2 bg-red-50 rounded-lg text-sm">
                          <span className="font-medium">{h.type}：</span>
                          {h.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {safetyResult.precautions?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-orange-600 mb-2">预防措施</h5>
                    <ul className="space-y-1">
                      {safetyResult.precautions.map((p, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-500">⚠️</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {safetyResult.requiredEquipment?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-blue-600 mb-2">需要的防护设备</h5>
                    <div className="flex flex-wrap gap-2">
                      {safetyResult.requiredEquipment.map((e, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Powered by AI Engine</span>
          <span>{aiEngine.isReady() ? "🟢 已就绪" : "🔴 未就绪"}</span>
        </div>
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = import.meta.env.VITE_MIMO_API_KEY || "";
const API_URL = "https://api.mimo.ai/v1/chat/completions";

export default function AIExplanation({ reaction, onClose }) {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamedText, setStreamedText] = useState("");

  useEffect(() => {
    if (reaction && API_KEY) {
      generateExplanation();
    } else if (!API_KEY) {
      setError("API Key 未配置。请在 .env 文件中设置 VITE_MIMO_API_KEY");
    }
  }, [reaction]);

  const generateExplanation = async () => {
    setIsLoading(true);
    setError(null);
    setExplanation("");
    setStreamedText("");

    const prompt = `你是一位专业的高中化学教师。请用中文详细讲解以下化学反应：

反应类型：${reaction.type}
化学方程式：${reaction.equation}
描述：${reaction.description}

请从以下几个方面讲解：
1. 反应原理（为什么这个反应能发生）
2. 实验现象（观察到什么）
3. 注意事项（实验安全和操作要点）
4. 实际应用（这个反应在生活或工业中的应用）
5. 相关知识点（高考可能考到的考点）

请用通俗易懂的语言，适合高中生理解。`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "mimo-7b",
          messages: [
            {
              role: "system",
              content: "你是一位专业的高中化学教师，擅长用简单易懂的语言讲解化学知识。",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";
              fullText += content;
              setStreamedText(fullText);
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      setExplanation(fullText);
    } catch (err) {
      console.error("AI 讲解错误:", err);
      // 如果 API 失败，使用本地讲解
      const localExplanation = generateLocalExplanation(reaction);
      setExplanation(localExplanation);
      setStreamedText(localExplanation);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalExplanation = (reaction) => {
    const parts = [];

    parts.push(`## ${reaction.type}讲解`);
    parts.push("");
    parts.push(`**化学方程式：** ${reaction.equation}`);
    parts.push("");
    parts.push("### 反应原理");
    parts.push(reaction.description);
    parts.push("");

    if (reaction.type.includes("中和")) {
      parts.push("### 知识点");
      parts.push("- 中和反应是酸和碱反应生成盐和水");
      parts.push("- 强酸强碱中和，溶液呈中性 (pH=7)");
      parts.push("- 中和反应都是放热反应");
      parts.push("- 酸碱指示剂可用于判断反应终点");
    } else if (reaction.type.includes("置换")) {
      parts.push("### 知识点");
      parts.push("- 置换反应是单质与化合物反应生成新的单质和化合物");
      parts.push("- 活泼金属可以置换不活泼金属");
      parts.push("- 金属活动性顺序：K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au");
    } else if (reaction.type.includes("沉淀")) {
      parts.push("### 知识点");
      parts.push("- 沉淀反应是复分解反应的一种");
      parts.push("- 生成难溶性物质（沉淀）");
      parts.push("- 可用于离子检验和分离");
    }

    parts.push("");
    parts.push("### 实验注意");
    parts.push("- 佩戴护目镜和手套");
    parts.push("- 在通风橱中进行（如有气体产生）");
    parts.push("- 注意用量控制");

    return parts.join("\n");
  };

  if (!reaction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-4 top-20 bottom-4 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-40 flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">AI 讲解</h3>
              <p className="text-xs text-gray-500">{reaction.type}</p>
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

      {/* Reaction Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="font-mono text-sm text-gray-800">{reaction.equation}</p>
          <p className="text-xs text-gray-500 mt-1">{reaction.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && streamedText === "" && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-sm text-gray-500">AI 正在生成讲解...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 rounded-xl text-sm text-red-600 mb-3">
            {error}
          </div>
        )}

        {streamedText && (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown content={streamedText} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {isLoading ? "生成中..." : explanation ? "讲解完成" : "点击开始讲解"}
          </span>
          <button
            onClick={generateExplanation}
            disabled={isLoading}
            className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "生成中..." : "重新生成"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ReactMarkdown({ content }) {
  const renderContent = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeContent = "";
    let listItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-5 space-y-1 my-2">
            {listItems.map((item, i) => (
              <li key={i} className="text-sm text-gray-700">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, i) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="bg-gray-100 rounded-lg p-3 my-2 overflow-x-auto">
              <code className="text-sm font-mono text-gray-800">{codeContent}</code>
            </pre>
          );
          codeContent = "";
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }

      if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={i} className="font-semibold text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={i} className="font-bold text-gray-900 text-lg mt-4 mb-2">{line.slice(3)}</h2>
        );
      } else if (line.startsWith("- ")) {
        listItems.push(line.slice(2));
      } else if (line.startsWith("**") && line.endsWith("**")) {
        flushList();
        elements.push(
          <p key={i} className="font-semibold text-gray-800 my-1">{line.slice(2, -2)}</p>
        );
      } else if (line.trim() === "") {
        flushList();
        elements.push(<div key={i} className="h-2" />);
      } else {
        flushList();
        elements.push(
          <p key={i} className="text-sm text-gray-700 my-1">{line}</p>
        );
      }
    });

    flushList();
    return elements;
  };

  return <div>{renderContent(content)}</div>;
}

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = import.meta.env.VITE_MIMO_API_KEY || "";
const API_URL = "https://api.mimo.ai/v1/chat/completions";

export default function AIExplanation({ reaction, onClose }) {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamedText, setStreamedText] = useState("");
  const abortControllerRef = useRef(null);

  const generateExplanation = useCallback(async () => {
    if (!reaction) return;

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

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
        signal: abortControllerRef.current.signal,
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
      if (err.name === "AbortError") return;
      console.error("AI 讲解错误:", err);
      const localExplanation = generateLocalExplanation(reaction);
      setExplanation(localExplanation);
      setStreamedText(localExplanation);
    } finally {
      setIsLoading(false);
    }
  }, [reaction]);

  useEffect(() => {
    if (reaction && API_KEY) {
      generateExplanation();
    } else if (!API_KEY) {
      setError("API Key 未配置。请在 .env 文件中设置 VITE_MIMO_API_KEY");
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [reaction, generateExplanation]);

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
  const renderInlineContent = (text) => {
    // 支持行内 HTML 标签和样式
    const parts = [];
    let remaining = text;
    let key = 0;

    // 匹配 HTML 标签（如 <span style="...">, <b>, <i>, <sub>, <sup> 等）
    const htmlRegex = /<(span|b|i|strong|em|sub|sup|code|mark)(?:\s+[^>]*)?>(.*?)<\/\1>/gs;
    let match;
    let lastIndex = 0;

    while ((match = htmlRegex.exec(text)) !== null) {
      // 添加标签前的普通文本
      if (match.index > lastIndex) {
        parts.push(
          <span key={key++}>{text.slice(lastIndex, match.index)}</span>
        );
      }

      const tag = match[1];
      const innerContent = match[2];
      const fullTag = match[0];

      // 提取 style 属性
      const styleMatch = fullTag.match(/style="([^"]*)"/);
      const style = {};
      if (styleMatch) {
        styleMatch[1].split(";").forEach((s) => {
          const [prop, val] = s.split(":").map((p) => p.trim());
          if (prop && val) {
            // 转换 CSS 属性名为 camelCase
            const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            style[camelProp] = val;
          }
        });
      }

      const Tag = tag === "span" ? "span" : tag;
      parts.push(
        <Tag key={key++} style={style} className={tag === "mark" ? "bg-yellow-200 px-0.5 rounded" : ""}>
          {renderInlineContent(innerContent)}
        </Tag>
      );

      lastIndex = match.index + fullTag.length;
    }

    // 添加剩余文本
    if (lastIndex < text.length) {
      parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }

    // 如果没有 HTML 标签，处理 Markdown 行内语法
    if (parts.length === 0) {
      return processInlineMarkdown(text);
    }

    return parts;
  };

  const processInlineMarkdown = (text) => {
    // 处理 **粗体**, *斜体*, `代码`, ~删除线~ 等
    const parts = [];
    let remaining = text;
    let key = 0;

    const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~)/g;
    let match;
    let lastIndex = 0;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
      }

      if (match[2]) {
        // **粗体**
        parts.push(<strong key={key++} className="font-semibold">{match[2]}</strong>);
      } else if (match[3]) {
        // *斜体*
        parts.push(<em key={key++} className="italic">{match[3]}</em>);
      } else if (match[4]) {
        // `代码`
        parts.push(
          <code key={key++} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-pink-600">
            {match[4]}
          </code>
        );
      } else if (match[5]) {
        // ~~删除线~~
        parts.push(<del key={key++} className="line-through text-gray-400">{match[5]}</del>);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  const renderContent = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeContent = "";
    let listItems = [];
    let orderedListItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 my-2">
            {listItems.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed">
                {renderInlineContent(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      if (orderedListItems.length > 0) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal pl-5 space-y-1 my-2">
            {orderedListItems.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed">
                {renderInlineContent(item)}
              </li>
            ))}
          </ol>
        );
        orderedListItems = [];
      }
    };

    lines.forEach((line, i) => {
      // 代码块处理
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="bg-gray-900 text-gray-100 rounded-lg p-4 my-3 overflow-x-auto text-sm">
              <code className="font-mono">{codeContent}</code>
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

      // 标题处理
      if (line.startsWith("#### ")) {
        flushList();
        elements.push(
          <h4 key={i} className="font-semibold text-gray-800 mt-3 mb-1 text-sm">{renderInlineContent(line.slice(5))}</h4>
        );
      } else if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={i} className="font-semibold text-gray-900 mt-4 mb-2">{renderInlineContent(line.slice(4))}</h3>
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={i} className="font-bold text-gray-900 text-lg mt-4 mb-2">{renderInlineContent(line.slice(3))}</h2>
        );
      } else if (line.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={i} className="font-bold text-gray-900 text-xl mt-4 mb-2">{renderInlineContent(line.slice(2))}</h1>
        );
      }
      // 无序列表
      else if (line.match(/^[\-\*]\s/)) {
        orderedListItems.length > 0 && flushList();
        listItems.push(line.slice(2));
      }
      // 有序列表
      else if (line.match(/^\d+\.\s/)) {
        listItems.length > 0 && flushList();
        orderedListItems.push(line.replace(/^\d+\.\s/, ""));
      }
      // 引用块
      else if (line.startsWith("> ")) {
        flushList();
        elements.push(
          <blockquote key={i} className="border-l-4 border-purple-300 pl-4 py-1 my-2 bg-purple-50 rounded-r-lg">
            <p className="text-sm text-gray-700 italic">{renderInlineContent(line.slice(2))}</p>
          </blockquote>
        );
      }
      // 水平线
      else if (line.match(/^[-*_]{3,}$/)) {
        flushList();
        elements.push(<hr key={i} className="my-4 border-gray-200" />);
      }
      // 空行
      else if (line.trim() === "") {
        flushList();
        elements.push(<div key={i} className="h-2" />);
      }
      // 普通段落
      else {
        flushList();
        elements.push(
          <p key={i} className="text-sm text-gray-700 my-1.5 leading-relaxed">
            {renderInlineContent(line)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return <div className="space-y-1">{renderContent(content)}</div>;
}

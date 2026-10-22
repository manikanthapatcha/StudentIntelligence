import React, { useState } from "react";
import { User, Bot, Copy, Check, Terminal, Sparkles, ChevronRight, ChevronDown } from "lucide-react";

/**
 * Lightweight, zero-dependency Markdown renderer for LocalAI Study Assistant.
 * Handles headings, bold, italics, inline code, fenced code blocks with copy buttons,
 * lists, blockquotes, and tables without heavy AST bundle overhead.
 */
function SimpleMarkdown({ content }) {
  if (!content) return null;

  // Split lines while preserving code fences
  const lines = content.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = "";
  let inTable = false;
  let tableRows = [];
  let listItems = [];
  let listType = null; // 'ul' or 'ol'

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === "ul") {
        elements.push(
          <ul key={`ul-${elements.length}`} className="md-list">
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="md-list">
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ol>
        );
      }
      listItems = [];
      listType = null;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1).filter((row) => !row.every((cell) => /^[-:| ]+$/.test(cell)));

      elements.push(
        <div key={`table-${elements.length}`} className="table-responsive">
          <table className="md-table">
            <thead>
              <tr>
                {headerRow.map((cell, cIdx) => (
                  <th key={cIdx}>{renderInline(cell.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{renderInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Block start/end
    if (line.trim().startsWith("```")) {
      flushList();
      flushTable();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBuffer.join("\n")}
            language={codeLang || "code"}
          />
        );
        codeBuffer = [];
        codeLang = "";
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Markdown Table lines (e.g. | col 1 | col 2 |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushList();
      inTable = true;
      const cells = line
        .trim()
        .slice(1, -1)
        .split("|");
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Unordered lists (- or *)
    const ulMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    if (ulMatch) {
      if (listType === "ol") flushList();
      listType = "ul";
      listItems.push(ulMatch[2]);
      continue;
    }

    // Ordered lists (1. or 2.)
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (olMatch) {
      if (listType === "ul") flushList();
      listType = "ol";
      listItems.push(olMatch[2]);
      continue;
    }

    // If we reach a non-list line, flush active list
    flushList();

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Headings
    if (line.startsWith("#### ")) {
      elements.push(<h4 key={`h4-${i}`}>{renderInline(line.slice(5))}</h4>);
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(<h3 key={`h3-${i}`}>{renderInline(line.slice(4))}</h3>);
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={`h2-${i}`}>{renderInline(line.slice(3))}</h2>);
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(<h1 key={`h1-${i}`}>{renderInline(line.slice(2))}</h1>);
      continue;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={`bq-${i}`}>{renderInline(line.slice(2))}</blockquote>
      );
      continue;
    }

    // Details summary (spoiler/MCQ explanation)
    if (line.includes("<details>") || line.includes("</details>") || line.includes("<summary>")) {
      const cleanDetails = line.replace(/<\/?(details|summary|b)>/g, "").trim();
      if (cleanDetails) {
        elements.push(
          <p key={`p-${i}`} className="detail-spoiler">
            {renderInline(cleanDetails)}
          </p>
        );
      }
      continue;
    }

    // Standard Paragraph
    elements.push(<p key={`p-${i}`}>{renderInline(line)}</p>);
  }

  flushList();
  flushTable();

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <CodeBlock
        key={`code-end`}
        code={codeBuffer.join("\n")}
        language={codeLang || "code"}
      />
    );
  }

  return <div className="markdown-body">{elements}</div>;
}

/**
 * Parses bold (**text**), inline code (`code`), and italics (*text*)
 */
function renderInline(text) {
  if (!text) return "";

  // Split by inline code `...`
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={index} className="inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Parse bold **...**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith("**") && bPart.endsWith("**") && bPart.length >= 4) {
        return <strong key={`${index}-${bIdx}`}>{bPart.slice(2, -2)}</strong>;
      }
      // Parse italic *...*
      const itParts = bPart.split(/(\*[^*]+\*)/g);
      return itParts.map((iPart, iIdx) => {
        if (iPart.startsWith("*") && iPart.endsWith("*") && iPart.length >= 2) {
          return <em key={`${index}-${bIdx}-${iIdx}`}>{iPart.slice(1, -1)}</em>;
        }
        return iPart;
      });
    });
  });
}

function CodeBlock({ code, language }) {
  const [copiedCode, setCopiedCode] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.warn("Failed to copy code snippet", e);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-language">
          <Terminal size={12} />
          {language || "code"}
        </span>
        <button type="button" className="code-copy-btn" onClick={copyCode} title="Copy code">
          {copiedCode ? <Check size={12} className="text-cyan" /> : <Copy size={12} />}
          <span>{copiedCode ? "Copied" : "Copy Code"}</span>
        </button>
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ChatMessage({ message, onRetry }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy text:", err);
    }
  };

  return (
    <div className={`message-row ${isUser ? "user-row" : "ai-row"}`}>
      <div className="message-avatar">
        {isUser ? (
          <div className="avatar-icon user-avatar">
            <User size={16} />
          </div>
        ) : (
          <div className="avatar-icon ai-avatar">
            <Bot size={16} />
          </div>
        )}
      </div>

      <div className="message-content-wrapper">
        <div className="message-meta">
          <span className="author-name">{isUser ? "You" : "Local Llama 3.2"}</span>
          {message.studyMode && (
            <span className="mode-badge">
              <Sparkles size={11} />
              {message.studyMode}
              {message.examMarks ? ` (${message.examMarks}M)` : ""}
            </span>
          )}
          <span className="timestamp">
            {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>

        <div className={`message-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
          {isUser ? (
            <p className="user-text">{message.content}</p>
          ) : (
            <SimpleMarkdown content={message.content} />
          )}
        </div>

        {!isUser && (
          <div className="message-actions">
            <button
              type="button"
              className="action-btn"
              onClick={handleCopy}
              title="Copy answer to clipboard"
            >
              {copied ? <Check size={13} className="text-cyan" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;

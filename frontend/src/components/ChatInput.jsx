import React, { useState, useRef, useEffect } from "react";
import { Send, CornerDownLeft, Sparkles, Loader2 } from "lucide-react";

const QUICK_PROMPTS = [
  "Explain Normalization in DBMS with 1NF, 2NF, 3NF",
  "Give me a 10-mark answer for Deadlock handling in OS",
  "Explain the TCP 3-way handshake with a diagram",
  "Technical breakdown of Virtual Memory and Paging",
  "Mock interview: How does the JavaScript Event Loop work?",
  "Generate 3 MCQs on Binary Search Trees"
];

export function ChatInput({ onSendMessage, loading, selectedMode }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPrompt = (promptText) => {
    onSendMessage(promptText);
  };

  return (
    <div className="chat-input-container">
      {/* Quick Prompts Bar */}
      <div className="quick-prompts-bar">
        <span className="quick-prompt-label">
          <Sparkles size={12} />
          Suggested queries:
        </span>
        <div className="quick-prompt-scroll">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="quick-prompt-chip"
              onClick={() => handleQuickPrompt(prompt)}
              disabled={loading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Input Form */}
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask anything in ${selectedMode} mode... (Press Enter to send, Shift+Enter for newline)`}
          rows={1}
          className="chat-textarea"
          disabled={loading}
        />

        <div className="input-actions">
          <span className="shortcut-hint">
            <CornerDownLeft size={11} /> Enter to send
          </span>
          <button
            type="submit"
            className={`send-button ${loading ? "loading" : ""}`}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinner-icon" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;

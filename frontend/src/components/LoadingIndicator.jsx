import React from "react";
import { Bot, Loader2 } from "lucide-react";

export function LoadingIndicator({ studyMode }) {
  return (
    <div className="message-row ai-row loading-row">
      <div className="message-avatar">
        <div className="avatar-icon ai-avatar pulse">
          <Bot size={16} />
        </div>
      </div>
      <div className="message-content-wrapper">
        <div className="message-meta">
          <span className="author-name">Local Llama 3.2</span>
          <span className="mode-badge">{studyMode}</span>
        </div>
        <div className="loading-bubble">
          <Loader2 size={16} className="spinner-icon text-cyan" />
          <span className="loading-text">
            Executing local inference on your GPU/CPU...
          </span>
          <div className="typing-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingIndicator;

import React from "react";
import { Cpu, HardDrive, Activity, Trash2, LayoutDashboard, MessageSquareCode, ShieldCheck } from "lucide-react";

export function Header({
  activeTab,
  setActiveTab,
  status,
  onClearSession,
  onOpenModelInfo
}) {
  const isConnected = status?.ollama === true;

  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo-badge">
          <Cpu className="logo-icon" />
          <div className="logo-text">
            <h1 className="logo-title">
              LocalAI <span className="logo-subtitle">Study Intelligence</span>
            </h1>
            <span className="logo-tag">Developer AI Laboratory</span>
          </div>
        </div>

        <div className="status-pill">
          <span className={`status-dot ${isConnected ? "online" : "offline"}`} />
          <span className="status-label">
            {isConnected ? "Ollama Connected" : "Ollama Disconnected"}
          </span>
          <span className="model-chip">{status?.model || "llama3.2"}</span>
        </div>
      </div>

      <div className="header-center">
        <nav className="nav-tabs">
          <button
            type="button"
            className={`nav-tab ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            <MessageSquareCode size={16} />
            <span>Study Studio</span>
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={16} />
            <span>Telemetry</span>
          </button>
          <button
            type="button"
            className="nav-tab info-tab"
            onClick={onOpenModelInfo}
            title="Inspect Model Architecture & Local Specs"
          >
            <HardDrive size={16} />
            <span>Specs</span>
          </button>
        </nav>
      </div>

      <div className="header-right">
        <div className="privacy-badge">
          <ShieldCheck size={14} className="privacy-icon" />
          <span>100% Local Inference</span>
        </div>
        <button
          type="button"
          onClick={onClearSession}
          className="btn-clear-session"
          title="Clear current study session and localStorage"
        >
          <Trash2 size={15} />
          <span>Clear Session</span>
        </button>
      </div>
    </header>
  );
}

export default Header;

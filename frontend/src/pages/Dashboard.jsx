import React from "react";
import {
  Cpu,
  Server,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { MODES } from "../components/ModeSelector";

export function Dashboard({
  status,
  messagesCount,
  currentMode,
  onSwitchMode,
  onNavigateChat
}) {
  const isConnected = status?.ollama === true;
  const userMessages = Math.floor(messagesCount / 2);

  return (
    <div className="dashboard-container">
      {/* Hero Banner */}
      <div className="telemetry-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <ShieldCheck size={16} className="text-emerald" />
            <span>Hardware Isolated • Zero Cloud Exposure</span>
          </div>
          <h2 className="hero-title">LocalAI Study Intelligence Dashboard</h2>
          <p className="hero-subtitle">
            This AI runs entirely on your local machine. No queries are transmitted to
            OpenAI, Google, or any external servers. You have complete data sovereignty.
          </p>
        </div>
        <div className="hero-status-pill">
          <span className={`status-dot ${isConnected ? "online" : "offline"}`} />
          <div className="hero-status-text">
            <strong>{isConnected ? "Engine Active" : "Engine Offline"}</strong>
            <span>{status?.model || "llama3.2"}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Model</span>
            <Cpu size={18} className="text-cyan" />
          </div>
          <div className="metric-value">{status?.model || "llama3.2"}</div>
          <span className="metric-sub">Meta Llama 3.2 (3.2B quantized)</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Runtime Host</span>
            <Server size={18} className="text-purple" />
          </div>
          <div className="metric-value">Ollama Engine</div>
          <span className="metric-sub">http://127.0.0.1:11434</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Engine Status</span>
            <Activity size={18} className={isConnected ? "text-emerald" : "text-amber"} />
          </div>
          <div className="metric-value">
            {isConnected ? "Connected" : "Disconnected"}
          </div>
          <span className="metric-sub">Real-time REST ping verified</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Prompts</span>
            <MessageSquare size={18} className="text-cyan" />
          </div>
          <div className="metric-value">{messagesCount}</div>
          <span className="metric-sub">{userMessages} user queries in session</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Current Mode</span>
            <Sparkles size={18} className="text-purple" />
          </div>
          <div className="metric-value text-sm">{currentMode}</div>
          <span className="metric-sub">Prompt engineering active</span>
        </div>
      </div>

      {/* Local AI Architecture Advantages */}
      <div className="dashboard-section">
        <h3 className="section-title">
          <Zap size={18} className="text-cyan" />
          Why Run Locally with Ollama?
        </h3>
        <div className="features-grid">
          <div className="feature-item">
            <h4>🔒 Complete Academic Privacy</h4>
            <p>
              Your thesis notes, exam prep, course assignments, and research stay strictly on your local disk.
            </p>
          </div>
          <div className="feature-item">
            <h4>⚡ Zero API Fees & Rate Limits</h4>
            <p>
              Generate unlimited 10-mark exam answers and practice quizzes without worrying about token budgets or monthly subscriptions.
            </p>
          </div>
          <div className="feature-item">
            <h4>📴 Offline Accessibility</h4>
            <p>
              Study anywhere—on campus, flights, or off-grid without needing an internet connection once model weights are stored.
            </p>
          </div>
        </div>
      </div>

      {/* Available Study Modes Quick Launch */}
      <div className="dashboard-section">
        <div className="section-header-flex">
          <h3 className="section-title">
            <Layers size={18} className="text-purple" />
            Specialized Study Modes
          </h3>
          <button type="button" className="action-link" onClick={onNavigateChat}>
            <span>Open Study Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="modes-cards-grid">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isCurrent = currentMode === mode.id;

            return (
              <div
                key={mode.id}
                className={`mode-card ${isCurrent ? "active-card" : ""}`}
                onClick={() => {
                  onSwitchMode(mode.id);
                  onNavigateChat();
                }}
              >
                <div className="mode-card-top">
                  <div className="mode-icon-box">
                    <Icon size={18} />
                  </div>
                  {isCurrent && <span className="current-badge">Active</span>}
                </div>
                <h4 className="mode-card-title">{mode.label}</h4>
                <p className="mode-card-desc">{mode.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

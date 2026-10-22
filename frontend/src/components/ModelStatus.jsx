import React from "react";
import { Server, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

export function ModelStatus({ status, onRefresh, checking }) {
  const isConnected = status?.ollama === true;

  return (
    <div className={`model-status-card ${isConnected ? "status-ok" : "status-err"}`}>
      <div className="status-header">
        <div className="status-indicator">
          {isConnected ? (
            <CheckCircle2 size={16} className="text-emerald" />
          ) : (
            <AlertTriangle size={16} className="text-amber" />
          )}
          <span className="status-title">
            {isConnected ? "Ollama Connected" : "Local AI Unavailable"}
          </span>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="refresh-btn"
          disabled={checking}
          title="Refresh Ollama health status"
        >
          <RefreshCw size={13} className={checking ? "spin" : ""} />
        </button>
      </div>

      <div className="status-details">
        <div className="detail-item">
          <span className="detail-label">Model:</span>
          <span className="detail-val">{status?.model || "llama3.2:latest"}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Endpoint:</span>
          <span className="detail-val">http://127.0.0.1:11434</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Runtime:</span>
          <span className="detail-val highlight">100% On-Device</span>
        </div>
      </div>

      {!isConnected && (
        <div className="status-alert">
          <p>
            Local AI is unavailable. Please make sure Ollama is running in your terminal:
          </p>
          <code>ollama serve</code>
        </div>
      )}
    </div>
  );
}

export default ModelStatus;

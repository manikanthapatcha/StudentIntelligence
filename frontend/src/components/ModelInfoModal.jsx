import React from "react";
import { X, Cpu, Server, Shield, Database, Radio, CheckCircle2 } from "lucide-react";

export function ModelInfoModal({ isOpen, onClose, status }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Cpu className="text-cyan" size={20} />
            <h3>Local AI Model Architecture & Specs</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="spec-grid">
            <div className="spec-card">
              <span className="spec-label">Model Name</span>
              <span className="spec-value">{status?.model || "llama3.2:latest"}</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Inference Engine</span>
              <span className="spec-value">Ollama (REST API)</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Runtime Environment</span>
              <span className="spec-value text-emerald">100% Local Machine</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Server Endpoint</span>
              <span className="spec-value">http://127.0.0.1:11434</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Cloud Dependency</span>
              <span className="spec-value text-emerald">Zero (Zero telemetry / offline)</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Parameters & Format</span>
              <span className="spec-value">3.2 Billion (GGUF Q4_K_M)</span>
            </div>
          </div>

          <div className="info-callout">
            <Shield size={18} className="text-cyan" />
            <div>
              <strong>Why Local AI Matters for Students:</strong>
              <p>
                Unlike cloud providers (OpenAI, Gemini, Claude), your prompts, student assignments,
                and exam preparation questions never leave your device. All matrix multiplications
                are computed directly by your local CPU/GPU via Ollama.
              </p>
            </div>
          </div>

          {status?.models && status.models.length > 0 && (
            <div className="installed-models-section">
              <span className="section-subtitle">Installed Local Ollama Models:</span>
              <div className="installed-pills">
                {status.models.map((m, idx) => (
                  <span key={idx} className="model-pill">
                    <CheckCircle2 size={12} className="text-emerald" /> {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModelInfoModal;

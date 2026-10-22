import React from "react";
import { AlertCircle, X, RotateCcw } from "lucide-react";

export function ErrorBanner({ error, onClose, onRetry }) {
  if (!error) return null;

  return (
    <div className="error-banner">
      <div className="error-banner-content">
        <AlertCircle size={18} className="error-icon" />
        <div className="error-text">
          <strong>Inference Notice:</strong> {error}
        </div>
      </div>
      <div className="error-actions">
        {onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            <RotateCcw size={13} />
            <span>Retry</span>
          </button>
        )}
        <button type="button" className="close-error-btn" onClick={onClose}>
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

export default ErrorBanner;

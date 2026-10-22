import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ModelInfoModal from "./components/ModelInfoModal";
import useChat from "./hooks/useChat";
import api from "./services/api";

export function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [status, setStatus] = useState({
    ollama: false,
    model: "llama3.2:latest",
    models: []
  });
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [isModelInfoOpen, setIsModelInfoOpen] = useState(false);

  const {
    messages,
    studyMode,
    setStudyMode,
    examMarks,
    setExamMarks,
    summaryType,
    setSummaryType,
    loading,
    error,
    setError,
    sendMessage,
    clearChat,
    retryLastMessage
  } = useChat();

  // Health check query
  const checkStatus = useCallback(async () => {
    setCheckingHealth(true);
    try {
      const data = await api.getHealth();
      setStatus({
        ollama: data.ollama === true,
        model: data.model || "llama3.2:latest",
        models: data.models || []
      });
    } catch (err) {
      console.warn("Failed to ping backend /api/health:", err);
      setStatus((prev) => ({ ...prev, ollama: false }));
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    // Poll health status every 15 seconds
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <div className="app-shell">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={status}
        onClearSession={clearChat}
        onOpenModelInfo={() => setIsModelInfoOpen(true)}
      />

      <main className="main-content">
        {activeTab === "chat" ? (
          <Home
            messages={messages}
            studyMode={studyMode}
            setStudyMode={setStudyMode}
            examMarks={examMarks}
            setExamMarks={setExamMarks}
            summaryType={summaryType}
            setSummaryType={setSummaryType}
            loading={loading}
            error={error}
            setError={setError}
            sendMessage={sendMessage}
            retryLastMessage={retryLastMessage}
          />
        ) : (
          <Dashboard
            status={status}
            messagesCount={messages.length}
            currentMode={studyMode}
            onSwitchMode={setStudyMode}
            onNavigateChat={() => setActiveTab("chat")}
          />
        )}
      </main>

      <ModelInfoModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
        status={status}
      />
    </div>
  );
}

export default App;

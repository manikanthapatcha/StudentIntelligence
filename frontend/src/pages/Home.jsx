import React, { useRef, useEffect } from "react";
import ModeSelector from "../components/ModeSelector";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorBanner from "../components/ErrorBanner";

export function Home({
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
  retryLastMessage
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="home-container">
      {/* Mode Selection Bar */}
      <ModeSelector
        selectedMode={studyMode}
        onSelectMode={setStudyMode}
        examMarks={examMarks}
        onSelectExamMarks={setExamMarks}
        summaryType={summaryType}
        onSelectSummaryType={setSummaryType}
      />

      {/* Main Chat Stream Area */}
      <div className="chat-window">
        <div className="messages-stream">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onRetry={retryLastMessage} />
          ))}

          {loading && <LoadingIndicator studyMode={studyMode} />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error notification banner */}
      <ErrorBanner
        error={error}
        onClose={() => setError(null)}
        onRetry={retryLastMessage}
      />

      {/* Bottom Chat Input */}
      <ChatInput
        onSendMessage={sendMessage}
        loading={loading}
        selectedMode={studyMode}
      />
    </div>
  );
}

export default Home;

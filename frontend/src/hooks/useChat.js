import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

const STORAGE_KEYS = {
  HISTORY: "localai_chat_history",
  MODE: "localai_study_mode",
  EXAM_MARKS: "localai_exam_marks",
  SUMMARY_TYPE: "localai_summary_type"
};

const DEFAULT_WELCOME_MESSAGE = {
  id: "welcome-msg",
  role: "assistant",
  content: `### Welcome to LocalAI Study Intelligence 🧠
I am your **100% offline, local AI study assistant**, running directly on your computer via **Ollama (Llama 3.2)**.

#### How I can help you:
- **💡 Explain Simply**: Break down tricky CS concepts into clear beginner analogies.
- **⚙️ Technical**: Deep-dive into architecture, algorithms, and tradeoffs.
- **📝 Exam Answer**: University exam structured answers calibrated for **2, 5, or 10 marks**.
- **🎯 Interview Mode**: Technical mock interviews with code review and model answers.
- **❓ MCQ Generator**: High-yield 4-choice questions with hidden explanations.
- **🧩 Quiz Mode**: Interactive 1-on-1 Q&A knowledge assessment.
- **📑 Summarizer**: Distill textbooks or lecture transcripts into rapid revision digests.

Select a study mode above and ask any topic!`,
  timestamp: new Date().toISOString(),
  studyMode: "Explain Simply"
};

export function useChat() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load stored chat history:", e);
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [studyMode, setStudyMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.MODE) || "Explain Simply";
  });

  const [examMarks, setExamMarks] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.EXAM_MARKS) || "10";
  });

  const [summaryType, setSummaryType] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SUMMARY_TYPE) || "Key points";
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to persist messages to localStorage:", e);
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODE, studyMode);
  }, [studyMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAM_MARKS, examMarks);
  }, [examMarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUMMARY_TYPE, summaryType);
  }, [summaryType]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text || !text.trim() || loading) return;

      const trimmedText = text.trim();
      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmedText,
        timestamp: new Date().toISOString(),
        studyMode,
        examMarks: studyMode === "Exam Answer" ? examMarks : undefined,
        summaryType: studyMode === "Summarizer" ? summaryType : undefined
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      // Prepare conversation history (exclude welcome system prompt)
      const formattedHistory = messages
        .filter((m) => m.id !== "welcome-msg")
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      try {
        const responseData = await api.sendMessage({
          message: trimmedText,
          history: formattedHistory,
          studyMode,
          examMarks: studyMode === "Exam Answer" ? examMarks : undefined,
          summaryType: studyMode === "Summarizer" ? summaryType : undefined
        });

        if (responseData && responseData.success) {
          const aiMessage = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: responseData.response,
            timestamp: new Date().toISOString(),
            studyMode,
            model: responseData.model
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          throw new Error(responseData?.error || "Failed to generate response.");
        }
      } catch (err) {
        console.error("Chat error:", err);
        const errorMsg =
          err.response?.data?.error ||
          err.message ||
          "Local AI is unavailable. Please make sure Ollama is running.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, studyMode, examMarks, summaryType]
  );

  const clearChat = useCallback(() => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      sendMessage(lastUserMsg.content);
    }
  }, [messages, sendMessage]);

  return {
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
  };
}

export default useChat;

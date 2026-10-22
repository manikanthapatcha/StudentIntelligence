import ollamaService from "../services/ollamaService.js";
import { getSystemPrompt, STUDY_MODES } from "../prompts/studyPrompts.js";
import config from "../config/config.js";

export async function handleChatMessage(req, res, next) {
  try {
    const { message, history = [], studyMode = STUDY_MODES.EXPLAIN_SIMPLY, examMarks, summaryType, model } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required and cannot be empty."
      });
    }

    if (message.length > 10000) {
      return res.status(400).json({
        success: false,
        error: "Message exceeds maximum allowed character limit (10,000 characters)."
      });
    }

    // Build the system prompt tailored to the selected study mode
    const systemPrompt = getSystemPrompt(studyMode, { examMarks, summaryType });

    // Sanitize and structure message history for Ollama REST format
    const formattedHistory = Array.isArray(history)
      ? history
          .filter((item) => item && (item.role === "user" || item.role === "assistant") && item.content)
          .map((item) => ({
            role: item.role,
            content: String(item.content)
          }))
          .slice(-10) // Limit to last 10 messages to keep local context window performant
      : [];

    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message.trim() }
    ];

    const result = await ollamaService.generateChat(messages, false, model);

    return res.json({
      success: true,
      response: result.message,
      model: result.model,
      stats: {
        totalDuration: result.totalDuration,
        evalCount: result.evalCount
      }
    });
  } catch (error) {
    next(error);
  }
}

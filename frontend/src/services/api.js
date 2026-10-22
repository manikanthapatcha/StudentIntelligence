import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for local inference
  headers: {
    "Content-Type": "application/json"
  }
});

export const api = {
  /**
   * Check health and connectivity of backend & local Ollama engine
   */
  async getHealth() {
    try {
      const response = await apiClient.get("/health");
      return response.data;
    } catch (error) {
      return {
        status: "error",
        ollama: false,
        error: error.response?.data?.message || error.message || "Failed to reach backend"
      };
    }
  },

  /**
   * Send chat prompt and history to local LLM
   */
  async sendMessage({ message, history, studyMode, examMarks, summaryType, model }) {
    const payload = {
      message,
      history,
      studyMode,
      examMarks,
      summaryType,
      model
    };

    const response = await apiClient.post("/chat", payload);
    return response.data;
  }
};

export default api;

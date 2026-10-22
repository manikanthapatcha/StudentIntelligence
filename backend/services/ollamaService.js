import axios from "axios";
import config from "../config/config.js";

/**
 * Service dedicated to direct communication with local Ollama instance via REST API.
 */
class OllamaService {
  constructor() {
    this.client = axios.create({
      baseURL: config.ollamaUrl,
      timeout: config.requestTimeoutMs
    });
  }

  /**
   * Resolves the best available model tag from Ollama, supporting tag variants and auto-fallback.
   */
  async resolveModel(preferredModel = config.ollamaModel) {
    try {
      const response = await this.client.get("/api/tags");
      const availableModels = response.data?.models?.map((m) => m.name) || [];

      if (availableModels.length === 0) {
        return {
          model: preferredModel,
          available: false,
          models: [],
          error: `No models found in Ollama. Please download a model by running in your terminal:\nollama run ${preferredModel.split(":")[0]}`
        };
      }

      // 1. Exact match (e.g. "llama3.2:latest")
      if (availableModels.includes(preferredModel)) {
        return { model: preferredModel, available: true, models: availableModels };
      }

      // 2. Base name match (e.g. "llama3.2" matches "llama3.2:latest" or "llama3.2:3b")
      const baseName = preferredModel.split(":")[0];
      const matchingModel = availableModels.find(
        (m) => m === baseName || m.startsWith(`${baseName}:`) || m.split(":")[0] === baseName
      );

      if (matchingModel) {
        return { model: matchingModel, available: true, models: availableModels };
      }

      // 3. Auto-fallback to the first installed model in Ollama
      return {
        model: availableModels[0],
        available: true,
        models: availableModels,
        fallbackFrom: preferredModel
      };
    } catch (error) {
      return {
        model: preferredModel,
        available: false,
        models: [],
        error: error.message
      };
    }
  }

  /**
   * Verifies Ollama connectivity and retrieves available local models.
   */
  async checkHealth() {
    try {
      const resolved = await this.resolveModel();

      return {
        reachable: true,
        model: resolved.model || config.ollamaModel,
        models: resolved.models || [],
        modelReady: resolved.available === true
      };
    } catch (error) {
      return {
        reachable: false,
        model: config.ollamaModel,
        models: [],
        modelReady: false,
        error: error.message
      };
    }
  }

  /**
   * Sends multi-turn chat messages directly to Ollama REST /api/chat.
   * @param {Array<{role: string, content: string}>} messages
   * @param {boolean} stream
   * @param {string} [requestedModel]
   */
  async generateChat(messages, stream = false, requestedModel) {
    try {
      const preferred = requestedModel || config.ollamaModel;
      const modelInfo = await this.resolveModel(preferred);

      if (!modelInfo.available) {
        const pullCmd = preferred.split(":")[0];
        throw new Error(
          `Ollama model '${preferred}' is not downloaded yet. Please open a terminal and run:\nollama run ${pullCmd}`
        );
      }

      const activeModel = modelInfo.model;
      const payload = {
        model: activeModel,
        messages,
        stream
      };

      const response = await this.client.post("/api/chat", payload);

      if (!response.data || !response.data.message) {
        throw new Error("Malformed response received from Ollama API");
      }

      return {
        success: true,
        model: activeModel,
        message: response.data.message.content,
        totalDuration: response.data.total_duration,
        evalCount: response.data.eval_count
      };
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Local AI is unavailable. Please make sure Ollama is running at " + config.ollamaUrl);
      }
      if (error.code === "ECONNABORTED") {
        throw new Error("Ollama generation timed out. The local model took too long to respond.");
      }
      if (error.response?.data?.error) {
        const ollamaErr = error.response.data.error;
        if (ollamaErr.includes("not found")) {
          const target = requestedModel || config.ollamaModel;
          const pullCmd = target.split(":")[0];
          throw new Error(
            `Ollama Error: ${ollamaErr}. Run 'ollama run ${pullCmd}' in your terminal to install it.`
          );
        }
        throw new Error(`Ollama Error: ${ollamaErr}`);
      }
      throw error;
    }
  }
}

export const ollamaService = new OllamaService();
export default ollamaService;

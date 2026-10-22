import ollamaService from "../services/ollamaService.js";
import config from "../config/config.js";

export async function getHealthStatus(req, res) {
  const health = await ollamaService.checkHealth();

  if (!health.reachable) {
    return res.status(503).json({
      status: "error",
      ollama: false,
      model: config.ollamaModel,
      message: "Local AI is unavailable. Please make sure Ollama is running."
    });
  }

  return res.json({
    status: "ok",
    ollama: true,
    model: health.model || config.ollamaModel,
    models: health.models,
    modelReady: health.modelReady
  });
}

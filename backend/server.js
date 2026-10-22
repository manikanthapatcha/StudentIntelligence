import express from "express";
import cors from "cors";
import config from "./config/config.js";
import healthRoutes from "./routes/healthRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Root welcome route
app.get("/", (req, res) => {
  res.json({
    name: "LocalAI Study Intelligence Platform API",
    version: "1.0.0",
    engine: "Ollama (Local)",
    model: config.ollamaModel,
    status: "online"
  });
});

// Primary API routes
app.use("/api/health", healthRoutes);
app.use("/api/chat", chatRoutes);

// Fallback error middlewares
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`⚡ LocalAI Study Intelligence API running on port ${config.port}`);
  console.log(`🧠 Local Ollama Target: ${config.ollamaUrl}`);
  console.log(`🎯 Active Model: ${config.ollamaModel}`);
  console.log(`====================================================`);
});
/**
 * Centralized error handling middleware.
 * Intercepts errors and returns user-friendly JSON payloads without leaking internal stack traces.
 */
export function errorHandler(err, req, res, next) {
  console.error(`[Server Error] ${req.method} ${req.url}:`, err.message || err);

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  return res.status(statusCode).json({
    success: false,
    error: err.message || "An unexpected error occurred while communicating with the local AI engine."
  });
}

/**
 * 404 Route Not Found middleware
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

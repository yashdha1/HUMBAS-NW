// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error for debugging (but don't expose sensitive info)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  } else {
    console.error("Error:", message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};


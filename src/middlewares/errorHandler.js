import { logger } from "../utils/logger.js";
export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);
  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ errors });
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  // Default
  res.status(500).json({ error: err.message || "Server Error" });
};

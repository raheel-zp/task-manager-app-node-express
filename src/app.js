import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import hpp from "hpp";
import morgan from "morgan";
import path from "path";

import { logger } from "./utils/logger.js";
import { swaggerDocs } from "./utils/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { customLogger } from "./middlewares/logger.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// If behind a reverse proxy (e.g., Nginx, Render, Vercel), trust proxy for rate limiter
app.set("trust proxy", 1);

// Limit repeated requests to public APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Helmet: Set secure HTTP headers
app.use(helmet());

// Enable CORS for all origins (you can restrict it later)
const allowedOrigins = [
  "http://localhost:5173", // your React dev frontend
  "http://localhost:3001", // optional extra local port
  process.env.FRONTEND_URL, // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use(hpp());

app.use(compression());

app.use(
  morgan("tiny", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

app.use(customLogger);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

swaggerDocs(app);

app.use("/api/upload", uploadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

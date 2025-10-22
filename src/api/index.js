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
import serverless from "serverless-http";

import { logger } from "./utils/logger.js";
import { swaggerDocs } from "./utils/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { customLogger } from "./middlewares/logger.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// If behind a reverse proxy (e.g., Vercel), trust proxy for rate limiter
app.set("trust proxy", 1);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Helmet for security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manager-frontend-react-olive.vercel.app/",
  process.env.FRONTEND_URL,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, serverless internal calls
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 200, // Important for preflight requests
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middlewares
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());

// Logging
app.use(
  morgan("tiny", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

app.use(customLogger);

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Swagger docs
swaggerDocs(app);

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Export serverless handler
export const handler = serverless(app);

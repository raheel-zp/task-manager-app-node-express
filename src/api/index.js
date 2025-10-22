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

import { logger } from "../utils/logger.js";
import { swaggerDocs } from "../utils/swagger.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { notFound } from "../middlewares/notFound.js";
import { customLogger } from "../middlewares/logger.js";

import authRoutes from "../routes/authRoutes.js";
import taskRoutes from "../routes/taskRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import uploadRoutes from "../routes/uploadRoutes.js";

dotenv.config();

const app = express();

// Trust Vercel proxy
app.set("trust proxy", 1);

// Rate limiter
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

// Helmet
app.use(helmet());

// ✅ Fixed CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manager-frontend-react-olive.vercel.app", // ✅ no trailing slash
  process.env.FRONTEND_URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn("Blocked CORS request from:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// ✅ Apply globally and handle preflights
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
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

// Static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Swagger
swaggerDocs(app);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://task-manager-frontend-react-olive.vercel.app"
  ); // Or '*' for all origins (use with caution in production)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Include any custom headers used
  next();
});

app.get("/test", (req, res) => {
  res.json({ status: "ok", origin: req.headers.origin });
});

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// ✅ Vercel expects a default export
export default app;

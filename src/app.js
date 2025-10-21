import express from "express";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { customLogger } from "./middlewares/logger.js";
import { notFound } from "./middlewares/notFound.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { logger } from "./utils/logger.js";
import { swaggerDocs } from "./utils/swagger.js";
import path from "path";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
swaggerDocs(app);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(helmet()); // secure headers
app.use(cors()); // enable CORS
app.use(limiter); // rate limiting

app.use(
  morgan("tiny", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

app.use(customLogger);
app.use(express.json());

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/upload", uploadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

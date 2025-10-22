import express from "express";
import cors from "cors";
import serverless from "serverless-http";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.get("/test", (req, res) => {
  res.status(200).json({ message: "✅ Express is running on Vercel" });
});

export const handler = serverless(app);
export default handler;

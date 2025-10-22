import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/test", (req, res) => {
  res.json({ message: "✅ Express minimal working" });
});

export const handler = serverless(app);

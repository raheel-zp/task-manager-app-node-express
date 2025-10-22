const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.get("/api/test", (req, res) => {
  res.json({ message: "✅ CommonJS Express on Vercel working!" });
});

module.exports = app;
module.exports.handler = serverless(app);

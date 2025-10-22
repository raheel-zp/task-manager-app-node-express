import serverless from "serverless-http";
import app from "./index.js";

console.log("✅ Vercel serverless function initialized");

export default serverless(app);

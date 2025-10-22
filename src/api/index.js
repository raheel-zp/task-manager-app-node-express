import app from "../app.js";
import { connectDB } from "../config/db.js";

export default async function handler(req, res) {
  // Connect to MongoDB
  await connectDB();

  // Forward request to Express app
  return app(req, res);
}

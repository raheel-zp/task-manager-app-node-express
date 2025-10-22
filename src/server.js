import app from "./app.js";
import { connectDB } from "./utils/db.js";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("✅ MongoDB connection successful!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

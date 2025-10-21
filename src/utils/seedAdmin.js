import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";

dotenv.config();
connectDB();

const seedAdmin = async () => {
  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  console.log("Admin user created:", admin.email);
  process.exit();
};

seedAdmin();

import jwt from "jsonwebtoken";
export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

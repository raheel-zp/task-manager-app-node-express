import User from "../models/User.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

export const getUsers = async (req, res) => {
  const total = await User.countDocuments();

  const features = new ApiFeatures(User.find().select("-password"), req.query)
    .search()
    .filter()
    .sort()
    .paginate();

  const users = await features.query;

  res.json({
    total,
    count: users.length,
    data: users,
  });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.create({ name, email, role });
  res.status(201).json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};

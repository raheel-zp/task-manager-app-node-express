import { Task } from "../models/Task.js";

export const getTasks = async ({
  filter = {},
  page = 1,
  limit = 5,
  user,
  sort = "-createdAt",
}) => {
  const skip = (page - 1) * limit;
  filter.user = user._id;

  const [tasks, total] = await Promise.all([
    Task.find(filter).skip(skip).limit(limit).sort(sort).lean(),
    Task.countDocuments(filter),
  ]);

  const withOverdue = tasks.map((task) => ({
    ...task,
    isOverdue:
      task.dueDate && !task.done && new Date(task.dueDate) < new Date(),
  }));

  return {
    data: withOverdue,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  };
};

export const createTask = async (data, user) => {
  const task = new Task({ ...data, user: user._id });
  return await task.save();
};

export const updateTask = async (id, data) => {
  const updated = await Task.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw new Error("Task not found");
  return updated;
};

export const deleteTask = async (id) => {
  const result = await Task.findByIdAndDelete(id);
  if (!result) throw new Error("Task not found");
};

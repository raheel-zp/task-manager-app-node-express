import * as taskService from "../services/taskService.js";

export const getTasks = async (req, res, next) => {
  try {
    const { page, limit, done, search, sortBy } = req.query;
    const filter = {};

    if (done !== undefined) filter.done = done === "true";
    if (search) filter.title = { $regex: search, $options: "i" };

    let sort = "-createdAt";
    if (sortBy === "oldest") sort = "createdAt";
    if (sortBy === "title") sort = "title";
    if (sortBy === "dueDate") sort = "dueDate";
    if (sortBy === "status") sort = "done";

    const tasks = await taskService.getTasks({
      filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 5,
      user: req.user,
      sort,
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, done, dueDate } = req.body;
    const task = await taskService.createTask(
      { title, done, dueDate },
      req.user
    );
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const updated = await taskService.updateTask(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const markAllDone = async (req, res, next) => {
  try {
    const result = await Task.updateMany(
      { user: req.user._id, done: false },
      { done: true }
    );
    res.json({ message: `${result.modifiedCount} tasks marked as done` });
  } catch (error) {
    next(error);
  }
};

export const clearCompleted = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id, done: true });
    res.json({ message: `${result.deletedCount} completed tasks removed` });
  } catch (error) {
    next(error);
  }
};

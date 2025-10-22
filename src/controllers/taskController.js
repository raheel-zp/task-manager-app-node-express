import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    dueDate,
  });
  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 5, status, search, sort } = req.query;
    const query = { user: req.user.id };

    // Filter by status
    if (status) query.status = status;

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting logic
    let sortOption = {};
    if (sort) {
      const [key, order] = sort.split(":");
      sortOption[key] = order === "desc" ? -1 : 1;
    } else {
      sortOption.createdAt = -1; // Default: newest first
    }

    // Pagination logic
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const updateTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;
  task.dueDate = dueDate || task.dueDate;

  const updated = await task.save();
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};

import { Task } from "../models/Task.js";
import User from "../models/User.js";

export const checkOverdueTasks = async () => {
  const overdue = await Task.find({
    done: false,
    dueDate: { $lt: new Date() },
  }).populate("user", "email name");

  for (const task of overdue) {
    console.log(
      `📧 Reminder: Hey ${task.user.name}, your task "${task.title}" is overdue!`
    );
  }

  return overdue.length;
};

import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  markAllDone,
  clearCompleted,
} from "../controllers/taskController.js";
import { checkOverdueTasks } from "../utils/reminder.js";
import { validateTask } from "../middlewares/validateTask.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of tasks
 */
const router = express.Router();
router.use(authMiddleware);
router.get("/", getTasks);
router.post("/", validateTask, createTask);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);
router.patch("/mark-all-done", markAllDone);
router.delete("/clear-completed", clearCompleted);
router.get("/check-overdue", async (req, res) => {
  const count = await checkOverdueTasks();
  res.json({ message: `Checked overdue tasks: ${count}` });
});

export default router;

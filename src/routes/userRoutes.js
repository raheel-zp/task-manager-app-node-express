import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/:id")
  .delete(authMiddleware, authorizeRoles("admin"), deleteUser)
  .put(authMiddleware, authorizeRoles("admin", "manager"), updateUser)
  .get(authMiddleware, authorizeRoles("admin", "manager", "user"), getUserById);

router.route("/").get(getUsers).post(createUser);

export default router;

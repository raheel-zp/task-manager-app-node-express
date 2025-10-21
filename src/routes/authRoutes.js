import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/userValidations.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and profile management
 */
const router = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Raheel
 *               email:
 *                 type: string
 *                 example: raheel@example.com
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (e.g., email already exists)
 */
router.post("/register", validate(registerValidation), registerUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: raheel@example.com
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginValidation), loginUser);
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 670a6b62d8a0a2a8f9a92b23
 *                 name:
 *                   type: string
 *                   example: Raheel
 *                 email:
 *                   type: string
 *                   example: raheel@example.com
 *       401:
 *         description: Unauthorized or invalid token
 */
router.get("/profile", authMiddleware, getProfile);

export default router;

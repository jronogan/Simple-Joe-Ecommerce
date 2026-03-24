import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} from "../controllers/category.js";
import {
  adminAuthorization,
  authenticateAccessToken,
} from "../middleware/authentication.js";

const router = express.Router();

// Public Routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin Routes
router.post("/", authenticateAccessToken, adminAuthorization, createCategory);
router.delete(
  "/:id",
  authenticateAccessToken,
  adminAuthorization,
  deleteCategory,
);

export default router;

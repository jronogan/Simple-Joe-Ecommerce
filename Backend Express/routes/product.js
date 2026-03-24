import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
  addReview,
} from "../controllers/product.js";
import {
  adminAuthorization,
  authenticateAccessToken,
} from "../middleware/authentication.js";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// User Routes
router.post("/:id/reviews", authenticateAccessToken, addReview);

// Admin Routes
router.post("/", authenticateAccessToken, adminAuthorization, createProduct);
router.put("/:id", authenticateAccessToken, adminAuthorization, updateProduct);
router.delete(
  "/:id",
  authenticateAccessToken,
  adminAuthorization,
  deleteProduct,
);

export default router;

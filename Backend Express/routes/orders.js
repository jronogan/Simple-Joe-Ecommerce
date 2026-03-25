import express from "express";
import {
  cancelOrder,
  createOrderFromCart,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orders.js";
import {
  adminAuthorization,
  authenticateAccessToken,
} from "../middleware/authentication.js";

const router = express.Router();

// User Routes
router.post("/", authenticateAccessToken, createOrderFromCart);
router.get("/myOrders", authenticateAccessToken, getMyOrders);
router.delete("/:id/cancel", authenticateAccessToken, cancelOrder);

// Admin Routes
router.get("/", authenticateAccessToken, adminAuthorization, getAllOrders);
router.put(
  "/:id/status",
  authenticateAccessToken,
  adminAuthorization,
  updateOrderStatus,
);

// User and Admin Routes
router.get("/:id", authenticateAccessToken, getOrderById);

export default router;

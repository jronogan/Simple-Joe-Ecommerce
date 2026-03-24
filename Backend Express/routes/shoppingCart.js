import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/shoppingCart.js";
import { authenticateAccessToken } from "../middleware/authentication.js";

const router = express.Router();

// User routes (Only)
router.get("/", authenticateAccessToken, getCart);
router.post("/items", authenticateAccessToken, addToCart);
router.patch("/items", authenticateAccessToken, updateCartItem);
router.delete("/items/:productId", authenticateAccessToken, removeFromCart);
router.delete("/", authenticateAccessToken, clearCart);

export default router;

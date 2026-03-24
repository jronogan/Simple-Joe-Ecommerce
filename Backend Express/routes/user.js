import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  refreshToken,
  logoutUser,
  updateUser,
} from "../controllers/user.js";
import { authenticateAccessToken } from "../middleware/authentication.js";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../controllers/address.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);

// Protected routes
router.get("/profile", authenticateAccessToken, getUserProfile);
router.post("/logout", authenticateAccessToken, logoutUser);
router.put("/update", authenticateAccessToken, updateUser);
// Address Protected route
router.post("/address", authenticateAccessToken, createAddress);
router.get("/address", authenticateAccessToken, getAddresses);
router.put("/address/:id", authenticateAccessToken, updateAddress);
router.delete("/address/:id", authenticateAccessToken, deleteAddress);

// Authorization route

export default router;

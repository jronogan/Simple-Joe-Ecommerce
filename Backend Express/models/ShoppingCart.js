import mongoose from "mongoose";
import cartItemSchema from "./cartItemSchema.js"; // Import the schema

const shoppingCartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema], // Use imported schema

    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

shoppingCartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

shoppingCartSchema.pre("save", async function () {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => {
    return sum + (item.priceAtAdd || 0) * item.quantity;
  }, 0);
  this.lastActive = new Date();
  this.expiresAt = new Date(+new Date() + 30 * 24 * 60 * 60 * 1000);
});

const ShoppingCart =
  mongoose.models.ShoppingCart ||
  mongoose.model("ShoppingCart", shoppingCartSchema);
export default ShoppingCart;

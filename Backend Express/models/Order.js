import mongoose, { mongo } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    // DENORMALIZED - snapshot at time of purchase
    type: String,
    required: true,
  },
  price: {
    // DENORMALIZED - snapshot at time of purchase
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: String, // DENORMALIZED - snapshot of product image
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    // DENORMALIZED user info at time of order
    shippingAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: String,
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "US" },
      phone: String,
    },

    paymentInfo: {
      method: {
        type: String,
        enum: ["credit_card", "debit_card", "paypal", "apple_pay", "google_pay"],
        required: true,
      },
      transactionId: String,
      paidAt: Date,
    },

    // Price breakdown
    priceBreakdown: {
      subtotal: { type: Number, required: true, min: 0 },
      shipping: { type: Number, default: 0, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },

    // Status tracking
    status: {
      type: String,
      enum: [
        "pending", // Order placed, payment pending
        "processing", // Payment confirmed, preparing
        "shipped", // Shipped to customer
        "delivered", // Customer received
        "cancelled", // Order cancelled
        "refunded", // Money returned
      ],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Tracking
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,

    // Notes
    customerNotes: String,
    adminNotes: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

// Index for searching
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;

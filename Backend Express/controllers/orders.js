import Order from "../models/Order.js";
import ShoppingCart from "../models/ShoppingCart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";

export const createOrderFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { addressId, paymentMethod, transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ msg: "transactionId is required" });
    }

    // 1. Validate shipping address belongs to user
    const shippingAddress = await Address.findById(addressId);
    if (!shippingAddress) {
      return res.status(404).json({ msg: "Address not found" });
    }
    if (shippingAddress.user.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Not authorized to use this address" });
    }

    // 2. Get user's cart
    const cart = await ShoppingCart.findOne({ user: userId }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        msg: "Cart is empty",
      });
    }

    // 2. Verify stock and build order items
    const orderItems = [];
    const stockUpdates = []; // defer stock deduction until after order is created
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          msg: `Product not found: ${item.productName}`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          msg: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
        });
      }

      const currentPrice = product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: currentPrice,
        quantity: item.quantity,
        image: product.images?.[0],
      });

      subtotal += currentPrice * item.quantity;
      stockUpdates.push({ product, quantity: item.quantity });
    }

    // 3. Calculate totals (in real app, you'd get shipping/tax from elsewhere)
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    // 4. Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: {
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      },
      paymentInfo: {
        method: paymentMethod,
        transactionId,
        paidAt: new Date(),
      },
      priceBreakdown: {
        subtotal,
        shipping,
        tax,
        discount: 0,
        total,
      },
      status: "processing",
      paymentStatus: "paid",
    });

    // 5. Deduct stock now that the order exists
    for (const { product, quantity } of stockUpdates) {
      product.stockQuantity -= quantity;
      await product.save();
    }

    // 6. Clear the cart
    cart.items = [];
    await cart.save();

    // 7. Return order
    res.status(201).json({
      success: true,
      msg: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ user: userId });

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    if (order.user._id.toString() !== userId && role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Not authorized to view this order",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    // Check authorization
    if (order.user.toString() !== userId && role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Not authorized to cancel this order",
      });
    }

    // Check if order can be cancelled
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        msg: `Order cannot be cancelled because it is ${order.status}`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
      });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();

    // If payment was made, you'd also process refund here

    await order.save();

    res.json({
      success: true,
      msg: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, carrier, notes } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    const validTransitions = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        msg: `Cannot transition order from "${order.status}" to "${status}"`,
      });
    }

    order.status = status;

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (notes) order.adminNotes = notes;

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      msg: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

import ShoppingCart from "../models/ShoppingCart.js";
// import CartItem from "../models/cartItemSchema.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const { userId } = req.user;

    const cart = await ShoppingCart.findOne({ user: userId }).populate(
      "items.product",
    );
    if (!cart) {
      return res.status(200).json({ msg: "Cart is empty", cart: { items: [], totalItems: 0, totalPrice: 0 } });
    }

    res.status(200).json({ msg: "Cart retrieved successfully", cart });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Find or create cart
    let cart = await ShoppingCart.findOne({ user: userId });

    if (!cart) {
      cart = new ShoppingCart({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    const existingQty =
      existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;

    // Check stock availability against total quantity
    if (product.stockQuantity < existingQty + quantity) {
      return res.status(400).json({
        msg: `Only ${product.stockQuantity} items available`,
      });
    }

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item with price snapshot
      cart.items.push({
        product: productId,
        quantity,
        priceAtAdd: product.price,
        productName: product.name,
      });
    }

    // Save cart (pre-save middleware will update totals)
    await cart.save();

    // Populate product details for response
    await cart.populate("items.product");

    res.status(200).json({
      msg: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: "Quantity must be at least 1" });
    }

    const cart = await ShoppingCart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        msg: `Only ${product.stockQuantity} items available`,
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      msg: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;

    const cart = await ShoppingCart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
      msg: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const cart = await ShoppingCart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      msg: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in clearCart:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

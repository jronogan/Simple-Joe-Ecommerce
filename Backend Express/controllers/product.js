import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { firstLetterToCaps } from "../api/api.js";

export const createProduct = async (req, res) => {
  const { name, description, price, stockQuantity, categoryName, images } =
    req.body;

  try {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      category: category._id,
      images,
    });

    res.status(201).json(product);
  } catch {
    res.status(400).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { categoryName } = req.query;
    const filter = {};

    if (categoryName) {
      const category = await Category.findOne({
        name: firstLetterToCaps(categoryName),
      });
      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }
      filter.category = category._id;
    }

    const products = await Product.find(filter).populate(
      "category",
      "name path",
    );

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
    console.error("Error fetching products:", error);
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id)
      .populate("category", "name path")
      .populate("reviews.user", "name email");

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json(product);
  } catch {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stockQuantity, categoryName, images } =
    req.body;

  try {
    const updateData = { name, description, price, stockQuantity, images };

    if (categoryName != null) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }
      updateData.category = category._id;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category", "name path");

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json(product);
  } catch {
    res.status(400).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res
      .status(200)
      .json({ msg: "Product deleted successfully", deletedProduct });
  } catch {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const alreadyReviewed = product.reviews.some(
      (r) => r.user.toString() === req.user.userId.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({ msg: "Product already reviewed" });
    }

    product.reviews.push({ user: req.user.userId, rating, comment });

    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = total / product.reviews.length;

    await product.save();

    res
      .status(201)
      .json({ msg: "Review added", averageRating: product.averageRating });
  } catch {
    res.status(400).json({ error: "Failed to add review" });
  }
};

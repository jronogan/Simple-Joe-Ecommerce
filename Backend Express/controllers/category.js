import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const { name, parent } = req.body;
  try {
    let path = name.toLowerCase();

    if (parent) {
      const parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return res.status(404).json({ error: "Parent category not found" });
      }

      const parentPathway = parentCategory.path;
      const pathName = name.toLowerCase();

      path = `${parentPathway}>${pathName}`;
    }

    const category = await Category.create({ name, parent, path });
    res.status(201).json(category);
  } catch {
    res.status(400).json({ error: "Failed to create category" });
  }
};

export const getAllCategories = async (req, res) => {
  const categories = await Category.find();

  res.status(200).json(categories);
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  res.status(200).json(category);
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) {
    return res.status(404).json({ msg: "Category not found" });
  }

  res
    .status(200)
    .json({ msg: "Category deleted successfully", deletedCategory });
};

// For now no update, it doesn't make sense. You won't really update the category of a product

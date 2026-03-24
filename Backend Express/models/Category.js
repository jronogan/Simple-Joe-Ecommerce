import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    // Better than a free‑form string if you want to query by ancestry
    // This path has to be built within the controllers
    path: { type: String }, // e.g. "electronics>phones>smartphones"
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;

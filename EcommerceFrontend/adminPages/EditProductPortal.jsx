import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProduct, getAllCategories } from "../src/api/crud";
import "./EditProductPortal.css";

const EditProductPortal = ({ product, onClose }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: product.name,
    description: product.description || "",
    price: product.price,
    stockQuantity: product.stockQuantity,
    category: product.category?._id ?? product.category ?? "",
    images: product.images?.join(", ") ?? "",
  });

  const { data: categories } = useQuery({
    queryKey: ["allCategories"],
    queryFn: getAllCategories,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data) => updateProduct(product._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      onClose();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      category: form.category || undefined,
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return createPortal(
    <div className="edit-portal-overlay" onClick={onClose}>
      <div
        className="edit-portal-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="edit-portal-title">Edit Product</h2>
        <form className="edit-portal-form" onSubmit={handleSubmit}>
          <label className="edit-portal-label">
            Name
            <input
              className="edit-portal-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="edit-portal-label">
            Description
            <textarea
              className="edit-portal-input edit-portal-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <div className="edit-portal-row">
            <label className="edit-portal-label">
              Price ($)
              <input
                className="edit-portal-input"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label className="edit-portal-label">
              Stock
              <input
                className="edit-portal-input"
                name="stockQuantity"
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="edit-portal-label">
            Category
            <select
              className="edit-portal-input"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">— None —</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label className="edit-portal-label">
            Images (comma-separated URLs)
            <input
              className="edit-portal-input"
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="https://..., https://..."
            />
          </label>

          {isError && (
            <p className="edit-portal-error">Failed to update product.</p>
          )}

          <div className="edit-portal-actions">
            <button
              type="button"
              className="edit-portal-btn edit-portal-btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-portal-btn edit-portal-btn-filled"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal"),
  );
};

export default EditProductPortal;

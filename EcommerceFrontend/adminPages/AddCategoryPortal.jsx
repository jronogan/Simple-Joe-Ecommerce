import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../src/api/crud";
import "./EditProductPortal.css";

const AddCategoryPortal = ({ categories, onClose }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ name: "", parent: "" });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name: form.name, parent: form.parent || undefined });
  };

  return createPortal(
    <div className="edit-portal-overlay" onClick={onClose}>
      <div className="edit-portal-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="edit-portal-title">Add New Category</h2>
        <form className="edit-portal-form" onSubmit={handleSubmit}>
          <label className="edit-portal-label">
            Name
            <input
              className="edit-portal-input"
              name="name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>

          <label className="edit-portal-label">
            Parent Category
            <select
              className="edit-portal-input"
              name="parent"
              value={form.parent}
              onChange={(e) => setForm((prev) => ({ ...prev, parent: e.target.value }))}
            >
              <option value="">— None (top-level) —</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.path ?? cat.name}
                </option>
              ))}
            </select>
          </label>

          {isError && <p className="portal-error">Failed to create category.</p>}

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
              {isPending ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal"),
  );
};

export default AddCategoryPortal;

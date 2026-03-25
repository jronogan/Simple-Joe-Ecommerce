import { useState } from "react";
import { deleteCategory, getAllCategories } from "../src/api/crud";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddCategoryPortal from "./AddCategoryPortal";
import "./admin.css";

const CategoryList = () => {
  const queryClient = useQueryClient();
  const [addingCategory, setAddingCategory] = useState(false);

  const {
    data: allCategories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: getAllCategories,
  });

  const { mutate: deletingCategory, isPending: deletePending } = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
    },
  });

  if (isLoading) return <div className="admin-page"><p className="admin-muted">Loading...</p></div>;
  if (isError) return <div className="admin-page"><p className="admin-error">Error loading categories.</p></div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Category List</h1>
      <div className="admin-container">
        <button className="admin-add-btn" onClick={() => setAddingCategory(true)}>
          Add New Category
        </button>

        {allCategories.map((category) => (
          <div className="admin-card" key={category._id}>
            <div className="admin-card-info">
              <p className="admin-card-name">{category.name}</p>
              {category.path && (
                <p className="admin-card-detail">Path: {category.path}</p>
              )}
            </div>
            <div className="admin-card-actions">
              <button
                className="admin-card-btn admin-card-btn-delete"
                onClick={() => deletingCategory(category._id)}
                disabled={deletePending}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {addingCategory && (
        <AddCategoryPortal
          categories={allCategories}
          onClose={() => setAddingCategory(false)}
        />
      )}
    </div>
  );
};

export default CategoryList;

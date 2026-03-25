import { useState } from "react";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../src/api/crud";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CategoryList = () => {
  const queryClient = useQueryClient();
  const [categoryData, setCategoryData] = useState({ name: "", parent: "" });

  const {
    data: allCategories,
    isLoading: allCategoriesLoading,
    isError: allCategoriesError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: getAllCategories,
  });

  const {
    mutate: addCategory,
    isPending: createCategoryPending,
    isError: createCategoryError,
  } = useMutation({
    mutationFn: (data) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
      setCategoryData({ name: "", parent: "" });
    },
  });

  const {
    mutate: deletingCategory,
    isPending: deletingCategoryPending,
    isError: deletingCategoryError,
  } = useMutation({
    mutationFn: (categoryId) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
    },
  });

  if (allCategoriesLoading) return <div>Loading...</div>;
  if (allCategoriesError) return <div>Error loading categories</div>;

  return (
    <div>
      <h1>Category List</h1>
      <label>Add new category</label>
      <input
        type="text"
        placeholder="Category name"
        value={categoryData.name}
        onChange={(e) =>
          setCategoryData({ ...categoryData, name: e.target.value })
        }
      />
      <select
        name="parent"
        value={categoryData.parent}
        onChange={(e) =>
          setCategoryData({ ...categoryData, parent: e.target.value })
        }
      >
        <option value="">Select Parent Category</option>
        {allCategories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.path ?? category.name}
          </option>
        ))}
      </select>

      {createCategoryError && <p>Error creating category</p>}
      {deletingCategoryError && <p>Error deleting category</p>}

      <button
        onClick={() => addCategory(categoryData)}
        disabled={!categoryData.name || createCategoryPending}
      >
        {createCategoryPending ? "Adding..." : "Add Category"}
      </button>
      <div>
        {allCategories.map((category) => (
          <div key={category._id}>
            <h4>{category.name}</h4>
            <p>Pathway: {category.path}</p>
            <button
              onClick={() => deletingCategory(category._id)}
              disabled={deletingCategoryPending}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

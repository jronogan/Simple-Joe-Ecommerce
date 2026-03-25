import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, deleteProduct } from "../src/api/crud";
import EditProductPortal from "./EditProductPortal";
import AddProductPortal from "./AddProductPortal";
import "./admin.css";

const ProductPage = () => {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const { data: allProducts, isLoading, isError } = useQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProducts,
  });

  const { mutate: productDelete, isPending: deletePending } = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });

  if (isLoading) return <div className="admin-page"><p className="admin-muted">Loading...</p></div>;
  if (isError) return <div className="admin-page"><p className="admin-error">Error loading products.</p></div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Product List</h1>
      <div className="admin-container">
        <button className="admin-add-btn" onClick={() => setAddingProduct(true)}>
          Add New Product
        </button>

        {allProducts.map((product) => (
          <div className="admin-card" key={product._id}>
            {product.images?.[0] && (
              <img
                className="admin-card-image"
                src={product.images[0]}
                alt={product.name}
              />
            )}
            <div className="admin-card-info">
              <p className="admin-card-name">{product.name}</p>
              <p className="admin-card-detail">Price: ${product.price}</p>
              <p className="admin-card-detail">Quantity: {product.stockQuantity}</p>
            </div>
            <div className="admin-card-actions">
              <button
                className="admin-card-btn admin-card-btn-edit"
                onClick={() => setEditingProduct(product)}
              >
                Edit
              </button>
              <button
                className="admin-card-btn admin-card-btn-delete"
                onClick={() => productDelete(product._id)}
                disabled={deletePending}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {addingProduct && (
        <AddProductPortal onClose={() => setAddingProduct(false)} />
      )}

      {editingProduct && (
        <EditProductPortal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductPage;

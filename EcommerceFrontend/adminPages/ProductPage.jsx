import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../src/api/crud";
import EditProductPortal from "./EditProductPortal";

const ProductPage = () => {
  const queryClient = useQueryClient();
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    description: "",
    stockQuantity: 0,
    categoryName: "",
  });
  const [editingProductData, setEditingProductData] = useState(null);

  const { data: allProductData, isLoading: allProductLoading } = useQuery({
    queryKey: "allProducts",
    queryFn: getAllProducts,
  });

  const {
    mutate: productCreation,
    isLoading: productCreationLoading,
    isError: productCreationError,
  } = useMutation({
    mutationFn: (productData) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries("allProducts");
    },
  });

  const {
    mutate: productUpdate,
    isLoading: productUpdateLoading,
    isError: productUpdateError,
  } = useMutation({
    mutationFn: (id, productData) => updateProduct(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries("allProducts");
    },
  });

  const {
    mutate: productDelete,
    isLoading: productDeleteLoading,
    isError: productDeleteError,
  } = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries("allProducts");
    },
  });

  if (productCreationLoading) return <div>Creating product...</div>;
  if (productCreationError) return <div>Error creating product</div>;

  if (productUpdateLoading) return <div>Updating product...</div>;
  if (productUpdateError) return <div>Error updating product</div>;

  if (productDeleteLoading) return <div>Deleting product...</div>;
  if (productDeleteError) return <div>Error deleting product</div>;

  if (allProductLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Product List</h1>
      <label>Add New product</label>
      <input
        type="text"
        placeholder="Product Name"
        value={productData.name}
        onChange={(e) =>
          setProductData({ ...productData, name: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Price"
        value={productData.price}
        onChange={(e) =>
          setProductData({ ...productData, price: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Description"
        value={productData.description}
        onChange={(e) =>
          setProductData({ ...productData, description: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Stock Quantity"
        value={productData.stockQuantity}
        onChange={(e) =>
          setProductData({ ...productData, stockQuantity: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Category Name"
        value={productData.categoryName}
        onChange={(e) =>
          setProductData({ ...productData, categoryName: e.target.value })
        }
      />
      <button onClick={() => productCreation(productData)}>Add Product</button>
      <div>
        {allProductData.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stockQuantity}</p>
            <p>Category: {product.categoryName}</p>
            <button onClick={() => productDelete(product.id)}>Delete</button>
            <button onClick={() => setEditingProductData(product)}>Edit</button>
          </div>
        ))}
      </div>

      {editingProductData && (
        <EditProductPortal
          product={editingProductData}
          onClose={() => setEditingProductData(null)}
        />
      )}
    </div>
  );
};

export default ProductPage;

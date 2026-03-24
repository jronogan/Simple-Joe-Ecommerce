import { apiFetch } from "./api";

// USER PROFILE
export const getUserProfile = () => apiFetch("/users/profile");

export const updateUserProfile = (profileData) =>
  apiFetch("/users/update", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });

// ADDRESS
export const createAddress = (addressData) =>
  apiFetch("/users/address", {
    method: "POST",
    body: JSON.stringify(addressData),
  });

export const getUserAddress = () => apiFetch("/users/address");

export const updateUserAddress = (addressId, addressData) =>
  apiFetch(`/users/address/${addressId}`, {
    method: "PUT",
    body: JSON.stringify(addressData),
  });

export const deleteUserAddress = (addressId) =>
  apiFetch(`/users/address/${addressId}`, { method: "DELETE" });

// PRODUCTS (USER)
export const getAllProducts = () => apiFetch("/products");

export const getOneProduct = (id) => apiFetch(`/products/${id}`);

export const addReview = (id, reviewData) =>
  apiFetch(`/products/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(reviewData),
  });

// PRODUCTS (ADMIN)
export const createProduct = (productData) =>
  apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });

export const updateProduct = (id, productData) =>
  apiFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });

export const deleteProduct = (id) =>
  apiFetch(`/products/${id}`, { method: "DELETE" });

// CATEGORY
export const getAllCategories = () => apiFetch("/categories");

export const getOneCategory = (id) => apiFetch(`/categories/${id}`);

export const createCategory = (categoryData) =>
  apiFetch("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });

export const deleteCategory = (id) =>
  apiFetch(`/categories/${id}`, { method: "DELETE" });

// CART
export const getCart = () => apiFetch("/cart");

export const addToCart = (itemData) =>
  apiFetch("/cart/items", {
    method: "POST",
    body: JSON.stringify(itemData),
  });

export const updateCartItem = (itemData) =>
  apiFetch("/cart/items", {
    method: "PATCH",
    body: JSON.stringify(itemData),
  });

export const removeCartItem = (productId) =>
  apiFetch(`/cart/items/${productId}`, { method: "DELETE" });

export const clearCart = () => apiFetch("/cart", { method: "DELETE" });

// ORDERS
export const createOrder = (orderDetails) =>
  apiFetch("/orders", { method: "POST", body: JSON.stringify(orderDetails) });

export const getMyOrders = () => apiFetch("/orders/myOrders");

export const getOneOrder = (id) => apiFetch(`/orders/${id}`);

export const cancelOrder = (id) =>
  apiFetch(`/orders/${id}/cancel`, { method: "DELETE" });

export const updateOrderStatus = (id, statusData) =>
  apiFetch(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(statusData),
  });

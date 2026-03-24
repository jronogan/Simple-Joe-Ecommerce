import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllCategories, getAllProducts } from "../api/crud";
import { Link, useSearchParams } from "react-router-dom";
import AddToCartPortal from "../subcomponents/AddToCartPortal";
import SearchBar from "../subcomponents/SearchBar";
import "./Products.css";

const Products = () => {
  const [searchParams] = useSearchParams();
  const committedSearch = searchParams.get("search") ?? "";
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products, isPending: productsPending } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { data: categories, isPending: categoriesPending } = useQuery({
    queryKey: ["allCategories"],
    queryFn: getAllCategories,
  });

  if (productsPending || categoriesPending) return <div>Loading...</div>;

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(committedSearch.toLowerCase());
    const matchesCategory = categorySearch === "" || product.category.name === categorySearch;
    return matchesName && matchesCategory;
  });

  return (
    <div className="products-page">
      <div className="products-search-section">
        <SearchBar noSection />
        <select
          className="products-category-select"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
        >
          <option value="">Category ↓</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid-section">
        {filteredProducts.length === 0 ? (
          <p className="products-empty">No products found.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/products/${product._id}`} className="product-card-link">
                  <div className="product-card-image-wrap">
                    <img src={product.images} alt={product.name} />
                  </div>
                  <div className="product-card-info">
                    <p className="product-card-name">{product.name}</p>
                    <p className="product-card-price">${product.price}</p>
                  </div>
                </Link>
                <div className="product-card-actions">
                  <button
                    className="product-card-add-btn"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <AddToCartPortal
          product={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </div>
  );
};

export default Products;

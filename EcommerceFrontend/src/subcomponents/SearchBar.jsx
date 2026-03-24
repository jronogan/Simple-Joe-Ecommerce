import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = ({ noSection = false }) => {
  const navigate = useNavigate();
  const [productSearch, setProductSearch] = useState("");

  const handleSearch = () => {
    navigate(`/products?search=${productSearch}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const wrapper = (
    <div
      className="searchbar-wrapper"
      style={noSection ? { flex: 1, maxWidth: "none" } : {}}
    >
      <input
        className="searchbar-input"
        type="text"
        placeholder="Search Products"
        value={productSearch}
        onChange={(e) => setProductSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="searchbar-btn" onClick={handleSearch}>
        Search
      </button>
    </div>
  );

  if (noSection) return wrapper;

  return <div className="searchbar-section">{wrapper}</div>;
};

export default SearchBar;

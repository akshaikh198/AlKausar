import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

function SearchBox({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useShop();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchValue = inputRef.current?.value.trim();
    setSearchTerm(searchValue || "");

    if (searchValue) {
      navigate("/shop");
    }

    setIsOpen(false);
  };

  return (
    <div className={`navbar-search ${isOpen ? "search-open" : ""}`}>

      {isOpen && (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search perfumes..."
            className="search-input"
            aria-label="Search products"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>
      )}

      <button
        type="button"
        className="search-button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close search" : "Open search"}
      >
        <i
          className={
            isOpen
              ? "bi bi-x-lg"
              : "bi bi-search"
          }
        />
      </button>

    </div>
  );
}

export default SearchBox;
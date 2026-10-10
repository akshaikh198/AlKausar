import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import { useShop } from "../context/ShopContext";
import { ShoppingBag, Heart, RotateCcw } from "lucide-react";

const categories = ["All", "Perfume", "Attar", "Deo", "Gift Sets"];

const priceFilters = [
  { label: "All prices", value: "all" },
  { label: "Under ₹1500", value: "under-1500" },
  { label: "₹1500 - ₹3000", value: "1500-3000" },
  { label: "₹3000 & above", value: "above-3000" },
];

const sizes = ["100ml", "50ml", "25ml", "6ml"];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
  { label: "Size: Small to Large", value: "size-asc" },
  { label: "Size: Large to Small", value: "size-desc" },
];

function Shop() {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useShop();
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [notesSearch, setNotesSearch] = useState("");

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("featured");
    setPriceFilter("all");
    setSizeFilter("all");
    setNotesSearch("");
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedNotesSearch = notesSearch.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.notes.some((note) => note.toLowerCase().includes(normalizedSearch)) ||
        product.category.toLowerCase().includes(normalizedSearch);

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "under-1500" && product.price < 1500) ||
        (priceFilter === "1500-3000" && product.price >= 1500 && product.price <= 3000) ||
        (priceFilter === "above-3000" && product.price > 3000);
      const matchesSize = sizeFilter === "all" || product.size === sizeFilter;
      const matchesNotes =
        !normalizedNotesSearch ||
        product.notes.some((note) => note.toLowerCase().includes(normalizedNotesSearch));

      return matchesCategory && matchesSearch && matchesPrice && matchesSize && matchesNotes;
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "size-asc":
        sorted.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
        break;
      case "size-desc":
        sorted.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
        break;
      default:
        sorted.sort((a, b) => Number(a.id) - Number(b.id));
        break;
    }

    return sorted;
  }, [notesSearch, priceFilter, searchTerm, selectedCategory, sizeFilter, sortBy]);

  return (
    <main className="page-shell">
      <section className="collection-hero">
        <div className="container py-5 text-center text-dark">
          <p className="section-kicker">Curated collection</p>
          <h1 className="display-3 fw-light mb-3">Luxury for every ritual.</h1>
          <p className="mx-auto text-secondary mb-0" style={{ maxWidth: 700 }}>
            Discover artisan fragrances, pure attars, modern deos, and signature gift sets designed to leave a memorable trail.
          </p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-4 align-items-start">
          <aside className="col-12 col-lg-3">
            <div className="shop-sidebar">
              <button
                type="button"
                className="shop-reset-button"
                onClick={resetFilters}
                aria-label="Reset all filters and sorting"
                title="Reset all filters and sorting"
              >
                <RotateCcw size={16} aria-hidden="true" />
                <span>Reset</span>
              </button>

              <div className="sidebar-block">
                <h3>Categories</h3>
                <div className="sidebar-list">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`sidebar-link ${selectedCategory === category ? "active" : ""}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-block">
                <h3>Price</h3>
                <div className="sidebar-list">
                  {priceFilters.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={`sidebar-link ${priceFilter === option.value ? "active" : ""}`}
                      onClick={() => setPriceFilter(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-block">
                <h3>Size</h3>
                <label className="visually-hidden" htmlFor="shop-size-filter">Filter by size</label>
                <select
                  id="shop-size-filter"
                  className="shop-filter-input"
                  value={sizeFilter}
                  onChange={(event) => setSizeFilter(event.target.value)}
                >
                  <option value="all">All sizes</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="sidebar-block">
                <h3>Fragrance notes</h3>
                <label className="visually-hidden" htmlFor="shop-notes-search">Search fragrance notes</label>
                <input
                  id="shop-notes-search"
                  className="shop-filter-input"
                  type="text"
                  placeholder="Search notes..."
                  value={notesSearch}
                  onChange={(event) => setNotesSearch(event.target.value)}
                />
              </div>

              <div className="sidebar-block">
                <h3>Sort by</h3>
                <div className="sidebar-list">
                  {sortOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={`sidebar-link ${sortBy === option.value ? "active" : ""}`}
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="col-12 col-lg-9">
            <div className="shop-toolbar mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <p className="mb-0 text-secondary">Showing {filteredProducts.length} products</p>
              <div className="text-secondary small text-uppercase">{selectedCategory}</div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state text-center py-5">
                <h3>{notesSearch.trim() ? "Not Found" : "No products found"}</h3>
                <p>Try another search or switch category.</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="col-12 col-md-6 col-xl-4">
                    <div className="royal-product-card" style={{ height: "250px" }}>

                      {/* IMAGE AREA */}
                      <div className="royal-product-image" style={{ height: "200px" }}>

                        <Link to={`/product/${product.id}`}>
                          <img src={product.image} alt={product.name} />
                        </Link>

                        <img
                          src={product.hoverImage || product.image}
                          alt={`${product.name} alternate view`}
                          className="product-hover-image"
                        />

                        <div className="royal-product-overlay">
                          <div className="royal-actions">
                            <button className="royal-icon-btn" aria-label="Add to wishlist">
                              <Heart size={18} strokeWidth={1.5} />
                            </button>

                            <button className="royal-icon-btn" aria-label="Add to cart">
                              <ShoppingBag size={18} strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="royal-price">
                            ₹{product.price.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      <div className="royal-product-info" style={{ height: "50px" }}>
                        <span
                          className="royal-product-category"
                          style={{
                            fontSize: "0.8rem",
                            color: "#888",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            textAlign: "start",
                            display: "block",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {product.category}
                        </span>

                        <Link
                          to={`/product/${product.id}`}
                          className="royal-product-name"
                          style={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}
                        >
                          {product.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Shop;

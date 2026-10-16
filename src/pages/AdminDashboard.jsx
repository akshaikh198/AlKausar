import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useShop } from "../context/useShop";

const sections = ["Overview", "Products", "Categories", "Orders", "Customers"];
const emptyProduct = {
  name: "", category: "Attar", type: "", size: "", price: "", stock: 0,
  notes: "", image: "", hoverImage: "", description: "", isActive: true,
};

function AdminDashboard() {
  const { session, request, logout, refreshProducts } = useShop();
  const [section, setSection] = useState("Overview");
  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = useCallback(async () => {
    setError("");
    try {
      const [summary, productList, categoryList, orderList, customerList] = await Promise.all([
        request("/api/admin/overview"),
        request("/api/admin/products"),
        request("/api/admin/categories"),
        request("/api/admin/orders"),
        request("/api/admin/users"),
      ]);
      setOverview(summary);
      setProducts(productList);
      setCategories(categoryList);
      setOrders(orderList);
      setCustomers(customerList);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [request]);

  useEffect(() => {
    if (session?.token && session.role === "Admin") Promise.resolve().then(loadDashboard);
  }, [loadDashboard, session?.role, session?.token]);

  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== "Admin") return <Navigate to="/account" replace />;

  const saveProduct = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      notes: productForm.notes.split(",").map((note) => note.trim()).filter(Boolean),
    };
    try {
      await request(editingProduct ? `/api/admin/products/${editingProduct}` : "/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setProductForm(emptyProduct);
      setEditingProduct(null);
      await loadDashboard();
      await refreshProducts();
      setNotice("Product saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product.id);
    setProductForm({
      ...product,
      price: product.price,
      notes: product.notes.join(", "),
    });
    setSection("Products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Remove ${product.name} from the storefront?`)) return;
    try {
      await request(`/api/admin/products/${product.id}`, { method: "DELETE" });
      await loadDashboard();
      await refreshProducts();
      setNotice(`${product.name} was removed or archived.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await request("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: categoryName }),
      });
      setCategoryName("");
      await loadDashboard();
      setNotice("Category added.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete the ${category.name} category?`)) return;
    setError("");
    try {
      await request(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const updateOrder = async (orderId, status) => {
    setError("");
    try {
      await request(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify(status),
      });
      await loadDashboard();
      await refreshProducts();
      setNotice("Order status updated.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const setCustomerActive = async (customer) => {
    setError("");
    try {
      await request(`/api/admin/users/${customer.id}/active`, {
        method: "PATCH",
        body: JSON.stringify(!customer.isActive),
      });
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const startNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ ...emptyProduct, category: categories[0]?.name || "Attar" });
  };

  return (
    <main className="dashboard-page admin-dashboard">
      <div className="dashboard-wrap">
        <header className="dashboard-heading">
          <div>
            <p className="section-kicker">Store administration</p>
            <h1>Admin dashboard</h1>
            <p>Manage the catalog, customer orders and store performance.</p>
          </div>
          <div className="admin-header-actions"><Link className="dashboard-secondary-button" to="/shop">View storefront</Link><button className="dashboard-secondary-button" type="button" onClick={logout}>Sign out</button></div>
        </header>

        {error && <div className="dashboard-alert error" role="alert">{error}</div>}
        {notice && <div className="dashboard-alert success" role="status">{notice}</div>}

        <div className="dashboard-layout">
          <nav className="dashboard-nav" aria-label="Administration sections">
            {sections.map((item) => (
              <button key={item} className={section === item ? "active" : ""} onClick={() => setSection(item)} type="button">
                {item}
              </button>
            ))}
          </nav>

          <section className="dashboard-content">
            {section === "Overview" && overview && (
              <>
                <div className="dashboard-stat-grid admin-stats">
                  <div className="dashboard-stat"><span>Sales this month</span><strong>₹{overview.salesThisMonth.toLocaleString("en-IN")}</strong></div>
                  <div className="dashboard-stat"><span>Orders</span><strong>{overview.totalOrders}</strong></div>
                  <div className="dashboard-stat"><span>Customers</span><strong>{overview.totalCustomers}</strong></div>
                  <div className="dashboard-stat"><span>Needs restocking</span><strong>{overview.lowStockCount}</strong></div>
                </div>
                <div className="dashboard-card">
                  <div className="dashboard-card-heading"><h2>Sales · last 6 months</h2><span className="dashboard-muted">Today: ₹{overview.salesToday.toLocaleString("en-IN")}</span></div>
                  {overview.monthlySales.length ? (
                    <div className="sales-chart" aria-label="Monthly sales chart">
                      {overview.monthlySales.map((month) => {
                        const max = Math.max(...overview.monthlySales.map((item) => item.sales), 1);
                        return <div key={month.month} className="sales-chart-column"><strong>₹{month.sales.toLocaleString("en-IN")}</strong><div className="sales-chart-track"><span style={{ height: `${Math.max(4, month.sales / max * 100)}%` }} /></div><small>{month.month}</small></div>;
                      })}
                    </div>
                  ) : <p className="dashboard-empty">Sales will appear after the first order.</p>}
                </div>
                <div className="dashboard-card">
                  <div className="dashboard-card-heading"><h2>Latest orders</h2><button className="dashboard-text-button" onClick={() => setSection("Orders")}>Manage orders</button></div>
                  {overview.recentOrders.length ? overview.recentOrders.map((order) => <div className="admin-recent-order" key={order.id}><div><strong>{order.number}</strong><span>{order.customer} · {order.itemCount} items</span></div><strong>₹{order.total.toLocaleString("en-IN")}</strong></div>) : <p className="dashboard-empty">No orders have been placed yet.</p>}
                </div>
              </>
            )}

            {section === "Products" && (
              <>
                <div className="dashboard-card">
                  <div className="dashboard-card-heading"><h2>{editingProduct ? "Edit product" : "Add a product"}</h2>{editingProduct && <button className="dashboard-text-button" onClick={startNewProduct}>Cancel edit</button>}</div>
                  <form className="dashboard-form" onSubmit={saveProduct}>
                    <div className="dashboard-form-grid">
                      <label>Product name<input required maxLength="160" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} /></label>
                      <label>Category<select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
                      <label>Type<input maxLength="80" value={productForm.type} onChange={(event) => setProductForm({ ...productForm, type: event.target.value })} /></label>
                      <label>Size<input maxLength="40" value={productForm.size} onChange={(event) => setProductForm({ ...productForm, size: event.target.value })} /></label>
                      <label>Price (₹)<input required type="number" min="0.01" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} /></label>
                      <label>Stock<input required type="number" min="0" step="1" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} /></label>
                      <label>Fragrance notes (comma separated)<input value={productForm.notes} onChange={(event) => setProductForm({ ...productForm, notes: event.target.value })} /></label>
                      <label>Image URL/path<input maxLength="500" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} /></label>
                      <label>Alternate image URL/path<input maxLength="500" value={productForm.hoverImage} onChange={(event) => setProductForm({ ...productForm, hoverImage: event.target.value })} /></label>
                      <label>Description<textarea maxLength="2000" rows="2" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} /></label>
                    </div>
                    <label className="dashboard-checkbox"><input type="checkbox" checked={productForm.isActive} onChange={(event) => setProductForm({ ...productForm, isActive: event.target.checked })} /> Visible in storefront</label>
                    <button className="dashboard-primary-button" disabled={busy}>{editingProduct ? "Update product" : "Add product"}</button>
                  </form>
                </div>
                <div className="dashboard-card">
                  <h2>Catalog · {products.length} products</h2>
                  <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Storefront</th><th>Actions</th></tr></thead><tbody>
                    {products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.size} · {product.type}</small></td><td>{product.category}</td><td>₹{product.price.toLocaleString("en-IN")}</td><td><span className={product.stock <= 5 ? "low-stock" : ""}>{product.stock}</span></td><td>{product.isActive ? "Active" : "Hidden"}</td><td><div className="dashboard-actions"><button className="dashboard-text-button" onClick={() => editProduct(product)}>Edit</button><button className="dashboard-text-button danger" onClick={() => deleteProduct(product)}>Remove</button></div></td></tr>)}
                  </tbody></table></div>
                </div>
              </>
            )}

            {section === "Categories" && (
              <div className="dashboard-card">
                <h2>Product categories</h2>
                <form className="category-create-form" onSubmit={saveCategory}><label className="visually-hidden" htmlFor="new-category">New category name</label><input id="new-category" required maxLength="80" placeholder="New category name" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} /><button className="dashboard-primary-button">Add category</button></form>
                <div className="category-list">{categories.map((category) => <article key={category.id}><div><strong>{category.name}</strong><span>{category.productCount} products</span></div><button className="dashboard-text-button danger" onClick={() => deleteCategory(category)}>Delete</button></article>)}</div>
              </div>
            )}

            {section === "Orders" && (
              <div className="dashboard-card">
                <h2>Orders · {orders.length}</h2>
                {orders.length ? orders.map((order) => (
                  <article className="admin-order-card" key={order.id}>
                    <div className="admin-order-heading"><div><strong>{order.number}</strong><span>{order.customer} · {order.email} · {new Date(order.createdAt).toLocaleString()}</span></div><strong>₹{order.total.toLocaleString("en-IN")}</strong></div>
                    <p className="admin-order-delivery">{order.recipient} · {order.phone}<br />{order.addressLine}, {order.city}{order.state ? `, ${order.state}` : ""}, {order.country} {order.postalCode}</p>
                    <div className="admin-order-items">{order.items.map((item) => <span key={item.id}>{item.productName} × {item.quantity} — ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</span>)}</div>
                    <label className="admin-status-select">Order status<select value={order.status} onChange={(event) => updateOrder(order.id, event.target.value)}><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></label>
                  </article>
                )) : <p className="dashboard-empty">No orders to display.</p>}
              </div>
            )}

            {section === "Customers" && (
              <div className="dashboard-card">
                <h2>Customers · {customers.filter((customer) => customer.role === "User").length}</h2>
                <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Joined</th><th>Orders</th><th>Status</th><th>Action</th></tr></thead><tbody>
                  {customers.filter((customer) => customer.role === "User").map((customer) => <tr key={customer.id}><td><strong>{customer.fullName}</strong><small>{customer.email}{customer.phone ? ` · ${customer.phone}` : ""}</small></td><td>{new Date(customer.createdAt).toLocaleDateString()}</td><td>{customer.orderCount}</td><td>{customer.isActive ? "Active" : "Disabled"}</td><td><button className={`dashboard-text-button ${customer.isActive ? "danger" : ""}`} onClick={() => setCustomerActive(customer)}>{customer.isActive ? "Disable" : "Enable"}</button></td></tr>)}
                </tbody></table></div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;

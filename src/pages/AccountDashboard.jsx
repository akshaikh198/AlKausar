import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useShop } from "../context/useShop";

const sections = ["Overview", "Profile", "Addresses", "Orders", "Wishlist"];

function AccountDashboard() {
  const { session, request, logout, toggleWishlist, products, wishlist } = useShop();
  const [section, setSection] = useState("Overview");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "Home", recipient: "", phone: "", addressLine: "", city: "",
    state: "", country: "", postalCode: "", isDefault: false,
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = useCallback(async () => {
    setError("");
    try {
      const [account, orderList, addressList] = await Promise.all([
        request("/api/account"),
        request("/api/account/orders"),
        request("/api/account/addresses"),
      ]);
      setProfile(account);
      setOrders(orderList);
      setAddresses(addressList);
      setForm((current) => ({ ...current, recipient: account.fullName, phone: account.phone || "" }));
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [request]);

  useEffect(() => {
    if (session?.token) Promise.resolve().then(loadDashboard);
  }, [loadDashboard, session?.token]);

  if (!session) return <Navigate to="/login" replace />;

  const updateProfile = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const updated = await request("/api/account", {
        method: "PUT",
        body: JSON.stringify({ fullName: profile.fullName, phone: profile.phone }),
      });
      setProfile((current) => ({ ...current, ...updated }));
      setNotice("Your profile has been updated.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await request(editingAddress ? `/api/account/addresses/${editingAddress}` : "/api/account/addresses", {
        method: editingAddress ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setEditingAddress(null);
      await loadDashboard();
      setNotice("Address saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteAddress = async (id) => {
    setError("");
    try {
      await request(`/api/account/addresses/${id}`, { method: "DELETE" });
      setAddresses((current) => current.filter((address) => address.id !== id));
      setNotice("Address removed.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const startEditAddress = (address) => {
    setEditingAddress(address.id);
    setForm({
      label: address.label, recipient: address.recipient, phone: address.phone,
      addressLine: address.addressLine, city: address.city, state: address.state,
      country: address.country, postalCode: address.postalCode, isDefault: address.isDefault,
    });
  };
  const savedProducts = products.filter((product) => wishlist.includes(product.id));

  return (
    <main className="dashboard-page">
      <div className="dashboard-wrap">
        <header className="dashboard-heading">
          <div>
            <p className="section-kicker">Your account</p>
            <h1>Welcome back, {profile?.fullName || session.fullName}</h1>
            <p>Manage your profile, delivery addresses and fragrance orders.</p>
          </div>
          <button className="dashboard-secondary-button" type="button" onClick={logout}>Sign out</button>
        </header>

        {error && <div className="dashboard-alert error" role="alert">{error}</div>}
        {notice && <div className="dashboard-alert success" role="status">{notice}</div>}

        <div className="dashboard-layout">
          <nav className="dashboard-nav" aria-label="Account sections">
            {sections.map((item) => (
              <button key={item} className={section === item ? "active" : ""} onClick={() => setSection(item)} type="button">
                {item}
              </button>
            ))}
          </nav>

          <section className="dashboard-content">
            {section === "Overview" && (
              <>
                <div className="dashboard-stat-grid">
                  <div className="dashboard-stat"><span>Total orders</span><strong>{orders.length}</strong></div>
                  <div className="dashboard-stat"><span>Saved fragrances</span><strong>{savedProducts.length}</strong></div>
                  <div className="dashboard-stat"><span>Saved addresses</span><strong>{addresses.length}</strong></div>
                </div>
                <div className="dashboard-card">
                  <div className="dashboard-card-heading"><h2>Recent orders</h2><button className="dashboard-text-button" onClick={() => setSection("Orders")}>View all</button></div>
                  {orders.length ? orders.slice(0, 3).map((order) => <OrderRow key={order.id} order={order} />) : <p className="dashboard-empty">Your orders will appear here after checkout.</p>}
                </div>
                <div className="dashboard-card dashboard-shortcuts">
                  <h2>Quick links</h2>
                  <Link to="/shop">Explore the collection <span>→</span></Link>
                  <Link to="/wishlist">View your wishlist <span>→</span></Link>
                </div>
              </>
            )}

            {section === "Profile" && profile && (
              <div className="dashboard-card">
                <h2>Personal details</h2>
                <form className="dashboard-form" onSubmit={updateProfile}>
                  <label>Full name<input required maxLength="120" value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} /></label>
                  <label>Email address<input value={profile.email} readOnly /></label>
                  <label>Phone number<input maxLength="32" value={profile.phone || ""} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label>
                  <button className="dashboard-primary-button" disabled={busy}>Save profile</button>
                </form>
              </div>
            )}

            {section === "Addresses" && (
              <>
                <div className="dashboard-card">
                  <div className="dashboard-card-heading"><h2>{editingAddress ? "Edit address" : "Add a delivery address"}</h2>{editingAddress && <button className="dashboard-text-button" onClick={() => { setEditingAddress(null); setForm({ ...form, addressLine: "", city: "", state: "", country: "", postalCode: "", isDefault: false }); }}>Cancel edit</button>}</div>
                  <form className="dashboard-form" onSubmit={saveAddress}>
                    <div className="dashboard-form-grid">
                      <label>Label<input required maxLength="60" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /></label>
                      <label>Recipient<input required maxLength="120" value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} /></label>
                      <label>Phone<input required maxLength="32" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
                      <label>Address<input required maxLength="240" value={form.addressLine} onChange={(event) => setForm({ ...form, addressLine: event.target.value })} /></label>
                      <label>City<input required maxLength="80" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label>
                      <label>State / region<input maxLength="80" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} /></label>
                      <label>Country<input required maxLength="80" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} /></label>
                      <label>Postal code<input maxLength="20" value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} /></label>
                    </div>
                    <label className="dashboard-checkbox"><input type="checkbox" checked={form.isDefault} onChange={(event) => setForm({ ...form, isDefault: event.target.checked })} /> Set as default address</label>
                    <button className="dashboard-primary-button" disabled={busy}>{editingAddress ? "Update address" : "Save address"}</button>
                  </form>
                </div>
                <div className="dashboard-card">
                  <h2>Saved addresses</h2>
                  {addresses.length ? addresses.map((address) => (
                    <article className="dashboard-address" key={address.id}>
                      <div><strong>{address.label} {address.isDefault && <span className="dashboard-pill">Default</span>}</strong><p>{address.recipient} · {address.phone}<br />{address.addressLine}, {address.city}{address.state ? `, ${address.state}` : ""}, {address.country} {address.postalCode}</p></div>
                      <div className="dashboard-actions"><button className="dashboard-text-button" onClick={() => startEditAddress(address)}>Edit</button><button className="dashboard-text-button danger" onClick={() => deleteAddress(address.id)}>Remove</button></div>
                    </article>
                  )) : <p className="dashboard-empty">No saved addresses yet.</p>}
                </div>
              </>
            )}

            {section === "Orders" && (
              <div className="dashboard-card">
                <h2>Order history</h2>
                {orders.length ? orders.map((order) => <OrderRow key={order.id} order={order} expanded />) : <div className="dashboard-empty">No orders yet. <Link to="/shop">Browse the collection</Link></div>}
              </div>
            )}

            {section === "Wishlist" && (
              <div className="dashboard-card">
                <h2>Saved fragrances</h2>
                {savedProducts.length ? (
                  <div className="dashboard-wishlist">
                    {savedProducts.map((product) => (
                      <article key={product.id}>
                        <img src={product.image} alt={product.name} />
                        <div><strong>{product.name}</strong><span>{product.category} · ₹{product.price.toLocaleString("en-IN")}</span></div>
                        <button className="dashboard-text-button danger" onClick={() => toggleWishlist(product.id)}>Remove</button>
                      </article>
                    ))}
                  </div>
                ) : <div className="dashboard-empty">Your wishlist is empty. <Link to="/shop">Find a new favourite</Link></div>}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function OrderRow({ order, expanded = false }) {
  return (
    <article className="dashboard-order">
      <div className="dashboard-order-top">
        <div><strong>{order.number}</strong><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
        <span className={`dashboard-pill status-${order.status.toLowerCase()}`}>{order.status}</span>
      </div>
      <div className="dashboard-order-bottom">
        <span>{order.items.reduce((count, item) => count + item.quantity, 0)} items · {order.paymentMethod}</span>
        <strong>₹{order.total.toLocaleString("en-IN")}</strong>
      </div>
      {expanded && <div className="dashboard-order-items">{order.items.map((item) => <span key={item.id}>{item.productName} × {item.quantity}</span>)}</div>}
    </article>
  );
}

export default AccountDashboard;

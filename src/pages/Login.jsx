import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import bannerImage from "../assets/banner/attar_banner.png";
import logoImage from "../assets/Al_Kausar_Logo.png";
import { useShop } from "../context/useShop";

function Login() {
  const { login, session } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to={session.role === "Admin" ? "/admin" : "/account"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = new FormData(event.currentTarget);
    try {
      const signedIn = await login({
        email: values.get("email"),
        password: values.get("password"),
      });
      const destination = location.state?.from === "/checkout"
        ? "/checkout"
        : signedIn.role === "Admin" ? "/admin" : "/account";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="premium-page auth-page" style={{alignItems:'start', padding: '4% 2%' }}>
      <div className="auth-shell">
        <div
                  className="auth-panel auth-visual register-visual"
                  style={{ backgroundImage: `url(${bannerImage})` }}
                >
                  {/* Intentionally left empty to keep the same visual treatment as the login page. */}
                </div>

        <div className="auth-panel auth-form-panel">


        <div className="auth-brand-lockup register-brand-lockup">
                    <img
                      src={logoImage}
                      alt="Al-Kausar Perfumes"
                      className="img-fluid"
                    />
                  </div>


          <h2>Login</h2>
          {error && <p className="dashboard-alert error" role="alert">{error}</p>}
          <form className="auth-form" onSubmit={submit}>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" placeholder="hello@AlKausar.com" required />
            </label>
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
            </label>
            <button type="submit" className="primary-button premium full-width" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-meta">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;

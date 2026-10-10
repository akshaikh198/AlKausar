import { Link } from "react-router-dom";

function Login() {
  return (
    <main className="premium-page auth-page">
      <div className="auth-shell">
        <div className="auth-panel auth-visual" style={{ backgroundImage: "url('src/assets/banner/attar_banner.png')", backgroundSize: "cover", backgroundPosition: "inherit", margin: "5%" }}>
          {/* <p className="luxury-label">Welcome back</p>
          <h1>Your fragrance lounge awaits.</h1>
          <p>
            Sign in to access your saved favorites, custom recommendations, and curated offers.
          </p> */}
        </div>

        <div className="auth-panel auth-form-panel">


          <div className="auth-brand-lockup" style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img src="src/assets/logo.png" alt="Al-mas perfumes" className="img-fluid" style={{ maxWidth: "30%", height: "auto" }} />
          </div>



          <h2>Login</h2>
          <form className="auth-form">
            <label>
              Email address
              <input type="email" placeholder="hello@almas.com" />
            </label>
            <label>
              Password
              <input type="password" placeholder="Enter your password" />
            </label>
            <button type="submit" className="primary-button premium full-width">
              Sign in
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

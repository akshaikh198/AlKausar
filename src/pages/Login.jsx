import { Link } from "react-router-dom";
import bannerImage from "../assets/banner/attar_banner.png";
import logoImage from "../assets/Al_Kausar_Logo.png";

function Login() {
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
          <form className="auth-form">
            <label>
              Email address
              <input type="email" placeholder="hello@AlKausar.com" />
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

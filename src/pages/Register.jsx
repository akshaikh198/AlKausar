import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function Register() {
  const [countries, setCountries] = useState(fallbackCountries);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("https://api.first.org/data/v1/countries")
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) return;

        const countriesData = data?.data ? Object.values(data.data) : [];
        const countryList = countriesData
          .map((country) => country?.country)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setCountries(countryList.length ? countryList : fallbackCountries);
      })
      .catch(() => {
        if (isMounted) {
          setCountries(fallbackCountries);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingCountries(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="premium-page auth-page">
      <div className="auth-shell">
        <div
          className="auth-panel auth-visual"
          style={{
            backgroundImage: "url('src/assets/banner/attar_banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "inherit",
            margin: "5%",
          }}
        >
          {/* Intentionally left empty to keep the same visual treatment as the login page. */}
        </div>

        <div className="auth-panel auth-form-panel">
          <div
            className="auth-brand-lockup"
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            <img
              src="src/assets/Al_Kausar_Logo.png"
              alt="Al-Kausar Perfumes"
              className="img-fluid"
              style={{ maxWidth: "30%", height: "auto" }}
            />
          </div>

          <h2>Create account</h2>
          <form className="auth-form">
            <div className="two-column-fields">
              <label>
                First name
                <input type="text" placeholder="Ayesha" />
              </label>
              <label>
                Last name
                <input type="text" placeholder="Khan" />
              </label>
            </div>

            <div className="two-column-fields">
              <label>
                Mobile Number
                <input type="tel" placeholder="+971 50 123 4567" />
              </label>
              <label>
                Email address
                <input type="email" placeholder="hello@almas.com" />
              </label>
            </div>

            <div className="two-column-fields">
              <label>
                Password
                <input type="password" placeholder="Create a password" />
              </label>
              <label>
                Confirm password
                <input type="password" placeholder="Re-enter your password" />
              </label>
            </div>

            <div className="two-column-fields">
              <label>
                Country
                <select defaultValue="" disabled={loadingCountries}>
                  <option value="" disabled>
                    {loadingCountries ? "Loading countries..." : "Select your country"}
                  </option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                State
                <input type="text" placeholder="Enter state" />
              </label>
            </div>

            <div className="two-column-fields">
              <label>
                City
                <input type="text" placeholder="Enter city" />
              </label>
              <label>
                Area
                <input type="text" placeholder="Enter area" />
              </label>
            </div>

            <div className="two-column-fields">
              <label>
                House No.
                <input type="text" placeholder="House / Flat no." />
              </label>
              <label>
                PIN Code
                <input type="text" placeholder="Postal code" />
              </label>
            </div>

            <label>
              Full Address
              <textarea rows="3" placeholder="House no., street, landmark, etc." />
            </label>

            <button type="submit" className="primary-button premium full-width">
              Register now
            </button>
          </form>

          <p className="auth-meta">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bannerImage from "../assets/banner/attar_banner.png";
import logoImage from "../assets/Al_Kausar_Logo.png";

const fallbackCountries = [
  "India",
  "Saudi Arabia",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

function Register() {
  const [countries, setCountries] = useState(fallbackCountries);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countryLoadError, setCountryLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("https://api.first.org/data/v1/countries")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Country list request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;

        const countriesData = data?.data ? Object.values(data.data) : [];
        const countryList = countriesData
          .map((country) => country?.country)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        if (!countryList.length) {
          throw new Error("Country list response was empty");
        }

        setCountries(countryList);
      })
      .catch(() => {
        if (isMounted) {
          setCountries(fallbackCountries);
          setCountryLoadError(
            "Couldn't load the full country list. Showing a short list instead.",
          );
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
    <main className="premium-page auth-page register-page">
      <div className="auth-shell register-shell">
        <div
          className="auth-panel auth-visual register-visual"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          {/* Intentionally left empty to keep the same visual treatment as the login page. */}
        </div>

        <div className="auth-panel auth-form-panel register-form-panel">
          <div className="auth-brand-lockup register-brand-lockup">
            <img
              src={logoImage}
              alt="Al-Kausar Perfumes"
              className="img-fluid"
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
                <span style={{fontSize:'8px', paddingLeft:'6%'}}> Enter Mobile Number With Country Code</span>
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
                {countryLoadError && <span role="status">{countryLoadError}</span>}
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

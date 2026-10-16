import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import bannerImage from "../assets/banner/attar_banner.png";
import logoImage from "../assets/Al_Kausar_Logo.png";
import { useShop } from "../context/useShop";

const fallbackCountries = [
  "India",
  "Saudi Arabia",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

function Register() {
  const { register, session } = useShop();
  const navigate = useNavigate();
  const [countries, setCountries] = useState(fallbackCountries);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countryLoadError, setCountryLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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

  if (session) return <Navigate to={session.role === "Admin" ? "/admin" : "/account"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const values = new FormData(event.currentTarget);
    const password = values.get("password");
    if (password !== values.get("confirmPassword")) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await register({
        fullName: `${values.get("firstName")} ${values.get("lastName")}`.trim(),
        email: values.get("email"),
        phone: values.get("phone"),
        password,
      });
      navigate("/account", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

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
          {error && <p className="dashboard-alert error" role="alert">{error}</p>}
          <form className="auth-form" onSubmit={submit}>
            <div className="two-column-fields">
              <label>
                First name
                <input name="firstName" type="text" maxLength="60" autoComplete="given-name" placeholder="Ayesha" required />
              </label>
              <label>
                Last name
                <input name="lastName" type="text" maxLength="60" autoComplete="family-name" placeholder="Khan" required />
              </label>
            </div>

            <div className="two-column-fields">
              <label>
                Mobile Number
                <input name="phone" type="tel" maxLength="32" autoComplete="tel" placeholder="+971 50 123 4567" />
                <span style={{fontSize:'8px', paddingLeft:'6%'}}> Enter Mobile Number With Country Code</span>
              </label>
              <label>
                Email address
                <input name="email" type="email" maxLength="254" autoComplete="email" placeholder="hello@almas.com" required />
              </label>
            </div>

            <div className="two-column-fields">
              <label>
                Password
                <input name="password" type="password" minLength="10" maxLength="72" autoComplete="new-password" placeholder="Create a password (10+ characters)" required />
              </label>
              <label>
                Confirm password
                <input name="confirmPassword" type="password" minLength="10" maxLength="72" autoComplete="new-password" placeholder="Re-enter your password" required />
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

            <button type="submit" className="primary-button premium full-width" disabled={busy}>
            {busy ? "Creating account..." : "Register now"}
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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

 const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  password: "",
  phone: "",
  role: "CANDIDATE",
});

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (
    !formData.fullName ||
    !formData.email ||
    !formData.password
  ) {
    setError("Please fill all required fields.");
    return;
  }

  try {
    setLoading(true);

    await register(formData);

    if (formData.role === "RECRUITER") {
      setSuccess(
        "Registration successful. Your recruiter account is pending verification."
      );
    } else {
      setSuccess(
        "Registration successful. You can now sign in."
      );
    }

    setTimeout(() => {
      navigate("/login");
    }, 1800);

  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>

          <span>HireAI</span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">
            SMARTER RECRUITMENT
          </p>

          <h1>
            Your next opportunity
            <br />
            starts here.
          </h1>

          <p className="hero-description">
            Discover relevant opportunities or find qualified
            candidates with intelligent AI-powered recruitment.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create your account</h2>

            <p>
              Join the intelligent recruitment platform.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <User size={18} />

               <input
                type="text"
                name="fullName"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
              </div>
            </div>

            <div className="form-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="input-wrapper">
                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Phone number</label>

              <div className="input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>I am joining as</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
              >
                <option value="CANDIDATE">
                  Candidate
                </option>

                <option value="RECRUITER">
                  Recruiter
                </option>
              </select>
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
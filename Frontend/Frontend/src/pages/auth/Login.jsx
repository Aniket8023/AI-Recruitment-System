import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(
        formData.email,
        formData.password
      );

      const role = data.role;

      if (role === "CANDIDATE") {
        navigate("/candidate/dashboard");
      } else if (role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else if (role === "COMPANY_ADMIN") {
        navigate("/recruiter/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid user role.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
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
          <p className="eyebrow">AI-POWERED RECRUITMENT</p>

          <h1>
            Find the right talent.
            <br />
            Build the right future.
          </h1>

          <p className="hero-description">
            An intelligent recruitment platform that connects
            candidates and recruiters through AI-powered matching,
            assessments and interviews.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="mobile-brand">
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>

            <span>HireAI</span>
          </div>

          <div className="auth-header">
            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your recruitment workspace.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
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

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
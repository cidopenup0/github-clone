import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext.jsx";
import { Link } from "react-router-dom";

import "./auth.css";

import logo from "../../assets/github-logo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your details and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-header">
        <img className="signin-logo" src={logo} alt="GitHub logo" />
        <h1>Sign In</h1>
      </div>

      <form className="signin-card" onSubmit={handleLogin}>
        <div className="signin-field">
          <label htmlFor="email">Email address</label>
          <input
            autoComplete="email"
            name="email"
            id="email"
            className="signin-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="signin-field">
          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            name="password"
            id="password"
            className="signin-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="signin-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="signin-footer-box">
        <p>
          New to GitHub? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext.jsx";
import { Link } from "react-router-dom";

import "./auth.css";

import logo from "../../assets/github-logo.svg";

const Signup = () => {
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/signup", {
        email: email,
        password: password,
        username: username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please check your details and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-header">
        <img className="signin-logo" src={logo} alt="GitHub logo" />
        <h1>Sign Up</h1>
      </div>

      <form className="signin-card" onSubmit={handleSignup}>
        <div className="signin-field">
          <label htmlFor="username">Username</label>
          <input
            autoComplete="username"
            name="username"
            id="username"
            className="signin-input"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

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
            autoComplete="new-password"
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="signin-footer-box">
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

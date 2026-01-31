import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    api.post("/api/login", {
      username: email,
      password: password,
    })
      .then((res) => {
        // store tokens
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);

        // notify parent
        onLogin();
      })
      .catch(() => {
        setError("Invalid email or password");
      });
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

        <button type="submit">
          Login
        </button>
      </form>

    <p>
        Don't have an account?{" "}
        <Link to="/signup" className="link">
            Signup
        </Link>
    </p>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/auth/signup", form);
      login(data.token, data.user);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-top"><ThemeSwitcher /></div>
      <form className="card auth-card" onSubmit={submit}>
        <h1>Create account</h1>
        <p className="muted">Start tracking your expenses</p>
        {err && <div className="error">{err}</div>}
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn btn-primary" type="submit">Sign up</button>
        <p className="muted center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "business" ? "/dashboard" : "/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formWrap}>
      <h2 style={formTitle}>Welcome back</h2>
      {error && <div style={errorBox}>{error}</div>}

      <label style={labelStyle}>Email</label>
      <input name="email" type="email" style={inputStyle} onChange={e => setForm({ ...form, email: e.target.value })} />

      <label style={labelStyle}>Password</label>
      <input name="password" type="password" style={inputStyle} onChange={e => setForm({ ...form, password: e.target.value })} />

      <button onClick={handleSubmit} disabled={loading} style={submitBtn}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#6b7280" }}>
        No account? <Link to="/register" style={{ color: "#111" }}>Register</Link>
      </p>
    </div>
  );
}

const formWrap = {
  maxWidth: "400px", margin: "40px auto", padding: "32px",
  border: "1px solid #e5e7eb", borderRadius: "12px", background: "#fff"
};
const formTitle = { fontSize: "22px", fontWeight: 600, marginBottom: "20px", color: "#111" };
const labelStyle = { display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "5px", color: "#374151" };
const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #e5e7eb",
  fontSize: "14px", marginBottom: "14px", boxSizing: "border-box"
};
const submitBtn = {
  width: "100%", padding: "11px", background: "#111", color: "#fff",
  border: "none", borderRadius: "8px", fontSize: "15px", cursor: "pointer", fontWeight: 500
};
const errorBox = {
  background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c",
  borderRadius: "6px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px"
};
const roleBtn = {
  flex: 1, padding: "9px", borderRadius: "6px", border: "1px solid #e5e7eb",
  background: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 500
};
const roleBtnActive = { background: "#111", color: "#fff", borderColor: "#111" };
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 32px", borderBottom: "1px solid #e5e7eb",
      background: "#fff", position: "sticky", top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ fontWeight: 600, fontSize: "18px", color: "#111", textDecoration: "none" }}>
        FreelanceLink DZ
      </Link>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Link to="/jobs" style={linkStyle}>Jobs</Link>

        {!user ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={btnStyle}>Register</Link>
          </>
        ) : (
          <>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>Hi, {user.name}</span>
            {user.role === "business" && (
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            )}
            <button onClick={handleLogout} style={btnStyle}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = { fontSize: "14px", color: "#374151", textDecoration: "none" };
const btnStyle = {
  fontSize: "14px", padding: "6px 14px", borderRadius: "6px",
  background: "#111", color: "#fff", border: "none", cursor: "pointer", textDecoration: "none"
};
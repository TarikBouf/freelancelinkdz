import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 0 40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#111", marginBottom: "12px" }}>
          Find Algerian freelancers<br />for your business
        </h1>
        <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "28px" }}>
          Web development · Graphic design · Digital marketing — local talent, local prices
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link to="/register" style={primaryBtn}>I'm a business →</Link>
          <Link to="/jobs" style={secondaryBtn}>Browse jobs</Link>
        </div>
      </div>

      {/* Categories */}
      <div style={{ marginTop: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>Browse by category</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {categories.map(cat => (
            <Link to={`/jobs?category=${cat.value}`} key={cat.value} style={categoryCard}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{cat.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>{cat.label}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{cat.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const categories = [
  { value: "webdev", label: "Web Development", icon: "💻", desc: "React, Node.js, WordPress..." },
  { value: "design", label: "Graphic Design", icon: "🎨", desc: "Logos, branding, UI/UX..." },
  { value: "marketing", label: "Digital Marketing", icon: "📣", desc: "SEO, social media, ads..." },
];

const primaryBtn = {
  padding: "12px 24px", background: "#111", color: "#fff", borderRadius: "8px",
  textDecoration: "none", fontWeight: 500, fontSize: "15px"
};
const secondaryBtn = {
  padding: "12px 24px", background: "#fff", color: "#111", borderRadius: "8px",
  textDecoration: "none", fontWeight: 500, fontSize: "15px", border: "1px solid #e5e7eb"
};
const categoryCard = {
  display: "block", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb",
  textDecoration: "none", color: "#111", background: "#fff",
  transition: "box-shadow .2s"
};
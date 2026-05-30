import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function FreelancerProfile() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/freelancers/${id}`),
      axios.get(`${API}/reviews/freelancer/${id}`)
    ]).then(([profileRes, reviewsRes]) => {
      setProfile(profileRes.data);
      setForm(profileRes.data);
      setReviews(reviewsRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API}/freelancers/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isOwner = user?.id === profile?.userId?._id;

  if (loading) return <p style={{ color: "#6b7280" }}>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "28px" }}>
        <div style={avatar}>{profile.userId?.name?.[0]?.toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px", color: "#111" }}>
            {profile.userId?.name}
          </h1>
          <div style={{ color: "#6b7280", fontSize: "14px", marginBottom: "6px" }}>
            ⭐ {profile.avgRating || "No ratings yet"} · {profile.hourlyRate?.toLocaleString()} DZD/hr
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {profile.skills?.map(s => <span key={s} style={skillTag}>{s}</span>)}
          </div>
        </div>
        {isOwner && (
          <button onClick={() => setEditing(!editing)} style={editBtn}>
            {editing ? "Cancel" : "Edit profile"}
          </button>
        )}
      </div>

      {/* Edit form */}
      {editing && (
        <div style={editCard}>
          <h3 style={{ fontWeight: 600, marginBottom: "14px" }}>Edit your profile</h3>
          <label style={labelStyle}>Bio</label>
          <textarea rows={3} style={inputStyle} value={form.bio || ""}
            onChange={e => setForm({ ...form, bio: e.target.value })} />
          <label style={labelStyle}>Skills (comma-separated)</label>
          <input style={inputStyle} value={form.skills?.join(", ") || ""}
            onChange={e => setForm({ ...form, skills: e.target.value.split(",").map(s => s.trim()) })} />
          <label style={labelStyle}>Hourly rate (DZD)</label>
          <input type="number" style={inputStyle} value={form.hourlyRate || ""}
            onChange={e => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
          <label style={labelStyle}>Portfolio URL</label>
          <input style={inputStyle} value={form.portfolioUrl || ""}
            onChange={e => setForm({ ...form, portfolioUrl: e.target.value })} />
          <button onClick={handleSave} style={submitBtn}>Save changes</button>
        </div>
      )}

      {/* Bio */}
      {!editing && (
        <>
          <div style={section}>
            <h2 style={sectionTitle}>About</h2>
            <p style={{ color: "#374151", fontSize: "15px", lineHeight: "1.7" }}>
              {profile.bio || "No bio yet."}
            </p>
            {profile.portfolioUrl && (
              <a href={profile.portfolioUrl} target="_blank" rel="noreferrer"
                style={{ color: "#3b82f6", fontSize: "14px" }}>View portfolio →</a>
            )}
          </div>

          {/* Reviews */}
          <div style={section}>
            <h2 style={sectionTitle}>Reviews ({reviews.length})</h2>
            {reviews.length === 0 && <p style={{ color: "#6b7280", fontSize: "14px" }}>No reviews yet.</p>}
            {reviews.map(r => (
              <div key={r._id} style={reviewCard}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong style={{ fontSize: "14px" }}>{r.businessId?.companyName}</strong>
                  <span style={{ color: "#f59e0b" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                <p style={{ color: "#374151", fontSize: "14px", margin: 0 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const avatar = {
  width: "60px", height: "60px", borderRadius: "50%", background: "#dbeafe",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "22px", fontWeight: 700, color: "#3b82f6", flexShrink: 0
};
const skillTag = { fontSize: "12px", padding: "3px 10px", borderRadius: "12px", background: "#f1f5f9", color: "#475569" };
const editBtn = { padding: "7px 14px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" };
const editCard = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "20px", marginBottom: "24px" };
const section = { marginBottom: "28px" };
const sectionTitle = { fontSize: "17px", fontWeight: 600, marginBottom: "12px", color: "#111" };
const reviewCard = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "14px", marginBottom: "10px" };
const labelStyle = { display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "5px", color: "#374151" };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" };
const submitBtn = { padding: "9px 18px", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontWeight: 500 };
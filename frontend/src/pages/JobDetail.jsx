import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function JobDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [job, setJob] = useState(null);
  const [proposal, setProposal] = useState({ coverLetter: "", price: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    setError("");
    try {
      await axios.post(`${API}/proposals`, {
        jobId: id,
        coverLetter: proposal.coverLetter,
        price: Number(proposal.price)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit proposal");
    }
  };

  if (loading) return <p style={{ color: "#6b7280" }}>Loading...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", alignItems: "start" }}>
      {/* Job info */}
      <div>
        <span style={tagStyle}>{categoryLabel(job.category)}</span>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "10px 0 6px", color: "#111" }}>{job.title}</h1>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
          Posted by <strong>{job.businessId?.companyName}</strong> · {job.businessId?.location}
        </p>
        <div style={{ fontSize: "15px", color: "#374151", lineHeight: "1.7", marginBottom: "24px" }}>
          {job.description}
        </div>
        <div style={budgetBox}>
          <div style={{ fontSize: "13px", color: "#6b7280" }}>Budget</div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#111" }}>{job.budget?.toLocaleString()} DZD</div>
        </div>
      </div>

      {/* Proposal panel */}
      <div style={proposalPanel}>
        {!user ? (
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            <a href="/login" style={{ color: "#111" }}>Login</a> to submit a proposal.
          </p>
        ) : user.role !== "freelancer" ? (
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Only freelancers can submit proposals.</p>
        ) : submitted ? (
          <div style={{ color: "#16a34a", fontWeight: 500 }}>✓ Proposal submitted!</div>
        ) : (
          <>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "14px" }}>Submit a proposal</h3>
            {error && <div style={errorBox}>{error}</div>}
            <label style={labelStyle}>Your price (DZD)</label>
            <input type="number" style={inputStyle} value={proposal.price}
              onChange={e => setProposal({ ...proposal, price: e.target.value })} />
            <label style={labelStyle}>Cover letter</label>
            <textarea rows={5} style={{ ...inputStyle, resize: "vertical" }} value={proposal.coverLetter}
              onChange={e => setProposal({ ...proposal, coverLetter: e.target.value })}
              placeholder="Introduce yourself and explain why you're the right person for this job..." />
            <button onClick={handleSubmit} style={submitBtn}>Send proposal</button>
          </>
        )}
      </div>
    </div>
  );
}

const categoryLabel = v => ({ webdev: "Web Dev", design: "Design", marketing: "Marketing" }[v] || v);
const tagStyle = { fontSize: "12px", padding: "4px 10px", borderRadius: "10px", background: "#eff6ff", color: "#3b82f6" };
const budgetBox = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px" };
const proposalPanel = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", position: "sticky", top: "80px" };
const labelStyle = { display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "5px", color: "#374151" };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" };
const submitBtn = { width: "100%", padding: "10px", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontWeight: 500 };
const errorBox = { background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: "6px", padding: "10px 14px", marginBottom: "12px", fontSize: "13px" };
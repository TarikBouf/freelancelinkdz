import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function BusinessDashboard() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState({});
  const [newJob, setNewJob] = useState({ title: "", description: "", category: "webdev", budget: "" });
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  const loadJobs = async () => {
    try {
      // Load jobs posted by this business — for simplicity we load all then filter by token
      const res = await axios.get(`${API}/jobs`, { headers });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProposals = async (jobId) => {
    if (proposals[jobId]) return; // already loaded
    try {
      const res = await axios.get(`${API}/proposals/job/${jobId}`, { headers });
      setProposals(prev => ({ ...prev, [jobId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostJob = async () => {
    setPosting(true);
    try {
      await axios.post(`${API}/jobs`, { ...newJob, budget: Number(newJob.budget) }, { headers });
      setNewJob({ title: "", description: "", category: "webdev", budget: "" });
      setShowForm(false);
      loadJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleProposalStatus = async (proposalId, status, jobId) => {
    try {
      await axios.put(`${API}/proposals/${proposalId}/status`, { status }, { headers });
      // Refresh proposals for this job
      const res = await axios.get(`${API}/proposals/job/${jobId}`, { headers });
      setProposals(prev => ({ ...prev, [jobId]: res.data }));
      loadJobs(); // Refresh job status too
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111" }}>Business Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
          {showForm ? "Cancel" : "+ Post a job"}
        </button>
      </div>

      {/* Post job form */}
      {showForm && (
        <div style={card}>
          <h3 style={{ fontWeight: 600, marginBottom: "14px" }}>Post a new job</h3>
          <label style={labelStyle}>Job title</label>
          <input style={inputStyle} value={newJob.title} placeholder="e.g. E-commerce website for clothing store"
            onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
          <label style={labelStyle}>Description</label>
          <textarea rows={4} style={inputStyle} value={newJob.description}
            placeholder="Describe the project, requirements, deliverables..."
            onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
          <label style={labelStyle}>Category</label>
          <select style={inputStyle} value={newJob.category}
            onChange={e => setNewJob({ ...newJob, category: e.target.value })}>
            <option value="webdev">Web Development</option>
            <option value="design">Graphic Design</option>
            <option value="marketing">Digital Marketing</option>
          </select>
          <label style={labelStyle}>Budget (DZD)</label>
          <input type="number" style={inputStyle} value={newJob.budget}
            onChange={e => setNewJob({ ...newJob, budget: e.target.value })} />
          <button onClick={handlePostJob} disabled={posting} style={primaryBtn}>
            {posting ? "Posting..." : "Post job"}
          </button>
        </div>
      )}

      {/* Jobs list */}
      {loading ? <p style={{ color: "#6b7280" }}>Loading your jobs...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {jobs.length === 0 && <p style={{ color: "#6b7280" }}>You haven't posted any jobs yet.</p>}
          {jobs.map(job => (
            <div key={job._id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={job.status === "open" ? openBadge : closedBadge}>{job.status}</span>
                  <h3 style={{ fontWeight: 600, fontSize: "16px", margin: "6px 0 2px", color: "#111" }}>{job.title}</h3>
                  <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>{job.budget?.toLocaleString()} DZD</p>
                </div>
                <button onClick={() => loadProposals(job._id)} style={secondaryBtn}>
                  View proposals
                </button>
              </div>

              {/* Proposals */}
              {proposals[job._id] && (
                <div style={{ marginTop: "14px", borderTop: "1px solid #e5e7eb", paddingTop: "14px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px", color: "#374151" }}>
                    Proposals ({proposals[job._id].length})
                  </h4>
                  {proposals[job._id].length === 0 && (
                    <p style={{ color: "#6b7280", fontSize: "13px" }}>No proposals yet.</p>
                  )}
                  {proposals[job._id].map(p => (
                    <div key={p._id} style={proposalRow}>
                      <div>
                        <strong style={{ fontSize: "14px" }}>{p.freelancerId?.userId?.name}</strong>
                        <span style={{ marginLeft: "10px", fontWeight: 600, color: "#111", fontSize: "14px" }}>
                          {p.price?.toLocaleString()} DZD
                        </span>
                        <p style={{ color: "#6b7280", fontSize: "13px", margin: "4px 0 0" }}>{p.coverLetter}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        {p.status === "pending" ? (
                          <>
                            <button onClick={() => handleProposalStatus(p._id, "accepted", job._id)}
                              style={acceptBtn}>Accept</button>
                            <button onClick={() => handleProposalStatus(p._id, "rejected", job._id)}
                              style={rejectBtn}>Reject</button>
                          </>
                        ) : (
                          <span style={p.status === "accepted" ? openBadge : closedBadge}>{p.status}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const card = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" };
const proposalRow = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f3f4f6", gap: "12px" };
const labelStyle = { display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "5px", color: "#374151" };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" };
const primaryBtn = { padding: "9px 18px", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontWeight: 500 };
const secondaryBtn = { padding: "7px 14px", background: "#fff", color: "#111", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", cursor: "pointer" };
const acceptBtn = { padding: "5px 12px", background: "#dcfce7", color: "#16a34a", border: "1px solid #86efac", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 };
const rejectBtn = { padding: "5px 12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 };
const openBadge = { fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "#dcfce7", color: "#16a34a", fontWeight: 500 };
const closedBadge = { fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "#f3f4f6", color: "#6b7280", fontWeight: 500 };
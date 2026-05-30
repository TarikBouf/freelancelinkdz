import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const url = category ? `${API}/jobs?category=${category}` : `${API}/jobs`;
        const res = await axios.get(url);
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Open Jobs</h1>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[{ label: "All", value: "" }, { label: "Web Dev", value: "webdev" },
          { label: "Design", value: "design" }, { label: "Marketing", value: "marketing" }
        ].map(f => (
          <button key={f.value} onClick={() => setSearchParams(f.value ? { category: f.value } : {})}
            style={{
              padding: "6px 14px", borderRadius: "20px", border: "1px solid #e5e7eb",
              background: category === f.value ? "#111" : "#fff",
              color: category === f.value ? "#fff" : "#374151",
              cursor: "pointer", fontSize: "13px"
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: "#6b7280" }}>Loading jobs...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {jobs.length === 0 && <p style={{ color: "#6b7280" }}>No jobs found.</p>}
          {jobs.map(job => (
            <Link to={`/jobs/${job._id}`} key={job._id} style={jobCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "16px", color: "#111", marginBottom: "4px" }}>{job.title}</div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                    {job.businessId?.companyName} · {job.businessId?.location}
                  </div>
                  <span style={tagStyle}>{categoryLabel(job.category)}</span>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "15px", color: "#111" }}>
                    {job.budget?.toLocaleString()} DZD
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const categoryLabel = v => ({ webdev: "Web Dev", design: "Design", marketing: "Marketing" }[v] || v);
const jobCard = {
  display: "block", padding: "18px 20px", borderRadius: "10px", border: "1px solid #e5e7eb",
  background: "#fff", textDecoration: "none", transition: "box-shadow .2s"
};
const tagStyle = {
  fontSize: "11px", padding: "3px 8px", borderRadius: "10px",
  background: "#eff6ff", color: "#3b82f6", display: "inline-block"
};
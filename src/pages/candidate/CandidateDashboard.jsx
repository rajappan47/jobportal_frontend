import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  FiBriefcase, FiCheckCircle, FiXCircle, FiSearch, 
  FiMapPin, FiClock, FiChevronRight, FiBell 
} from "react-icons/fi"; 
import "./CandidateDashboard.css";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsRes, appRes] = await Promise.all([
          axios.get("/jobs/list/"),
          axios.get("/applications/list/")
        ]);
        setJobs(jobsRes.data || []);
        setApplications(appRes.data || []);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    { label: "Applied", count: applications.length, icon: <FiBriefcase />, color: "#6366f1" },
    { label: "Shortlisted", count: applications.filter(a => a.status === "shortlisted").length, icon: <FiCheckCircle />, color: "#10b981" },
    { label: "Rejected", count: applications.filter(a => a.status === "rejected").length, icon: <FiXCircle />, color: "#ef4444" },
  ];

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">J</div>
          <span>JobPortal</span>
        </div>
        <nav className="nav-menu">
          <button className="active">Dashboard</button>
          <button onClick={() => navigate("/candidate/jobs")}>Browse Jobs</button>
          <button onClick={() => navigate("/candidate/applications")}>My Applications</button>
          <button onClick={() => navigate("/candidate/profile")}>Profile</button>
        </nav>
        <div className="sidebar-footer">© 2026 CareerHub</div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-box">
            <FiSearch />
            <input type="text" placeholder="Search jobs..." />
          </div>
          <div className="user-nav">
            <FiBell />
            <div className="user-profile-sm">
              <span>{user?.name || "User"}</span>
              <div className="avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            </div>
          </div>
        </header>

        <section className="welcome-hero">
          <h1>Welcome back, {user?.name?.split(' ')[0] || "Candidate"}!</h1>
          <p>We found {jobs.length} new opportunities for you.</p>
        </section>

        {/* STATS */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.count}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RECOMMENDED JOBS */}
        <div className="section-header">
          <h3>Recommended Jobs</h3>
          <button className="btn-text" onClick={() => navigate("/candidate/jobs")}>See all</button>
        </div>

        <div className="jobs-list">
          {jobs.length > 0 ? (
            jobs.slice(0, 5).map(job => (
              <div key={job.id} className="job-row" onClick={() => navigate(`/candidate/job/${job.id}`)}>
                <div className="job-brand">
                  <div className="company-logo-placeholder">
                    {/* Safe access to the new display name */}
                    {job.display_company_name ? job.display_company_name.charAt(0).toUpperCase() : "J"}
                  </div>
                  <div className="job-title-info">
                    <h4>{job.title}</h4>
                    <p>{job.display_company_name || "Company Name Unavailable"}</p>
                  </div>
                </div>
                
                <div className="job-meta">
                  <span><FiMapPin /> {job.location || "Remote"}</span>
                  <span className="badge-type">{job.job_type || "Full-Time"}</span>
                </div>

                <div className="job-action">
                  <span className="posted-date"><FiClock /> {new Date(job.created_at).toLocaleDateString()}</span>
                  <FiChevronRight />
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No jobs available at the moment.</div>
          )}
        </div>
      </main>
    </div>
  );
}
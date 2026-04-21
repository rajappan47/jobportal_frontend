import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  FiBriefcase, FiCheckCircle, FiXCircle, FiSearch, 
  FiMapPin, FiClock, FiChevronRight, FiBell, FiLogOut 
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
          axios.get("/jobs/list/").catch(() => ({ data: [] })),
          axios.get("/applications/list/").catch(() => ({ data: [] }))
        ]);

        const fetchedJobs = jobsRes.data || [];
        const fetchedApps = appRes.data || [];

        // Sorting Logic: Not Applied first, then by Date
        const sortedJobs = [...fetchedJobs].sort((a, b) => {
          const isAApplied = fetchedApps.some(app => app.job === a.id || app.job_id === a.id);
          const isBApplied = fetchedApps.some(app => app.job === b.id || app.job_id === b.id);
          if (isAApplied === isBApplied) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          return isAApplied ? 1 : -1;
        });

        setJobs(sortedJobs);
        setApplications(fetchedApps);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getJobStatus = (jobId) => {
    const app = applications.find(a => a.job === jobId || a.job_id === jobId);
    return app ? app.status?.toLowerCase() : null;
  };

  const stats = [
    { label: "Applied", count: applications.length, icon: <FiBriefcase />, color: "#6366f1" },
    { label: "Shortlisted", count: applications.filter(a => a.status === "shortlisted" || a.status === "selected").length, icon: <FiCheckCircle />, color: "#10b981" },
    { label: "Rejected", count: applications.filter(a => a.status === "rejected").length, icon: <FiXCircle />, color: "#ef4444" },
  ];

  if (loading) return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Building your professional workspace...</p>
    </div>
  );

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
          
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </nav>
        <div className="sidebar-footer">© 2026 CareerHub</div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for opportunities..." 
              className="main-search-input"
            />
          </div>
          <div className="header-actions">
            <div className="notification-wrapper">
              <FiBell />
              <span className="notif-dot"></span>
            </div>
            <div className="user-profile-header">
              <div className="user-info-text">
                <span className="user-name">{user?.name || "nithya"}</span>
                <span className="user-role">Candidate</span>
              </div>
              <div className="avatar-header">{user?.name?.charAt(0).toUpperCase() || "N"}</div>
            </div>
          </div>
        </header>

        <section className="welcome-hero">
          <h1>Welcome back, {user?.name?.split(' ')[0] || "nithya"}!</h1>
          <p>You have {jobs.filter(j => !getJobStatus(j.id)).length} new job matches today.</p>
        </section>

        {/* STATS */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}10` }}>{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.count}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION HEADER */}
        <div className="section-header">
          <h3>Recommended Jobs</h3>
          <button className="see-all-btn" onClick={() => navigate("/candidate/jobs")}>
            See All <FiChevronRight />
          </button>
        </div>

        {/* JOB CARDS */}
        <div className="jobs-list">
          {jobs.length > 0 ? (
            jobs.slice(0, 6).map(job => {
              const status = getJobStatus(job.id);
              return (
                <div 
                  key={job.id} 
                  className={`job-row ${status ? `status-border-${status}` : "new-job-border"}`}
                  onClick={() => navigate(`/candidate/job/${job.id}`)}
                >
                  <div className="job-row-left">
                    <div className="company-logo-box">
                      {job.company_name ? job.company_name.charAt(0).toUpperCase() : "J"}
                    </div>
                    <div className="job-main-info">
                      <h4>{job.title}</h4>
                      <p className="company-name">{job.company_name || "Enterprise Ltd"}</p>
                    </div>
                  </div>
                  
                  <div className="job-row-center">
                    <div className="meta-pill">
                      <FiMapPin /> <span>{job.location || "Remote"}</span>
                    </div>
                    <div className="meta-pill type-badge">
                      <span>{job.job_type || "Full-Time"}</span>
                    </div>
                  </div>

                  <div className="job-row-right">
                    <div className="status-container">
                      {status ? (
                        <span className={`status-pill pill-${status}`}>{status}</span>
                      ) : (
                        <span className="status-pill pill-new">New Match</span>
                      )}
                    </div>
                    <div className="time-info">
                      <FiClock /> <span>{job.created_at ? new Date(job.created_at).toLocaleDateString() : "Today"}</span>
                    </div>
                    <FiChevronRight className="chevron-icon" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">No jobs found matching your profile.</div>
          )}
        </div>
      </main>
    </div>
  );
}
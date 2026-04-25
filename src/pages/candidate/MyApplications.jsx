import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { 
  FiMapPin, FiCalendar, FiChevronRight, FiFilter, 
  FiBriefcase, FiCheckCircle, FiXCircle, FiHome, FiUser, FiLogOut 
} from "react-icons/fi";
import "./MyApplications.css";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/applications/my-applications/");
        
        // SORTING: Newest applications appear at the top
        const sortedData = res.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setApplications(sortedData);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // CORRECTED FILTER LOGIC
  const filteredApps = applications.filter(app => {
    const status = app.status?.toLowerCase();
    
    // If filter is "all" OR "applied", show everything
    if (filter === "all" || filter === "applied") return true;
    
    // Otherwise, show specific status
    return status === filter.toLowerCase();
  });

  if (loading) return (
    <div className="modern-loader">
      <div className="modern-spinner"></div>
    </div>
  );

  return (
    <div className="professional-layout-wrapper">
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <div className="logo-square">J</div>
          <span>JobPortal</span>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/candidate/CandidateDashboard")}>
            <FiHome /> Dashboard
          </button>
          <button onClick={() => navigate("/candidate/jobs")}>
            <FiBriefcase /> Browse Jobs
          </button>
          <button className="active">
            <FiCheckCircle /> My Applications
          </button>
          <button onClick={() => navigate("/candidate/profile")}>
            <FiUser /> Profile
          </button>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>

      <main className="app-main-content">
        <div className="content-container">
          <header className="page-header-flex">
            <div className="header-title">
              <h1>My Applications</h1>
              <p>Viewing <strong>{filteredApps.length}</strong> applications</p>
            </div>
            <div className="filter-wrapper">
              <FiFilter className="filter-icon" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Applications</option>
                <option value="applied">Applied (Show All)</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Not Selected</option>
              </select>
            </div>
          </header>

          <div className="stats-strip">
            <div className="stat-item">
              <span className="stat-val">{applications.length}</span>
              <span className="stat-lbl">Total</span>
            </div>
            <div className="stat-item success">
              <span className="stat-val">
                {applications.filter(a => a.status?.toLowerCase() === 'shortlisted').length}
              </span>
              <span className="stat-lbl">Shortlisted</span>
            </div>
            <div className="stat-item danger">
              <span className="stat-val">
                {applications.filter(a => a.status?.toLowerCase() === 'rejected').length}
              </span>
              <span className="stat-lbl">Not Selected</span>
            </div>
          </div>

          <div className="modern-card-stack">
            {filteredApps.map((app) => (
              <div 
                key={app.id} 
                className="modern-job-card" 
                onClick={() => navigate(`/candidate/job/${app.job}`)}
              >
                <div className="card-left">
                  <div className="company-avatar">
                    {app.company_name?.charAt(0).toUpperCase() || "J"}
                  </div>
                </div>

                <div className="card-center">
                  <h3>{app.job_title}</h3>
                  <p className="co-name">{app.company_name}</p>
                  <div className="meta-tags">
                    <span><FiMapPin /> {app.location || "Remote"}</span>
                    <span><FiCalendar /> {new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="card-right">
                  <span className={`status-tag ${app.status?.toLowerCase()}`}>
                    {app.status === 'rejected' ? 'Not Selected' : app.status}
                  </span>
                  <FiChevronRight className="card-arrow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
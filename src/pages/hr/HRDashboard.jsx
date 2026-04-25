import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Building2, Briefcase, Users, 
  FileText, Plus, Bell, Search, LogOut, Settings, 
  MapPin, CheckCircle, MoreHorizontal 
} from "lucide-react";
import "./HRDashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({ jobs: 0, candidates: 0, applications: 0, hires: 0 });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [jobsRes, appRes] = await Promise.all([
          axios.get("/jobs/list/"),
          axios.get("/applications/list/")
        ]);
        setJobs(jobsRes.data);
        setApplications(appRes.data);
        setStats({
          jobs: jobsRes.data.length,
          candidates: appRes.data.length,
          applications: appRes.data.length,
          hires: appRes.data.filter(a => a.status?.toLowerCase() === "selected").length
        });
      } catch (err) { console.error("API Error:", err); } finally { setLoading(false); }
    };
    fetchDashboard();
  }, []);

  // Professional Filter: Shows only "Selected" candidates in the table
  const filteredCandidates = applications.filter(app => 
    app.status?.toLowerCase() === "selected" && 
    app.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loader">Initializing Dashboard...</div>;

  return (
    <div className="premium-dashboard">
      {/* SIDEBAR SECTION */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">a</div>
          <h2>azention</h2>
        </div>

        <nav className="side-nav">
          <ul>
            <li className="active"><LayoutDashboard size={20}/> Dashboard</li>
            <li onClick={() => navigate("/hr/jobs")}><Briefcase size={20}/> Active Jobs</li>
            <li onClick={() => navigate("/hr/applications")}><FileText size={20}/> Applications</li>
            <li onClick={() => navigate("/hr/talent-pool")}><Users size={20}/> Talent Pool</li>
          </ul>
        </nav>

        {/* PROFILE & LOGOUT SECTION */}
        <div className="sidebar-profile">
          <div className="profile-info">
            <div className="avatar-ni">{user?.name?.charAt(0)}</div>
            <div className="name-box">
              <p className="p-name">{user?.name}</p>
              <p className="p-role">HR Lead • Online</p>
            </div>
          </div>
          <button className="logout-btn" onClick={() => navigate("/login")}>
            <LogOut size={16}/> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-wrap">
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} className="s-icon"/>
            <input 
              type="text" 
              placeholder="Search hired candidates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="h-icon-btn"><Bell size={20}/></button>
            <button className="h-icon-btn"><Settings size={20}/></button>
            <button className="post-job-btn" onClick={() => navigate("/hr/create-job")}>
              <Plus size={18}/> Post New Job
            </button>
          </div>
        </header>

        <section className="welcome">
          <h1>Welcome Back, {user?.name}! 👋</h1>
          <p>You have successfully hired <strong>{stats.hires}</strong> candidates for review.</p>
        </section>

        {/* STATS CARDS GRID */}
        <div className="stats-grid">
          <div className="stat-card blue" onClick={() => navigate("/hr/jobs")}>
            <div className="s-icon-box"><Briefcase size={24}/></div>
            <div className="s-text"><span>Active Jobs</span><h3>{stats.jobs}</h3></div>
          </div>
          <div className="stat-card purple" onClick={() => navigate("/hr/talent-pool")}>
            <div className="s-icon-box"><Users size={24}/></div>
            <div className="s-text"><span>Total Talent</span><h3>{stats.candidates}</h3></div>
          </div>
          <div className="stat-card orange" onClick={() => navigate("/hr/applications")}>
            <div className="s-icon-box"><FileText size={24}/></div>
            <div className="s-text"><span>Applications</span><h3>{stats.applications}</h3></div>
          </div>
          <div className="stat-card green">
            <div className="s-icon-box"><CheckCircle size={24}/></div>
            <div className="s-text"><span>Hired</span><h3>{stats.hires}</h3></div>
          </div>
        </div>

        <div className="dash-grid">
          {/* ACTIVE POSTINGS CARD */}
          <div className="glass-card">
            <div className="card-top">
              <h3>Active Postings</h3>
              <button className="view-link" onClick={() => navigate("/hr/jobs")}>
                View All
              </button>
            </div>
            <div className="job-list">
              {jobs.slice(0, 3).map(job => (
                <div className="job-item" key={job.id}>
                  <div className="job-letter">{job.title?.charAt(0)}</div>
                  <div className="job-meta">
                    <h4>{job.title}</h4>
                    <p><MapPin size={14}/> {job.location} • {job.experience} Yrs</p>
                  </div>
                  <span className="active-tag">Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* HIRED CANDIDATES TABLE */}
          <div className="glass-card">
            <div className="card-top"><h3>Hired Candidates</h3></div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length > 0 ? filteredCandidates.map(app => (
                  <tr key={app.id}>
                    <td className="c-cell">
                      <div className="mini-av">{app.candidate_name?.charAt(0)}</div>
                      {app.candidate_name}
                    </td>
                    <td>{app.job_title}</td>
                    <td><span className="hired-tag">Selected</span></td>
                    <td><MoreHorizontal size={18} className="more-dots"/></td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="empty-state">No selected candidates found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
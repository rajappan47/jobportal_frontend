import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Building2, Briefcase, Users, 
  FileText, Plus, Bell, Search, TrendingUp, MoreHorizontal 
} from "lucide-react";
import "./HRDashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({ jobs: 0, candidates: 0, applications: 0, hires: 0 });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
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
          hires: appRes.data.filter(a => a.status === "selected").length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="loader-screen"><div className="pulse"></div></div>;

  return (
    <div className="modern-dashboard">
      {/* 🔷 SIDEBAR */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">A</div>
          <span>Azentio HR</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">Main Menu</div>
          <ul>
            <li className="active"><LayoutDashboard size={20}/> Dashboard</li>
            <li onClick={() => navigate("/hr/company-profile")}><Building2 size={20}/> Company</li>
            <li onClick={() => navigate("/hr/jobs")}><Briefcase size={20}/> Active Jobs</li>
            <li><FileText size={20}/> Applications</li>
            <li><Users size={20}/> Talent Pool</li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="avatar">{user?.name?.charAt(0)}</div>
            <div className="user-info">
              <p>{user?.name}</p>
              <small>HR Lead</small>
            </div>
          </div>
        </div>
      </aside>

      {/* 🔷 MAIN AREA */}
      <main className="app-main">
        {/* TOP BAR */}
        <header className="main-header">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search candidates, jobs..." />
          </div>
          <div className="header-actions">
            <button className="notif-btn"><Bell size={20} /><span className="dot"></span></button>
            <button className="primary-btn" onClick={() => navigate("/hr/create-job")}>
              <Plus size={18} /> Post New Job
            </button>
          </div>
        </header>

        {/* WELCOME */}
        <section className="welcome-banner">
          <h1>Good Morning, {user?.name.split(' ')[0]}! 👋</h1>
          <p>You have {stats.applications} new applications to review today.</p>
        </section>

        {/* STATS GRID */}
        <div className="stats-grid">
          {[
            { label: "Active Jobs", val: stats.jobs, icon: <Briefcase color="#6366f1"/>, bg: "#eef2ff" },
            { label: "Total Candidates", val: stats.candidates, icon: <Users color="#ec4899"/>, bg: "#fdf2f8" },
            { label: "Applications", val: stats.applications, icon: <FileText color="#f59e0b"/>, bg: "#fffbeb" },
            { label: "Hired", val: stats.hires, icon: <TrendingUp color="#10b981"/>, bg: "#ecfdf5" }
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-data">
                <p>{s.label}</p>
                <h3>{s.val}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-layout-content">
          {/* RECENT JOBS */}
          <section className="content-box">
            <div className="box-header">
              <h3>Active Postings</h3>
              <button className="text-link">View All</button>
            </div>
            <div className="job-stack">
              {jobs.slice(0, 3).map(job => (
                <div className="job-item" key={job.id}>
                  <div className="job-icon">{job.title.charAt(0)}</div>
                  <div className="job-details">
                    <h4>{job.title}</h4>
                    <p>{job.location} • {job.experience} Yrs</p>
                  </div>
                  <div className="job-status-pill">Active</div>
                </div>
              ))}
            </div>
          </section>

          {/* TABLE */}
          <section className="content-box">
            <div className="box-header">
              <h3>Recent Candidates</h3>
              <button className="text-link">Export Data</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 4).map(app => (
                    <tr key={app.id}>
                      <td className="td-user">
                        <div className="small-avatar">{app.candidate_name?.charAt(0)}</div>
                        {app.candidate_name}
                      </td>
                      <td>{app.job_title}</td>
                      <td><span className={`status-tag ${app.status}`}>{app.status}</span></td>
                      <td><MoreHorizontal size={18} cursor="pointer" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
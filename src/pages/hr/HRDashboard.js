import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./HRDashboard.css";

function Dashboard() {

  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    jobs: 0,
    candidates: 0,
    applications: 0,
    hires: 0
  });

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const jobsRes = await axios.get("/jobs/list/");
      const appRes = await axios.get("/applications/list/");

      setJobs(jobsRes.data);
      setApplications(appRes.data);

      setStats({
        jobs: jobsRes.data.length,
        candidates: appRes.data.length,
        applications: appRes.data.length,
        hires: appRes.data.filter(a => a.status === "selected").length
      });

      setLoading(false);

    } catch (err) {
      console.log("Error loading dashboard", err);
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div className="dashboard-container">

      {/* 🔷 SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">ATS Project</h2>

        <ul>
          <li className="active">Dashboard</li>
          <li onClick={() => navigate("/hr/company-profile")}>Company Profile</li>
          <li onClick={() => navigate("/hr/jobs")}>Jobs</li>
          <li>Applications</li>
          <li>Candidates</li>
        </ul>

        <div className="profile">
          <p>{user?.name}</p>
          <small>HR Manager</small>
        </div>
      </div>

      {/* 🔷 MAIN CONTENT */}
      <div className="main">

        {/* 🔷 HEADER */}
        <div className="header">
          <h2>Welcome, {user?.name}</h2>

          <button
            onClick={() => navigate("/hr/create-job")}
            className="post-btn"
          >
            + Post New Job
          </button>
        </div>

        {/* 🔷 STATS */}
        <div className="cards">
          <div className="card green">
            <h3>Open Jobs</h3>
            <p>{stats.jobs}</p>
          </div>

          <div className="card blue">
            <h3>Total Candidates</h3>
            <p>{stats.candidates}</p>
          </div>

          <div className="card orange">
            <h3>Applications</h3>
            <p>{stats.applications}</p>
          </div>

          <div className="card purple">
            <h3>Hires</h3>
            <p>{stats.hires}</p>
          </div>
        </div>

        {/* 🔷 RECENT JOBS */}
        <div className="section">
          <h3>Recent Jobs</h3>

          {jobs.length === 0 ? (
            <p>No jobs found</p>
          ) : (
            jobs.slice(0, 3).map((job) => (
              <div className="job" key={job.id}>
                <p>{job.title}</p>
                <span>{job.experience} yrs experience</span>
              </div>
            ))
          )}
        </div>

        {/* 🔷 APPLICATION TABLE */}
        <div className="section">
          <h3>Recent Applications</h3>

          {applications.length === 0 ? (
            <p>No applications found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>

              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id}>
                    <td>{app.candidate_name || "Name"}</td>
                    <td>{app.job_title || "Job"}</td>
                    <td className="status">{app.status}</td>
                    <td>{app.applied_date || "Date"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
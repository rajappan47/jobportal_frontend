import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  FiPlus, FiEdit2, FiTrash2, FiMapPin, 
  FiClock, FiCalendar, FiBriefcase, FiSearch 
} from "react-icons/fi";
import "./HRJobs.css";

function HRJobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/jobs/list/");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this posting? This action cannot be undone.")) return;
    try {
      await axios.delete(`/jobs/delete/${id}/`);
      fetchJobs();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Filter logic for search bar
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hr-jobs-wrapper">
      <header className="hr-header">
        <div className="header-left">
          <h1>Manage Job Postings</h1>
          <p>You have {jobs.length} active listings</p>
        </div>
        <button className="add-job-btn" onClick={() => navigate("/hr/create-job")}>
          <FiPlus /> Post a New Job
        </button>
      </header>

      <div className="table-controls">
        <div className="search-bar-modern">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Search by job title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="jobs-table-container">
        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <FiBriefcase size={40} />
            <p>No job postings found.</p>
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Job Title & Details</th>
                <th>Experience</th>
                <th>Deadline</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div className="job-info-cell">
                      <div className="title-box">
                        <span className="job-name">{job.title}</span>
                        <div className="job-sub">
                          <span><FiMapPin /> {job.location || "Remote"}</span>
                          <span><FiClock /> {job.job_type || "Full-Time"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="exp-badge">{job.experience} Years</span>
                  </td>
                  <td>
                    <div className="deadline-cell">
                      <FiCalendar />
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No Date"}
                    </div>
                  </td>
                  <td>
                    <span className="status-pill active">Active</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon edit" 
                        title="Edit"
                        onClick={() => navigate(`/hr/edit-job/${job.id}`)}
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        title="Delete"
                        onClick={() => handleDelete(job.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HRJobs;
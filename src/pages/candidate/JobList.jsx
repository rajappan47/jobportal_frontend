import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  FiSearch, FiMapPin, FiBriefcase, FiClock, 
  FiBookmark, FiSend, FiDollarSign 
} from "react-icons/fi";
import "./Jobs.css";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await axios.get("/jobs/list/");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobs-page-wrapper">
      {/* 🔍 SEARCH HEADER */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-group">
            <FiSearch className="search-icon" />
            <input
              placeholder="Search by job title, keywords, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="search-btn">Find Jobs</button>
        </div>
      </div>

      <div className="jobs-content">
        <div className="jobs-stats">
          <h2>Recommended for you</h2>
          <span>{filtered.length} new jobs found</span>
        </div>

        {/* 📋 JOB FEED */}
        <div className="jobs-feed">
          {filtered.length === 0 ? (
            <div className="no-results">No jobs matches your search.</div>
          ) : (
            filtered.map((job) => (
              <div 
                key={job.id} 
                className="job-feed-card"
                onClick={() => navigate(`/candidate/job/${job.id}`)}
              >
                <div className="card-top">
                  <div className="company-logo">
                    {job.company_name?.charAt(0) || "J"}
                  </div>
                  <div className="job-main-info">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="company-name">{job.company_name}</p>
                    <div className="job-metadata">
                      <span><FiMapPin /> {job.location}</span>
                      <span><FiBriefcase /> {job.experience || "0-2"} Yrs</span>
                      <span><FiDollarSign /> {job.salary || "Not disclosed"}</span>
                    </div>
                  </div>
                  <button className="save-btn" onClick={(e) => {
                    e.stopPropagation();
                    alert("Job Saved!");
                  }}>
                    <FiBookmark />
                  </button>
                </div>

                <div className="job-tags">
                  <span className="tag">{job.job_type}</span>
                  {job.required_skills?.split(',').slice(0, 3).map(skill => (
                    <span key={skill} className="tag-outline">{skill.trim()}</span>
                  ))}
                </div>

                <div className="card-bottom">
                  <span className="post-date"><FiClock /> 2 days ago</span>
                  <button className="apply-now-btn">
                    Apply Now <FiSend />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
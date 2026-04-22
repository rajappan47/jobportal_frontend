import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  FiSearch, FiMapPin, FiBriefcase, FiClock, 
  FiBookmark, FiSend, FiDollarSign, FiCheckCircle,
  FiChevronLeft, FiChevronRight, FiXCircle 
} from "react-icons/fi";
import "./Jobs.css";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Set to 2 so you can see pagination with your 3 jobs
  const jobsPerPage = 2; 
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, appRes] = await Promise.all([
        axios.get("/jobs/list/"),
        axios.get("/applications/list/").catch(() => ({ data: [] }))
      ]);
      setJobs(jobsRes.data || []);
      setApplications(appRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const getApplicationData = (jobId) => {
    return applications.find(app => app.job === jobId || app.job_id === jobId);
  };

  // Improved Filter Logic
  const filteredJobs = jobs.filter(j => {
    const searchTerm = search.toLowerCase().trim();
    return (
      j.title?.toLowerCase().includes(searchTerm) ||
      j.company_name?.toLowerCase().includes(searchTerm) ||
      j.location?.toLowerCase().includes(searchTerm)
    );
  });

  // Sort: Recent first
  const sortedJobs = [...filteredJobs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Pagination Calculation
  const totalJobs = sortedJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (num) => {
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="jobs-page-wrapper">
      <header className="search-section">
        <div className="search-container">
          <div className="search-input-group">
            <FiSearch className="search-icon" />
            <input
              placeholder="Search by title, company or location..."
              value={search}
              onChange={(e) => { 
                setSearch(e.target.value); 
                setCurrentPage(1); // Reset to page 1 when searching
              }}
            />
          </div>
          {/* Manual trigger button */}
          <button className="search-btn" onClick={() => setCurrentPage(1)}>
            Find Jobs
          </button>
        </div>
      </header>

      <main className="jobs-content">
        <div className="jobs-stats">
          <h2>Recommended for you</h2>
          <span>
            Showing {totalJobs > 0 ? indexOfFirstJob + 1 : 0} - {Math.min(indexOfLastJob, totalJobs)} of {totalJobs} jobs
          </span>
        </div>

        <div className="jobs-feed">
          {currentJobs.length === 0 ? (
            <div className="no-results">No jobs match "{search}"</div>
          ) : (
            currentJobs.map((job) => {
              const appData = getApplicationData(job.id);
              const status = appData?.status?.toLowerCase();
              
              return (
                <div 
                  key={job.id} 
                  className={`job-card-modern ${status ? `status-border-${status}` : ""}`}
                  onClick={() => navigate(`/candidate/job/${job.id}`)}
                >
                  <div className="job-card-body">
                    <div className="logo-section">
                      <div className="company-logo-v2">
                        {job.company_name?.charAt(0).toUpperCase() || "J"}
                      </div>
                    </div>

                    <div className="info-section">
                      <div className="title-row">
                        <h3 className="job-title-v2">{job.title}</h3>
                        <button className="save-icon-btn" onClick={(e) => e.stopPropagation()}>
                          <FiBookmark />
                        </button>
                      </div>
                      <p className="company-name-v2">{job.company_name}</p>
                      
                      <div className="metadata-grid">
                        <span><FiMapPin /> {job.location || "Remote"}</span>
                        <span><FiBriefcase /> {job.experience || "0-1"} Yrs</span>
                        <span><FiDollarSign /> {job.salary || "Not disclosed"}</span>
                      </div>

                      <div className="tags-row">
                        <span className="type-tag">{job.job_type || "Full-Time"}</span>
                        {job.required_skills?.split(',').slice(0, 2).map(skill => (
                          <span key={skill} className="skill-tag">{skill.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="job-card-footer">
                    <div className="post-info">
                      <FiClock /> Posted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="action-area">
                      {status ? (
                        <div className={`status-badge-v2 badge-${status}`}>
                          {status === 'rejected' ? <FiXCircle /> : <FiCheckCircle />}
                          {status.toUpperCase()}
                        </div>
                      ) : (
                        <button className="apply-btn-v2">
                          Apply Now <FiSend />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION - Now visible if more than 1 page exists */}
        {totalPages > 1 && (
          <div className="modern-pagination">
            <button 
              className="page-nav-btn" 
              disabled={currentPage === 1} 
              onClick={() => paginate(currentPage - 1)}
            >
              <FiChevronLeft /> Previous
            </button>
            <div className="num-group">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i + 1} 
                  className={currentPage === i + 1 ? "page-num active" : "page-num"} 
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              className="page-nav-btn" 
              disabled={currentPage === totalPages} 
              onClick={() => paginate(currentPage + 1)}
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
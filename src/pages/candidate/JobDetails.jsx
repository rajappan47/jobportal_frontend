import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { 
  FiArrowLeft, FiMapPin, FiBriefcase, FiClock, 
  FiDollarSign, FiCalendar, FiSend, FiBookmark, FiShare2 
} from "react-icons/fi";
import "./JobDetail.css";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobs/detail/${id}/`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="loader">Loading job details...</div>;
  if (!job) return <div className="error">Job not found.</div>;

  return (
    <div className="job-detail-wrapper">
      <div className="detail-container">
        
        {/* BACK BUTTON */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back to Jobs
        </button>

        {/* HEADER SECTION */}
        <div className="job-header-card">
          <div className="header-main">
            <div className="company-logo-large">
              {job.company_name?.charAt(0)}
            </div>
            <div className="title-area">
              <h1>{job.title}</h1>
              <p className="company-link">{job.company_name}</p>
              <div className="meta-row">
                <span><FiMapPin /> {job.location}</span>
                <span><FiClock /> {job.job_type}</span>
                <span><FiBriefcase /> {job.experience} Yrs Exp</span>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="apply-btn-main">
              Apply Now <FiSend />
            </button>
            <button className="icon-btn-outline"><FiBookmark /></button>
            <button className="icon-btn-outline"><FiShare2 /></button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="detail-grid">
          <div className="main-content">
            
            <section className="detail-section">
              <h3>Job Description</h3>
              <p className="description-text">{job.description}</p>
            </section>

            <section className="detail-section">
              <h3>Key Skills</h3>
              <div className="skills-tags">
                {job.required_skills?.split(',').map(skill => (
                  <span key={skill} className="skill-pill">{skill.trim()}</span>
                ))}
              </div>
            </section>

          </div>

          <div className="side-content">
            <div className="info-card">
              <h4>Job Overview</h4>
              <div className="info-item">
                <FiCalendar />
                <div>
                  <p className="label">Posted on</p>
                  <p className="value">2 days ago</p>
                </div>
              </div>
              <div className="info-item">
                <FiDollarSign />
                <div>
                  <p className="label">Salary</p>
                  <p className="value">{job.salary || "Not Disclosed"}</p>
                </div>
              </div>
              <div className="info-item">
                <FiCalendar />
                <div>
                  <p className="label">Deadline</p>
                  <p className="value">{job.deadline || "Open"}</p>
                </div>
              </div>
            </div>

            <div className="company-card">
              <h4>About Company</h4>
              <p>Join our growing team at {job.company_name}. We value innovation and creativity.</p>
              <button className="view-co-btn">View Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
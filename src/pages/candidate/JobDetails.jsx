import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { 
  FiArrowLeft, FiMapPin, FiBriefcase, FiClock, 
  FiDollarSign, FiCalendar, FiSend, FiBookmark, FiShare2, FiExternalLink ,FiAward
} from "react-icons/fi";
import "./JobDetail.css";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We fetch the main job detail
        const jobRes = await axios.get(`/jobs/detail/${id}/`);
        const jobDetails = jobRes.data;

        // NEW: Check if the backend gave us the related company data.
        // If not, we fall back to placeholders to prevent crashes.
        setJobData({
          ...jobDetails,
          company_details: jobDetails.company_details || {
            name: jobDetails.company_name || "Unknown Company",
            industry: "Technology",
            website: "https://example.com",
            logo_initial: (jobDetails.company_name || "J").charAt(0).toUpperCase(),
            other_jobs: [] // We add an empty list for now
          }
        });

      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="loader-overlay">
      <div className="spinner-modern"></div>
      <p>Consulting with the recruiters...</p>
    </div>
  );
  if (!jobData) return <div className="error-state">We couldn't find that job. It might have been filled!</div>;

  return (
    <div className="job-detail-page">
      <div className="main-content-area">
        <header className="page-header">
          <button className="back-btn-pill" onClick={() => navigate("/candidate/jobs")}>
            <FiArrowLeft /> Back to Job List
          </button>
        </header>

        {/* --- PROFESSIONAL LOGO & HEADER CARD --- */}
        <div className="job-hero-card">
          <div className="hero-primary">
            <div className="hero-logo-box">
              {jobData.company_details.logo_initial}
            </div>
            <div className="hero-titles">
              <h1>{jobData.title}</h1>
              <div className="hero-company-meta">
                <span className="co-name">{jobData.company_details.name}</span>
                <span className="co-industry">{jobData.company_details.industry}</span>
              </div>
              <div className="hero-quick-meta">
                <span><FiMapPin /> {jobData.location}</span>
                <span className="badge-type-pill">{jobData.job_type}</span>
                <span className="badge-exp-pill"><FiAward /> {jobData.experience} Years Exp</span>
              </div>
            </div>
          </div>
          
          <div className="hero-actions-panel">
            <button className="apply-btn-hero">
              Apply Now <FiSend />
            </button>
            <div className="action-row">
              <button className="icon-btn-circle" title="Save Job"><FiBookmark /></button>
              <button className="icon-btn-circle" title="Share Job"><FiShare2 /></button>
            </div>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="details-grid-layout">
          <div className="content-column">
            <section className="detail-card">
              <h3>Job Description</h3>
              <p className="description-formatted">{jobData.description}</p>
            </section>

            <section className="detail-card">
              <h3>Required Key Skills</h3>
              <div className="skills-cloud">
                {jobData.required_skills?.split(',').map(skill => (
                  <span key={skill} className="skill-tag-modern">{skill.trim()}</span>
                ))}
              </div>
            </section>
          </div>

          <div className="sidebar-column">
            <div className="overview-card-modern">
              <h4>Position Overview</h4>
              <div className="ov-item">
                <FiClock />
                <div>
                  <p className="ov-label">Time Since Posting</p>
                  <p className="ov-value">2 days ago</p>
                </div>
              </div>
              <div className="ov-item">
                <FiDollarSign />
                <div>
                  <p className="ov-label">Annual Salary Range</p>
                  <p className="ov-value">{jobData.salary || "Not Disclosed"}</p>
                </div>
              </div>
              <div className="ov-item">
                <FiCalendar />
                <div>
                  <p className="ov-label">Application Deadline</p>
                  <p className="ov-value">{jobData.deadline || "Ongoing Recruitment"}</p>
                </div>
              </div>
            </div>

            <div className="company-info-card">
              <h4>About the Company</h4>
              <p>Explore opportunities with {jobData.company_details.name}. A global leader in {jobData.company_details.industry}.</p>
              
              {/* --- 🚀 View Profile Link (Fixed Issue #2) --- */}
              <button 
                className="view-profile-btn"
                // Using jobData.company is assumed to be the ID of the company
                onClick={() => navigate(`/candidate/company/${jobData.company}`)}
              >
                View Company Profile
              </button>
              
              <a href={jobData.company_details.website} target="_blank" rel="noreferrer" className="website-link">
                Visit Website <FiExternalLink />
              </a>
            </div>
          </div>
        </div>

        {/* --- 🚀 DYNAMIC Other Jobs (Fixed Issue #1) --- */}
        <div className="other-jobs-section">
          <h3>More jobs from {jobData.company_details.name}</h3>
          
          {jobData.company_details.other_jobs && jobData.company_details.other_jobs.length > 0 ? (
            <div className="other-jobs-grid">
              {jobData.company_details.other_jobs.slice(0, 3).map(otherJob => (
                <div key={otherJob.id} className="other-job-card" onClick={() => navigate(`/candidate/job/${otherJob.id}`)}>
                  <h4>{otherJob.title}</h4>
                  <p><FiMapPin /> {otherJob.location} • {otherJob.job_type}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-co-jobs">This company currently has no other active postings.</p>
          )}
        </div>

      </div>
    </div>
  );
}
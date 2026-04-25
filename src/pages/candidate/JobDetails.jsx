import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { 
  FiArrowLeft, FiMapPin, FiBriefcase, FiClock, 
  FiDollarSign, FiCalendar, FiSend, FiBookmark, FiShare2,
  FiLoader, FiCheckCircle, FiXCircle, FiAward 
} from "react-icons/fi";
import "./JobDetail.css";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          axios.get(`/jobs/detail/${id}/`),
          axios.get(`/applications/my-applications/`).catch(() => ({ data: [] }))
        ]);
        const jobDetails = jobRes.data;
        const existingApp = appRes.data.find(app => String(app.job) === String(id));
        if (existingApp) setAiResult(existingApp);

        setJobData({
          ...jobDetails,
          company_details: jobDetails.company_details || {
            name: jobDetails.company_name || "Company",
            industry: "Technology",
            logo_initial: (jobDetails.company_name || "J").charAt(0).toUpperCase(),
          }
        });
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await axios.post(`/applications/apply/${id}/`);
      const interval = setInterval(async () => {
        const res = await axios.get(`/applications/my-applications/`);
        const latestApp = res.data.find(app => String(app.job) === String(id));
        if (latestApp && latestApp.status !== 'applied') {
          setAiResult(latestApp);
          setIsApplying(false);
          clearInterval(interval);
        }
      }, 3000);
    } catch (err) {
      setIsApplying(false);
    }
  };

  if (loading) return <div className="loading-state"><div className="spinner"></div></div>;

  return (
    <div className="job-portal-container">
      <div className="content-wrapper">
        <button className="nav-back-link" onClick={() => navigate("/candidate/jobs")}>
          <FiArrowLeft /> Back to opportunities
        </button>

        {/* HERO SECTION */}
        <div className="modern-hero-card">
          <div className="hero-left">
            <div className="company-logo-large">{jobData.company_details.logo_initial}</div>
            <div className="hero-text-content">
              <h1>{jobData.title}</h1>
              <p className="company-subline">{jobData.company_details.name} • {jobData.location}</p>
              <div className="hero-tags">
                <span className="tag"><FiBriefcase /> {jobData.job_type}</span>
                <span className="tag"><FiAward /> {jobData.experience} Yrs</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <button 
              className={`primary-apply-btn ${aiResult ? 'applied' : ''}`}
              onClick={handleApply}
              disabled={isApplying || aiResult}
            >
              {isApplying ? <FiLoader className="spin" /> : aiResult ? <FiCheckCircle /> : <FiSend />}
              {isApplying ? "Processing..." : aiResult ? "Applied" : "Apply Now"}
            </button>
            <div className="utility-btns">
              <button className="icon-btn" title="Save"><FiBookmark /></button>
              <button className="icon-btn" title="Share"><FiShare2 /></button>
            </div>
          </div>
        </div>

        {/* AI FEEDBACK - IMPROVED MARGINS/PADDING */}
        {aiResult && (
          <div className={`ai-insight-card ${aiResult.status}`}>
            <div className="insight-header">
              <div className="status-badge">
                {aiResult.status === 'selected' ? <FiCheckCircle /> : <FiXCircle />}
                <span>Application {aiResult.status}</span>
              </div>
              <span className="match-score">Match Score: <strong>{aiResult.match_score}%</strong></span>
            </div>
            <div className="insight-body">
              <h4>Recruiter AI Feedback</h4>
              <div className="feedback-text-area">
                {aiResult.suggestions}
              </div>
            </div>
          </div>
        )}

        {/* MAIN DETAILS GRID */}
        <div className="job-details-grid">
          <div className="left-col">
            <section className="info-section">
              <h3>About the role</h3>
              <div className="rich-text-content">{jobData.description}</div>
            </section>
            <section className="info-section">
              <h3>Required Expertise</h3>
              <div className="skills-flex">
                {jobData.required_skills?.split(',').map(s => <span key={s} className="skill-pill">{s.trim()}</span>)}
              </div>
            </section>
          </div>

          <div className="right-col">
            <div className="sticky-sidebar">
              <div className="summary-card">
                <h3>Job Overview</h3>
                <div className="summary-item">
                  <FiClock className="item-icon" />
                  <div><label>Posted</label><span>{new Date(jobData.created_at).toLocaleDateString()}</span></div>
                </div>
                <div className="summary-item">
                  <FiDollarSign className="item-icon" />
                  <div><label>Salary</label><span>{jobData.salary || "Competitive"}</span></div>
                </div>
                <div className="summary-item">
                  <FiCalendar className="item-icon" />
                  <div><label>Deadline</label><span>{jobData.deadline || "ASAP"}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
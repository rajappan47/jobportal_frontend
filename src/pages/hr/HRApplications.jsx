import React, { useEffect, useState, useCallback } from "react";
import axios from "../../api/axios";
import {
  MapPin, Mail, Phone, Download, CheckCircle,
  Award, Briefcase, ChevronDown,
  XCircle, AlertCircle, ShieldCheck, Calendar
} from "lucide-react";
import "./HRApplications.css";

export default function HRApplications() {
  const [jobGroups, setJobGroups] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");

  // Filter logic: Only show candidates who are in "shortlisted" or "interview" stage
  const getActiveCandidates = useCallback((job) => {
    return job?.candidates?.filter(c => 
      c.status.toLowerCase() === 'shortlisted' || 
      c.status.toLowerCase() === 'interview'
    ) || [];
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("/applications/shortlisted/");
      setJobGroups(res.data);
      
      if (res.data.length > 0) {
        // Find the currently active job or default to the first one
        const currentJob = activeJob 
          ? res.data.find(j => j.job_id === activeJob.job_id) 
          : res.data[0];
        
        setActiveJob(currentJob || res.data[0]);

        // Filter out Hired/Rejected candidates from the active list
        const activeCandidates = getActiveCandidates(currentJob || res.data[0]);
        
        // Keep the currently selected candidate if they are still active, otherwise pick the first active one
        const updatedSelected = activeCandidates.find(c => c.id === selectedApp?.id) || activeCandidates[0];
        setSelectedApp(updatedSelected || null);
      }
    } catch (err) {
      console.error("Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [activeJob, selectedApp?.id, getActiveCandidates]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (appId, newStatus, extraData = {}) => {
    // Confirmation prompts
    const confirmMsg = newStatus === 'rejected' 
      ? "Are you sure you want to reject this candidate?" 
      : newStatus === 'hired' 
      ? "Confirm Selection: Move this candidate to the Hired Talent Pool?" 
      : null;

    if (confirmMsg && !window.confirm(confirmMsg)) return;

    try {
      const payload = { status: newStatus, ...extraData };
      await axios.post(`/applications/update-status/${appId}/`, payload);
      
      alert(`Success! Status updated to ${newStatus}.`);
      setShowScheduleModal(false);
      setInterviewDate("");
      
      // Refreshing will remove the candidate from this view if they are now 'hired' or 'rejected'
      fetchData(); 
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Status update failed.";
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!interviewDate) return alert("Please select a date and time.");
    updateStatus(selectedApp.id, 'interview', { interview_date: interviewDate });
  };

  if (loading) return <div className="modern-loader">Loading Talent Pipeline...</div>;

  const sidebarCandidates = getActiveCandidates(activeJob);

  return (
    <div className="portal-container">
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="schedule-modal">
            <div className="modal-header">
              <Calendar size={24} className="icon-blue" />
              <h3>Schedule Interview</h3>
              <button className="close-btn" onClick={() => setShowScheduleModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit}>
              <p className="modal-desc">
                Set a time for <strong>{selectedApp?.candidate_name}</strong>.
                An invitation email will be sent automatically.
              </p>
              <div className="input-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  className="modern-input"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm & Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="portal-top-header">
        <div className="job-selector-wrapper">
          <Briefcase className="icon-blue" size={20} />
          <select value={activeJob?.job_id} onChange={(e) => {
            const job = jobGroups.find(g => g.job_id === parseInt(e.target.value));
            setActiveJob(job);
            const activeOnes = getActiveCandidates(job);
            setSelectedApp(activeOnes[0] || null);
          }}>
            {jobGroups.map(group => (
              <option key={group.job_id} value={group.job_id}>{group.job_title}</option>
            ))}
          </select>
          <ChevronDown size={16} className="dropdown-arrow" />
        </div>
        <p className="header-hint">
            <strong>{sidebarCandidates.length}</strong> Active Pipeline Candidates
        </p>
      </header>

      <div className="portal-content-split">
        <aside className="talent-sidebar">
          <div className="sidebar-header">Shortlisted / Interviewing</div>
          <div className="scroll-list">
            {sidebarCandidates.length > 0 ? sidebarCandidates.map(app => (
              <div
                key={app.id}
                className={`candidate-mini-card ${selectedApp?.id === app.id ? "active-selection" : ""}`}
                onClick={() => setSelectedApp(app)}
              >
                <div className="mini-avatar">{app.candidate_name?.charAt(0)}</div>
                <div className="mini-info">
                  <h4>{app.candidate_name}</h4>
                  <div className="status-row">
                    <span className="match-badge">{app.match_score}% Match</span>
                    <span className={`status-pill ${app.status}`}>{app.status}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-sidebar">No active candidates.</div>
            )}
          </div>
        </aside>

        <main className="profile-detail-pane">
          {selectedApp ? (
            <div className="profile-view-scroll">
              <div className="profile-top-banner">
                <div className="profile-header-main">
                  <div className="profile-main-avatar">{selectedApp.candidate_name?.charAt(0)}</div>
                  <div className="profile-identity">
                    <h2>{selectedApp.candidate_name} <CheckCircle size={20} className="verified-icon" /></h2>
                    <p className="profile-subtitle">
                      Status: <span className={`status-text-${selectedApp?.status}`}>
                        {selectedApp?.status?.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div className="hero-actions">
                    <button className="btn-reject" onClick={() => updateStatus(selectedApp.id, 'rejected')}>
                      <XCircle size={18}/> Reject
                    </button>
                    
                    <button className="btn-primary" onClick={() => setShowScheduleModal(true)}>
                      <Calendar size={18}/> {selectedApp.status === 'interview' ? 'Reschedule' : 'Invite to Interview'}
                    </button>

                    <button
                      className={`btn-hire-final ${selectedApp?.status !== 'interview' ? 'btn-disabled' : ''}`}
                      disabled={selectedApp?.status !== 'interview'}
                      onClick={() => updateStatus(selectedApp.id, 'hired')}
                    >
                      <ShieldCheck size={18}/> Hire Candidate
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile-sections-grid">
                <section className="profile-glass-card">
                  <h3><Award size={18}/> AI Matching Analysis</h3>
                  {selectedApp.suggestions?.includes("503") ? (
                    <div className="ai-error-box">
                      <AlertCircle size={20} />
                      <p>AI Insights are currently being generated.</p>
                    </div>
                  ) : (
                    <div className="ai-feedback-text">{selectedApp.suggestions || "No specific feedback available."}</div>
                  )}
                </section>

                <div className="profile-row-grid">
                  <section className="profile-glass-card">
                    <div className="card-header-flex">
                      <h3>Contact Details</h3>
                    </div>
                    <div className="contact-modern-list">
                      <div className="contact-row">
                        <div className="icon-wrap"><Mail size={16}/></div>
                        <div><label>Email</label><p>{selectedApp.email}</p></div>
                      </div>
                      <div className="contact-row">
                        <div className="icon-wrap"><Phone size={16}/></div>
                        <div><label>Phone</label><p>{selectedApp.phone}</p></div>
                      </div>
                    </div>
                  </section>

                  <section className="profile-glass-card">
                    <h3>Resume</h3>
                    <div className="resume-download-box">
                      <div className="pdf-tag">PDF</div>
                      <div className="file-info"><strong>Review_Resume.pdf</strong></div>
                      {selectedApp.resume_url && (
                        <a href={selectedApp.resume_url} target="_blank" rel="noreferrer" className="dl-icon">
                          <Download size={20} />
                        </a>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-selection-state">
              <CheckCircle size={50} color="#10b981" />
              <h3>Pipeline Clear!</h3>
              <p>No active candidates currently in the pipeline for this job.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
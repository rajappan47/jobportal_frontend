import React, { useState, useEffect, useMemo } from "react";
import axios from "../../api/axios";
import { 
  Briefcase, MapPin, Mail, Phone, Search, 
  ShieldCheck, Download, Filter, MoreHorizontal,
  ChevronRight, Users, ExternalLink
} from "lucide-react";
import "./TalentPool.css";

export default function TalentPool() {
  const [jobGroups, setJobGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobFilter, setSelectedJobFilter] = useState("all");

  useEffect(() => {
    const fetchHiredData = async () => {
      try {
        const res = await axios.get("/applications/shortlisted/");
        // res.data is expected to be: [{ job_id, job_title, candidates: [...] }]
        setJobGroups(res.data);
      } catch (err) {
        console.error("Error fetching talent pool:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHiredData();
  }, []);

  // Filter logic for multiple jobs and search terms
  const filteredData = useMemo(() => {
    return jobGroups.map(job => ({
      ...job,
      // Filter candidates within each job that are 'hired' and match search
      candidates: job.candidates.filter(c => {
        const isHired = c.status.toLowerCase() === 'hired';
        const matchesSearch = c.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             c.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJob = selectedJobFilter === "all" || job.job_id.toString() === selectedJobFilter;
        
        return isHired && matchesSearch && matchesJob;
      })
    })).filter(job => job.candidates.length > 0); // Only show jobs that have matching hired candidates
  }, [jobGroups, searchTerm, selectedJobFilter]);

  if (loading) return <div className="modern-loader-container"><div className="loader-spinner"></div><p>Syncing Talent Directory...</p></div>;

  return (
    <div className="talent-pool-wrapper">
      {/* Upper Dashboard Header */}
      <header className="pool-nav-header">
        <div className="header-left">
          <h1>Hired Talent Pool</h1>
          <p>Manage onboarding and documentation for {jobGroups.reduce((acc, j) => acc + j.candidates.filter(c => c.status === 'hired').length, 0)} employees.</p>
        </div>
        
        <div className="header-actions">
          <div className="search-box-modern">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <Filter size={18} />
            <select onChange={(e) => setSelectedJobFilter(e.target.value)}>
              <option value="all">All Job Roles</option>
              {jobGroups.map(job => (
                <option key={job.job_id} value={job.job_id}>{job.job_title}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="pool-content-grid">
        {filteredData.length > 0 ? (
          filteredData.map(job => (
            <section key={job.job_id} className="job-category-block">
              <div className="job-category-header">
                <div className="title-area">
                  <div className="job-icon-bg"><Briefcase size={20} /></div>
                  <div>
                    <h2>{job.job_title}</h2>
                    <span>{job.candidates.length} Hired Candidate(s)</span>
                  </div>
                </div>
                <button className="view-job-btn">View Job Details <ExternalLink size={14}/></button>
              </div>

              <div className="candidates-masonry">
                {job.candidates.map(candidate => (
                  <div key={candidate.id} className="modern-talent-card">
                    <div className="card-status-strip"></div>
                    
                    <div className="card-top">
                      <div className="talent-avatar">
                        {candidate.candidate_name.charAt(0)}
                      </div>
                      <div className="talent-main-info">
                        <h3>{candidate.candidate_name} <ShieldCheck size={16} className="verified-badge" /></h3>
                        <p><MapPin size={14} /> {candidate.location || "Chennai, TN"}</p>
                      </div>
                      <div className="match-score-pill">
                        {candidate.match_score}% Match
                      </div>
                    </div>

                    <div className="card-contact-info">
                      <div className="info-row">
                        <Mail size={14} /> <span>{candidate.email}</span>
                      </div>
                      <div className="info-row">
                        <Phone size={14} /> <span>{candidate.phone}</span>
                      </div>
                    </div>

                    <div className="card-actions-row">
                      <a href={candidate.resume_url} target="_blank" rel="noreferrer" className="action-btn secondary">
                        <Download size={16} /> Resume
                      </a>
                      <button className="action-btn primary">
                        Onboarding <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="empty-state-container">
            <Users size={64} />
            <h3>No Hired Candidates Found</h3>
            <p>Try adjusting your search or filters to find specific employees.</p>
          </div>
        )}
      </div>
    </div>
  );
}
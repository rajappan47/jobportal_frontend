import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, FiBriefcase, FiMapPin, FiClock, 
  FiEdit3, FiAward, FiCalendar 
} from "react-icons/fi";
import "./CreateJob.css";

function CreateJob() {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    required_skills: "",
    experience: "",
    location: "Remote",
    job_type: "Full-Time",
    deadline: ""
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("/companies/list/");
        if (res.data.length > 0) {
          setCompanyId(res.data[0].id);
          setCompanyName(res.data[0].company_name);
        }
      } catch (err) {
        console.error("Error loading company", err);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/jobs/create/", { ...form, company: companyId });
      alert("Job Posted Successfully 🚀");
      navigate("/hr/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-wrapper">
      <div className="side-accent"></div>
      
      <div className="create-job-container">
        <div className="form-header">
          <button className="back-link" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h2>Post a New Opening</h2>
          <p>You are hiring for <span className="highlight">{companyName}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="modern-job-form">
          <div className="form-grid">
            
            {/* Left Column: Role Details */}
            <div className="form-column">
              <div className="input-section">
                <label><FiEdit3 /> Job Title</label>
                <input type="text" name="title" placeholder="e.g. Senior Product Designer" onChange={handleChange} required />
              </div>

              <div className="input-section">
                <label><FiMapPin /> Work Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} required />
              </div>

              <div className="row-group">
                <div className="input-section">
                  <label><FiClock /> Job Type</label>
                  <select name="job_type" value={form.job_type} onChange={handleChange}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="input-section">
                  <label><FiAward /> Experience</label>
                  <input type="number" name="experience" placeholder="Years" onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Right Column: Skills & Deadline */}
            <div className="form-column">
              <div className="input-section">
                <label><FiCalendar /> Application Deadline</label>
                <input type="date" name="deadline" onChange={handleChange} />
              </div>

              <div className="input-section">
                <label><FiBriefcase /> Required Skills</label>
                <input type="text" name="required_skills" placeholder="React, Node.js, Figma..." onChange={handleChange} required />
              </div>

              <div className="input-section">
                <label>Job Description</label>
                <textarea name="description" placeholder="Write about the role and company culture..." rows="5" onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Publishing..." : "Publish Job Opening"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;
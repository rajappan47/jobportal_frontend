import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiSave, 
  FiEdit3, 
  FiMapPin, 
  FiClock, 
  FiAward, 
  FiCalendar, 
  FiBriefcase,
  FiLock 
} from "react-icons/fi";
import "./CreateJob.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Loading and Updating states
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobs/detail/${id}/`);
        
        setForm({
          title: res.data.title || "",
          description: res.data.description || "",
          required_skills: res.data.required_skills || "",
          experience: res.data.experience || "",
          location: res.data.location || "Remote",
          job_type: res.data.job_type || "Full-Time",
          deadline: res.data.deadline || ""
        });
      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`/jobs/update/${id}/`, form);
      alert("Job Updated Successfully ✅");
      navigate("/hr/jobs");
    } catch (err) {
      console.error(err);
      alert("Update Failed ❌");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="create-job-wrapper">
         <div className="loader">Loading job details...</div>
      </div>
    );
  }

  return (
    <div className="create-job-wrapper">
      <div className="side-accent"></div>
      
      <div className="create-job-container">
        <div className="form-header">
          <button className="back-link" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Cancel Changes
          </button>
          <h2>Edit Job Posting</h2>
          <p>Update information for <span className="highlight">{form.title}</span></p>
        </div>

        <form onSubmit={handleUpdate} className="modern-job-form">
          <div className="form-grid">
            
            {/* Left Column */}
            <div className="form-column">
              <div className="input-section disabled-field">
                <label>
                  <FiLock style={{color: '#94a3b8'}} /> Job Title (Locked)
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={form.title} 
                  readOnly // 🔥 Prevents typing
                  style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed", color: "#64748b" }}
                />
              </div>

              <div className="input-section">
                <label><FiMapPin /> Work Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  required 
                />
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
                  <input 
                    type="number" 
                    name="experience" 
                    value={form.experience} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="input-section">
                <label><FiCalendar /> Application Deadline</label>
                <input 
                  type="date" 
                  name="deadline" 
                  value={form.deadline} 
                  onChange={handleChange} 
                />
              </div>

              <div className="input-section">
                <label><FiBriefcase /> Required Skills</label>
                <input 
                  type="text" 
                  name="required_skills" 
                  value={form.required_skills} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="input-section">
                <label>Job Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  rows="5" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-btn" disabled={updating}>
              <FiSave style={{marginRight: '8px'}} />
              {updating ? "Saving Changes..." : "Update Job Opening"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJob;
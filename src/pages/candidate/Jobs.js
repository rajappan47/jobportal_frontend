import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Jobs.css";

export default function Jobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await axios.get("/jobs/list/");
      setJobs(res.data);
    } catch (err) {
      console.error("Error loading jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const formData = new FormData();
      formData.append("job", jobId);

      await axios.post("/applications/apply/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Applied successfully 🚀");
    } catch (err) {
      alert("Already applied or error");
    }
  };

  return (
    <div className="jobs-page">

      <h2 className="jobs-title">Find Your Dream Job</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <div className="jobs-grid">

          {jobs.map(job => (
            <div className="job-card" key={job.id}>

              <h3>{job.title}</h3>
              <p className="company">{job.company_name}</p>

              <p className="desc">
                {(job.description || "").substring(0, 100)}...
              </p>

              <div className="job-footer">
                <span>{job.location}</span>
                <span>{job.job_type}</span>
              </div>

              <button
                className="apply-btn"
                onClick={() => handleApply(job.id)}
              >
                Apply Now
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}
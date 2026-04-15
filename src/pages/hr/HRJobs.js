import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./HRJobs.css";

function HRJobs() {

  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/jobs/list/");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await axios.delete(`/jobs/delete/${id}/`);
      fetchJobs(); // refresh
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="jobs-container">

      {/* HEADER */}
      <div className="jobs-header">
        <h2>Your Job Postings</h2>

        <button onClick={() => navigate("/hr/create-job")}>
          + Post New Job
        </button>
      </div>

      {/* JOB CARDS */}
      <div className="job-grid">

        {jobs.length === 0 ? (
          <p>No jobs available</p>
        ) : (
          jobs.map((job) => (
            <div className="job-card" key={job.id}>

              <h3>{job.title}</h3>

              <p className="desc">{job.description}</p>

              <p className="skills">
                <b>Skills:</b> {job.required_skills}
              </p>

              <p className="exp">
                <b>Experience:</b> {job.experience} yrs
              </p>

               <p className="dead">
                <b>deadline:</b> {job.deadline}
              </p>


              <div className="actions">

                <button
                  className="edit"
                  onClick={() => navigate(`/hr/edit-job/${job.id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default HRJobs;
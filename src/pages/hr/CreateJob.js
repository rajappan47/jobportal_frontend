import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./CreateJob.css";

function CreateJob() {
  const navigate = useNavigate();

  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    required_skills: "",
    experience: ""
  });

  // 🔥 GET HR COMPANY AUTOMATICALLY
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
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/jobs/create/", {
        ...form,
        company: companyId   // 🔥 send hidden company id
      });

      alert("Job Posted Successfully 🚀");
      navigate("/hr/dashboard");

    } catch (err) {
      console.error(err);
      alert("Error posting job");
    }
  };

  return (
    <div className="job-wrapper">

      <div className="job-card">
        <h2>Create New Job</h2>

        <form onSubmit={handleSubmit}>

          {/* ✅ AUTO COMPANY DISPLAY */}
          <input
            type="text"
            value={companyName}
            disabled
          />

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Job Description"
            onChange={handleChange}
            required
          />

          {/* Skills */}
          <input
            type="text"
            name="required_skills"
            placeholder="Required Skills"
            onChange={handleChange}
            required
          />

          {/* Experience */}
          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="deadline"
            onChange={handleChange}
          />

          <button type="submit">Post Job</button>

        </form>
      </div>

    </div>
  );
}

export default CreateJob;
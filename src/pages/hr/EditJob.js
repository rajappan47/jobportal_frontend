import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateJob.css";

function EditJob() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [form, setForm] = useState({
    description: "",
    required_skills: "",
    deadline: ""
  });

  // ✅ FIXED useEffect (no warning)
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobs/detail/${id}/`);

        setJob(res.data);

        setForm({
          description: res.data.description,
          required_skills: res.data.required_skills,
          deadline: res.data.deadline || ""
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/jobs/update/${id}/`, form);

      alert("Job Updated Successfully ✅");
      navigate("/hr/jobs");

    } catch (err) {
      console.log(err);
      alert("Update Failed ❌");
    }
  };

  if (!job) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div className="job-wrapper">

      <div className="job-card">

        <h2>Edit Job</h2>

        <form onSubmit={handleUpdate}>

          {/* 🔒 NOT EDITABLE */}
          <input value={job.title} disabled />

          {/* ✅ Editable Fields */}

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job Description"
            required
          />

          <input
            name="required_skills"
            value={form.required_skills}
            onChange={handleChange}
            placeholder="Required Skills"
            required
          />

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
          />

          <button type="submit">Update Job</button>

        </form>

      </div>

    </div>
  );
}

export default EditJob;
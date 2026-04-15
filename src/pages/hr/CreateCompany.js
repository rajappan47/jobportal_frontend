import React, { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../auth/Auth.css"; // ✅ reuse same login/register style

function CreateCompany() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
    company_email: "",
    company_phone: "",
    address: "",
    district: "",
    state: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/companies/create/", form);
      navigate("/hr/dashboard");
    } catch (err) {
      setError("Failed to create company");
    }
  };

  return (
    <div className="auth-wrapper">

      {/* LEFT SIDE FORM */}
      <div className="auth-left">

        <h1>Create Company Profile</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            name="company_name"
            placeholder="Company Name"
            onChange={handleChange}
            required
          />

          <input
            name="company_email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="company_phone"
            placeholder="Phone"
            onChange={handleChange}
            required
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
          />

          <input
            name="district"
            placeholder="District"
            onChange={handleChange}
            required
          />

          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            required
          />

          <button type="submit">Create Company</button>

        </form>

      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="auth-right">
        <img src="/login-image.png" alt="company visual" />
      </div>

    </div>
  );
}

export default CreateCompany;
import React, { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "candidate",
    password: "",
    confirm_password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/register/", form);
      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
  if (err.response && err.response.data) {
    const errors = err.response.data;

    // Show first error message
    const firstError = Object.values(errors)[0][0];
    alert(firstError);
  } else {
    alert("Registration Failed");
  }
}
  };

  return (
    <div className="auth-wrapper">

      {/* LEFT SIDE */}
      <div className="auth-left">
        <h1>Create Your Account</h1>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />

          <select name="role" onChange={handleChange}>
            <option value="candidate">Candidate</option>
            <option value="hr">HR</option>
          </select>

          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} required />

          <button type="submit">Register</button>
        </form>

        <p onClick={() => navigate("/login")} className="link">
          Already have an account? Login
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <img
          src="/login-image.png"
          alt="register visual"
        />
      </div>

    </div>
  );
}

export default Register;
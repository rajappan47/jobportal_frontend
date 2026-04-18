import React, { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";


function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("/login/", form);
    const user = res.data.user;
    localStorage.setItem("token", res.data.token);   // 🔥 IMPORTANT
    localStorage.setItem("user", JSON.stringify(res.data.user));

    //localStorage.setItem("user", JSON.stringify(user));

    // 🔥 HR LOGIC
    if (user.role === "hr") {

      const companyRes = await axios.get("/companies/list/");

      // 🔍 Check if this HR already created company
      const myCompany = companyRes.data.find(
        (c) => c.created_by === user.id
      );

      if (myCompany) {
        navigate("/hr/dashboard");       // ✅ company exists
      } else {
        navigate("/hr/create-company");  // ❌ create company
      }

    } else {
      navigate("/candidate/CandidateDashboard");
    }

  } catch (err) {
    alert(err.response?.data?.error || "Login Failed");
  }
};

  return (
    <div className="auth-wrapper">
      
      {/* LEFT SIDE */}
      <div className="auth-left">
        <h1>Welcome to your ATS System</h1>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Sign In</button>
        </form>

        <p onClick={() => navigate("/register")} className="link">
          New user? Register here
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <img
          src="/login-image.png"
          alt="login visual"
        />
      </div>

    </div>
  );
}

export default Login;
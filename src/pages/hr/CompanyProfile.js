import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./CompanyProfile.css";
//import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function CompanyProfile() {

  const [company, setCompany] = useState(null);

  const navigate = useNavigate();   // ✅ ADD HERE

  

  const [form, setForm] = useState({
    company_email: "",
    company_phone: "",
    address: "",
    district: "",
    state: ""
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await axios.get("/companies/list/");
      const data = res.data[0];   // 🔥 only one company

      setCompany(data);

      setForm({
        company_email: data.company_email,
        company_phone: data.company_phone,
        address: data.address,
        district: data.district,
        state: data.state
      });

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/companies/update/${company.id}/`, form);

      alert("Company Updated Successfully ✅");
      navigate("/hr/dashboard"); 

      
    } catch (err) {
      console.log(err);
      alert("Update Failed ❌");
    }
  };

  if (!company) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div className="company-wrapper">

      <div className="company-card">
        <h2>Company Profile</h2>

        <form onSubmit={handleUpdate}>

          {/* ❌ NOT EDITABLE */}
          <input value={company.company_name} disabled />

          {/* ✅ Editable */}
          <input
            name="company_email"
            value={form.company_email}
            onChange={handleChange}
          />

          <input
            name="company_phone"
            value={form.company_phone}
            onChange={handleChange}
          />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            name="district"
            value={form.district}
            onChange={handleChange}
          />

          <input
            name="state"
            value={form.state}
            onChange={handleChange}
          />

          <button type="submit">Update Company</button>

        </form>
      </div>

    </div>
  );
}

export default CompanyProfile;
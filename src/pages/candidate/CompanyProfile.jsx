import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { 
  FiMapPin, FiGlobe, FiMail, FiPhone, 
  FiExternalLink, FiArrowLeft, FiBriefcase 
} from "react-icons/fi";
import "./CompanyProfile.css";

export default function CompanyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`/companies/detail/${id}/`);
        setCompany(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <div className="loader">Loading brand profile...</div>;

  return (
    <div className="profile-page-bg">
      <div className="profile-wrapper">
        
        {/* Navigation */}
        <button className="back-pill" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        {/* 🏢 BRAND HERO SECTION */}
        <div className="brand-card-header">
          <div className="brand-banner"></div>
          <div className="brand-main-info">
            <div className="brand-logo-square">
              {company.company_name?.charAt(0)}
            </div>
            <div className="brand-text-cluster">
              <h1>{company.company_name}</h1>
              <p className="brand-subtitle">{company.industry || "Technology & Services"}</p>
              <div className="brand-loc-meta">
                <FiMapPin /> {company.district}, {company.state}
              </div>
            </div>
            <div className="brand-actions">
              <button className="btn-primary-custom">Follow</button>
              <button className="btn-outline-custom">Visit Website <FiExternalLink /></button>
            </div>
          </div>
        </div>

        {/* 📖 CONTENT GRID */}
        <div className="brand-grid">
          <div className="brand-left-col">
            <section className="info-block">
              <h3>About the company</h3>
              <p className="about-text">
                {company.description || `Welcome to ${company.company_name}. We are a performance-oriented firm located in ${company.district}, dedicated to excellence and innovation in our sector.`}
              </p>
            </section>
          </div>

          <div className="brand-right-col">
            <section className="info-block">
              <h3>Contact Details</h3>
              <div className="contact-line">
                <FiMail /> <span>{company.company_email}</span>
              </div>
              <div className="contact-line">
                <FiPhone /> <span>{company.phone || "7867564534"}</span>
              </div>
              <div className="contact-line">
                <FiGlobe /> <span className="link-text">www.{company.company_name?.toLowerCase()}.com</span>
              </div>
            </section>

            <div className="hiring-nudge">
              <FiBriefcase />
              <p>Interested in joining us?</p>
              <button onClick={() => navigate('/candidate/jobs')}>View Openings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
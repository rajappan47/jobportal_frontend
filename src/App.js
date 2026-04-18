import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Candidate
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import JobList from "./pages/candidate/JobList";
import JobDetails from "./pages/candidate/JobDetails";
import ApplyJob from "./pages/candidate/ApplyJob";
import Profile from "./pages/candidate/Profile";

// HR
import HRDashboard from "./pages/hr/HRDashboard";
import CreateCompany from "./pages/hr/CreateCompany";
import CreateJob from "./pages/hr/CreateJob";
import CompanyProfile from "./pages/hr/CompanyProfile";
import HRJobs from "./pages/hr/HRJobs";
import EditJob from "./pages/hr/EditJob";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate */}
        <Route path="/candidate/CandidateDashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/jobs" element={<JobList />} />
        <Route path="/candidate/job/:id" element={<JobDetails />} />
        <Route path="/candidate/apply/:id" element={<ApplyJob />} />
        <Route path="/candidate/profile" element={<Profile />} />

        {/* HR */}
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/create-company" element={<CreateCompany />} />
        <Route path="/hr/jobs" element={<HRJobs />} />
        <Route path="/hr/company-profile" element={<CompanyProfile />} />
        <Route path="/hr/create-job" element={<CreateJob />} />
        <Route path="/hr/edit-job/:id" element={<EditJob />} />

        {/* 404 */}
        <Route path="*" element={<h2>Page Not Found</h2>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
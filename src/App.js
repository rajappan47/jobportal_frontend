import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// --- Candidate Pages ---
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import JobList from "./pages/candidate/JobList";
import JobDetails from "./pages/candidate/JobDetails";
import ApplyJob from "./pages/candidate/ApplyJob";
import Profile from "./pages/candidate/Profile";
// We give this a unique name: CandidateCompanyView
import CandidateCompanyView from "./pages/candidate/CompanyProfile";

// --- HR Pages ---
import HRDashboard from "./pages/hr/HRDashboard";
import CreateCompany from "./pages/hr/CreateCompany";
import CreateJob from "./pages/hr/CreateJob";
import HRJobs from "./pages/hr/HRJobs";
import EditJob from "./pages/hr/EditJob";
// We give this a unique name: HRCompanyEdit
import HRCompanyEdit from "./pages/hr/CompanyProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate Routes */}
        <Route path="/candidate/CandidateDashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/jobs" element={<JobList />} />
        <Route path="/candidate/job/:id" element={<JobDetails />} />
        <Route path="/candidate/apply/:id" element={<ApplyJob />} />
        <Route path="/candidate/profile" element={<Profile />} />
        {/* Uses the VIEW-ONLY modern LinkedIn style */}
        <Route path="/candidate/company/:id" element={<CandidateCompanyView />} />

        {/* HR Routes */}
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/create-company" element={<CreateCompany />} />
        <Route path="/hr/jobs" element={<HRJobs />} />
        <Route path="/hr/create-job" element={<CreateJob />} />
        <Route path="/hr/edit-job/:id" element={<EditJob />} />
        {/* Uses the EDITABLE Form style */}
        <Route path="/hr/company-profile" element={<HRCompanyEdit />} />

        {/* 404 */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
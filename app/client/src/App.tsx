import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import CandidateDashboard from "./components/CandidatePage";
import RecruiterDashboard from "./components/RecruiterPage";
import AuthPage from "./components/AuthPage";
import OnBoardingPage from "./components/OnBoardingPage";
function App() {
  const role = localStorage.getItem("role"); 
  // role = "candidate" hoặc "recruiter"
  // nếu chưa có thì tạm redirect candidate cho đỡ trống

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        {/* Candidate */}
        <Route path="/candidate" element={<CandidateDashboard />} />

        {/* Recruiter */}
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/onboarding" element={<OnBoardingPage />} />

        {/* Auto redirect theo role */}
        <Route path="/" element={<Navigate to={`/${role || "auth"}`} replace />} />

        {/* fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

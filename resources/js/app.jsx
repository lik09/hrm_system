import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PersonnelPage from "./pages/personnel/PersonnelPage";
import TrainingPage from "./pages/training/TrainingPage";
import SkillPage from "./pages/skill/SkillPage";
import LeaveManagement from "./pages/leave/LeaveManagement";
import AttendancePage from "./pages/Attendance/AttendancePage";
import AlertPage from "./pages/Alert/AlertPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import { PrivateRoute } from "./components/auth/PrivateRoute";
import UserPage from "./pages/user/UserPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <PrivateRoute allowedRoles={["Admin","HR","Commander","Officer","User"]}>
            <MainLayout />
          </PrivateRoute>
        }>
          {/* Dashboard accessible to all roles */}
          <Route index element={<DashboardPage />} />

          {/* Role-based pages */}
          <Route path="personnel" element={<PrivateRoute allowedRoles={["Admin","HR"]}><PersonnelPage /></PrivateRoute>} />
          <Route path="leave" element={<PrivateRoute allowedRoles={["Admin","HR"]}><LeaveManagement /></PrivateRoute>} />
          <Route path="training" element={<PrivateRoute allowedRoles={["Admin","Commander"]}><TrainingPage /></PrivateRoute>} />
          <Route path="skill" element={<PrivateRoute allowedRoles={["Admin","Commander"]}><SkillPage /></PrivateRoute>} />
          <Route path="attendance" element={<PrivateRoute allowedRoles={["Admin","Officer"]}><AttendancePage /></PrivateRoute>} />
          <Route path="alert" element={<PrivateRoute allowedRoles={["Admin","Officer"]}><AlertPage /></PrivateRoute>} />
          <Route path="user" element={<PrivateRoute allowedRoles={["Admin"]}><UserPage /></PrivateRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("app")).render(<App />);

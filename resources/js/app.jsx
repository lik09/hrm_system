import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PersonnelPage from "./pages/personnel/PersonnelPage";
import TrainingPage from "./pages/training/TrainingPage";
import SkillPage from "./pages/skill/SkillPage";

// Import your pages/components


const App = () => {

  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout/>}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/personnel" element={<PersonnelPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/skill" element={<SkillPage />} />
            
          
            {/* Optional: 404 route */}
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Route>

          {/* <Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
          </Route> */}
        </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("app")).render(<App />);

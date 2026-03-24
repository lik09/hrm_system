// resources/js/components/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getProfile, getToken } from "../../store/profileStore";

export const PrivateRoute = ({ allowedRoles = [], children }) => {
  const token = getToken();
  const user = getProfile();

  // ❌ No token → go login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ User not loaded yet (avoid blank screen)
  if (!user) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const role = user?.role;

  // ❌ Role not allowed → go login (NOT "/")
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ All good
  return children;
};
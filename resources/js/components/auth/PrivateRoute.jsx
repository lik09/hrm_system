// resources/js/components/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getProfile, getToken } from "../../store/profileStore";

export const PrivateRoute = ({ allowedRoles = [], children }) => {
  const token = getToken();
  const user = getProfile();
  const role = user?.role;

  // Not logged in
  if (!token) return <Navigate to="/login" replace />;

  // Role not allowed
  if (allowedRoles.length && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

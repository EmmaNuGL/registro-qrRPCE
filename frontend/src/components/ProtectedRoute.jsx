import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/sessionManager";

export default function ProtectedRoute({ children, requiredRole }) {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/biblioteca" />;
  }

  return children;
}

import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/sessionManager";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  // Si hay lista de roles, validar
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // En caso de rol incorrecto, mandamos a su “home” correcto
    if (user.role === "Administrador" || user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/u" replace />;
  }

  return children;
}

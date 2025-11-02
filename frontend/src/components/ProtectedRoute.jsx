// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/sessionManager";

export default function ProtectedRoute({ children, requiredRole }) {
  const user = getCurrentUser();

  // Caso 1: No hay sesión (usuario no logueado)
  if (!user) {
    console.warn("⚠️ No hay usuario en sesión. Redirigiendo a login...");
    return <Navigate to="/login" replace />;
  }

  // Caso 2: Falta el rol o no coincide con el requerido
  if (requiredRole && user.role !== requiredRole) {
    console.warn(
      `⛔ Acceso denegado. Se requiere rol "${requiredRole}", pero el usuario tiene "${user.role}".`
    );

    // Si el usuario es admin pero intenta entrar a área de usuario
    if (user.role === "admin") return <Navigate to="/" replace />;

    // Si el usuario es normal y trata de entrar al área de admin
    if (user.role === "usuario") return <Navigate to="/biblioteca" replace />;

    // Si el rol no coincide con ninguno conocido
    return <Navigate to="/login" replace />;
  }

  // Caso 3: Usuario y rol correctos → acceso permitido
  return children;
}

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Libros from "./pages/Libros";
import Historial from "./pages/Historial";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import Configuracion from "./pages/Configuracion";
import Biblioteca from "./pages/Biblioteca";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/biblioteca" replace />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Solo Admin */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="Administrador">
            <Libros />
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial"
        element={
          <ProtectedRoute role="Administrador">
            <Historial />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <ProtectedRoute role="Administrador">
            <Reportes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute role="Administrador">
            <Usuarios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion"
        element={
          <ProtectedRoute role="Administrador">
            <Configuracion />
          </ProtectedRoute>
        }
      />
      {/* Solo Usuario */}
      <Route
        path="/biblioteca"
        element={
          <ProtectedRoute role="Usuario">
            <Biblioteca />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

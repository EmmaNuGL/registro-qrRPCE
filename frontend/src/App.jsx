import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout"; // Layout del administrador
import UserLayout from "./layouts/UserLayout"; // Layout del usuario normal

// Admin pages
import Dashboard from "./components/Dashboard";
import Scanner from "./pages/Scanner";
import Libros from "./pages/Libros";
import Historial from "./pages/Historial";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import Configuracion from "./pages/Configuracion";
import Biblioteca2D from "./pages/Biblioteca2D"; // vista de solo lectura para admin

// User pages
import Biblioteca from "./pages/Biblioteca"; // solo lectura

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* === ADMIN === */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Administrador", "admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="escaneo" element={<Scanner />} />
          <Route path="libros" element={<Libros />} />
          <Route path="historial" element={<Historial />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="biblioteca-2d" element={<Biblioteca2D />} />
        </Route>

        {/* === USUARIO NORMAL === */}
        <Route
          path="/u"
          element={
            <ProtectedRoute allowedRoles={["Usuario", "usuario"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Biblioteca />} />
        </Route>

        {/* RUTA POR DEFECTO */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { getCurrentUser } from "./utils/sessionManager";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./components/Dashboard";
import Libros from "./pages/Libros";
import Historial from "./pages/Historial";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import Configuracion from "./pages/Configuracion";
import Scanner from "./pages/Scanner";
import Biblioteca from "./pages/Biblioteca";

export default function App() {
  const user = getCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        {/* === PÁGINA DE LOGIN === */}
        <Route path="/login" element={<Login />} />

        {/* === RUTAS ADMINISTRADOR === */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="libros" element={<Libros />} />
          <Route path="historial" element={<Historial />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="scanner" element={<Scanner />} />
        </Route>

        {/* === RUTA USUARIO NORMAL === */}
        <Route
          path="/biblioteca"
          element={
            <ProtectedRoute requiredRole="usuario">
              <Biblioteca />
            </ProtectedRoute>
          }
        />

        {/* === REDIRECCIÓN POR DEFECTO === */}
        <Route
          path="*"
          element={user ? <DashboardLayout /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

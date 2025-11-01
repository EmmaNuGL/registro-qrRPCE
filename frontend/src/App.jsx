import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { getCurrentUser } from "./utils/sessionManager";
import { clearUser } from "./utils/sessionManager";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin */}
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

        {/* Usuario normal */}
        <Route
          path="/biblioteca"
          element={
            <ProtectedRoute requiredRole="usuario">
              <Biblioteca />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

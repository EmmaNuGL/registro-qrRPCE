import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

// Páginas
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
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="libros" element={<Libros />} />
          <Route path="historial" element={<Historial />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="biblioteca" element={<Biblioteca />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

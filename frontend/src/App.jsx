import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Páginas (placeholders para pegar tu lógica existente)
import Libros from './pages/Libros';
import Scanner from './pages/Scanner';
import Historial from './pages/Historial';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import Usuarios from './pages/Usuarios';

import './style-custom.css';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/libros" replace />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/config" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

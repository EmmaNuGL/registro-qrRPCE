import React from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../utils/sessionManager";

export default function Sidebar() {
  const user = getCurrentUser();

  if (!user) return null;

  const isAdmin = user.role === "Administrador";

  return (
    <aside className="sidebar">
      {isAdmin ? (
        <>
          <div className="nav-item">
            <Link to="/dashboard">📊 Panel Principal</Link>
          </div>
          <div className="nav-item">
            <Link to="/scanner">📱 Escaneo QR</Link>
          </div>
          <div className="nav-item">
            <Link to="/libros">📖 Gestión de Libros</Link>
          </div>
          <div className="nav-item">
            <Link to="/historial">📋 Historial</Link>
          </div>
          <div className="nav-item">
            <Link to="/reportes">📄 Reportes</Link>
          </div>
          <div className="nav-item">
            <Link to="/usuarios">👥 Usuarios</Link>
          </div>
          <div className="nav-item">
            <Link to="/configuracion">⚙️ Configuración</Link>
          </div>
        </>
      ) : (
        <>
          <div className="nav-item">
            <Link to="/biblioteca">📚 Biblioteca 2D (Solo Lectura)</Link>
          </div>
          <div className="user-alert">
            <p>
              <strong>👤 Usuario Normal:</strong> Solo lectura
            </p>
          </div>
        </>
      )}
    </aside>
  );
}

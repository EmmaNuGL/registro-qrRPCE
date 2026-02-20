import React from "react";
import { getCurrentUser, logoutUser } from "../utils/sessionManager";

export default function Header() {
  const user = getCurrentUser();

  return (
    <header className="app-header-modern">
      
      <div className="header-left">
        <div className="header-icon">📋</div>
        <div>
          <h1 className="header-title">
            Sistema de Libros de Registro
          </h1>
          <p className="header-subtitle">
            Control de Entradas y Salidas con Códigos QR
          </p>
        </div>
      </div>

      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="user-meta">
            <div className="user-name">
              {user?.name || "Usuario"}
            </div>
            <div className="user-role">
              {user?.role}
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={logoutUser}>
          Cerrar Sesión
        </button>
      </div>

    </header>
  );
}
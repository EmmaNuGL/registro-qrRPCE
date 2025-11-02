import React from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/sessionManager"; // ✅ Corregido

export default function Header() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // ✅ antes decía clearUser()
    navigate("/login");
  };

  return (
    <header className="app-header">
      {/* === LOGO Y TÍTULO === */}
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">📋</span>
          <div className="logo-text">
            <h1>Sistema de Libros de Registro</h1>
            <p>Control de Entradas y Salidas con Códigos QR</p>
          </div>
        </div>
      </div>

      {/* === USUARIO Y SESIÓN === */}
      <div className="header-right">
        {user ? (
          <>
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="user-details">
                <strong>{user.name}</strong>
                <div className="user-role">{user.role}</div>
              </div>
            </div>

            <button className="btn btn-danger" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
}

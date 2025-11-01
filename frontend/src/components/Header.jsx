import React from "react";
import { getCurrentUser, logoutUser } from "../utils/sessionManager";

export default function Header() {
  const user = getCurrentUser();

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">📋</div>
        <div>
          <h1>Sistema de Libros de Registro</h1>
          <p>Control de Entradas y Salidas con QR</p>
        </div>
      </div>

      <div className="user-info">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <div>
            <strong>{user?.name || "Sin usuario"}</strong>
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>En línea</div>
          {user?.role === "Administrador" && (
            <select
              onChange={(e) => {
                if (e.target.value === "logout") logoutUser();
              }}
              style={{
                fontSize: "11px",
                marginTop: "5px",
                padding: "2px",
              }}
            >
              <option value="Administrador">Administrador</option>
              <option value="logout">Cerrar Sesión</option>
            </select>
          )}
        </div>
      </div>
    </header>
  );
}

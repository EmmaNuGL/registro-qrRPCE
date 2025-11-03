import React from "react";
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../utils/sessionManager";

const Item = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "nav-item" + (isActive ? " active" : "")
    }
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 12,
      color: "#1f2937",
      textDecoration: "none",
      fontWeight: 600
    }}
  >
    <span style={{ width: 22, textAlign: "center" }}>{icon}</span>
    <span>{children}</span>
  </NavLink>
);

export default function Sidebar({ variant = "admin" }) {
  const user = getCurrentUser();
  const isAdmin = user?.role === "Administrador" || user?.role === "admin";

  const base = isAdmin ? "/admin" : "/u";

  return (
    <aside
      className="sidebar"
      style={{
        background: "linear-gradient(180deg,#f2f4ff,#f5f0ff)",
        borderRight: "1px solid #e9ecef",
        padding: 16
      }}
    >
      {isAdmin ? (
        <>
          <Item to={`${base}`}>📊 Panel Principal</Item>
          <Item to={`${base}/escaneo`}>📱 Escaneo QR</Item>
          <Item to={`${base}/libros`}>📚 Gestión de Libros</Item>
          <Item to={`${base}/historial`}>🕒 Historial</Item>
          <Item to={`${base}/reportes`}>📈 Reportes</Item>
          <Item to={`${base}/usuarios`}>👥 Usuarios</Item>
          <Item to={`${base}/configuracion`}>⚙️ Configuración</Item>
          <div style={{ height: 12 }} />
          <Item to={`${base}/biblioteca-2d`}>📖 Biblioteca 2D (Solo lectura)</Item>
        </>
      ) : (
        <>
          <div style={{ fontWeight: 700, margin: "8px 8px 12px", color: "#374151" }}>
            📖 Biblioteca 2D (Solo Lectura)
          </div>
          <Item to={`${base}`}>🔎 Buscar libros</Item>
        </>
      )}
    </aside>
  );
}

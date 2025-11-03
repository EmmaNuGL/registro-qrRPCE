import React from "react";
import { getCurrentUser, logoutUser } from "../utils/sessionManager";

export default function Header() {
  const user = getCurrentUser();

  return (
    <header className="app-header" style={{ background: "linear-gradient(90deg,#4c6ef5,#845ef7)", color: "#fff", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
      {/* Logo + títulos como el HTML original */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 28 }}>📋</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Sistema de Libros de Registro</h1>
          <p style={{ margin: 0, fontSize: 12, opacity: .9 }}>Control de Entradas y Salidas con Códigos QR</p>
        </div>
      </div>

      {/* Usuario + cerrar sesión */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "grid", placeItems: "center", fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 700 }}>{user?.name || "Usuario"}</div>
            <div style={{ fontSize: 12, opacity: .9 }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={logoutUser} style={{ background: "#fa5252", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}

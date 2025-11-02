import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/sessionManager";

export default function MainLayout() {
  const user = getCurrentUser();

  return (
    <div
      className="main-layout"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e9f1ff, #b8d4ff)",
      }}
    >
      {/* ENCABEZADO SUPERIOR */}
      <header
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#2b4eff" }}>
            📚 Sistema de Libros de Registro
          </h2>
          <p style={{ margin: 0, color: "#555" }}>
            Control de Entradas y Salidas con Códigos QR
          </p>
        </div>

        <div
          style={{
            background: "#e8f0ff",
            padding: "0.8rem 1.2rem",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              background: "#2b4eff",
              color: "#fff",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <strong style={{ color: "#333" }}>
              {user?.name || "Usuario Normal"}
            </strong>
            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
              Usuario Normal — Solo Lectura
            </p>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div
        style={{
          flex: 1,
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "2rem",
            width: "90%",
            maxWidth: "1300px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

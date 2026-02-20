import React from "react";
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../utils/sessionManager";

const Item = ({ to, icon, children, collapsed, exact }) => (
  <NavLink
    to={to}
    end={exact}
    className={({ isActive }) =>
      "nav-item-modern" + (isActive ? " active" : "")
    }
  >
    <span className="nav-icon">{icon}</span>
    {!collapsed && <span className="nav-label">{children}</span>}
  </NavLink>
);

export default function Sidebar({ collapsed, setCollapsed }) {
  const user = getCurrentUser();
  const isAdmin = user?.role === "Administrador" || user?.role === "admin";
  const base = isAdmin ? "/admin" : "/u";

  return (
    <aside className={`sidebar-modern ${collapsed ? "collapsed" : ""}`}>
      
      <div className="sidebar-header">
        {!collapsed && <h3>📚 Sistema</h3>}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          ☰
        </button>
      </div>

      <div className="sidebar-content">
        {isAdmin ? (
          <>
            {/* 👇 SOLO ESTE LLEVA exact */}
            <Item 
              to={`${base}`} 
              icon="📊" 
              collapsed={collapsed} 
              exact
            >
              Panel Principal
            </Item>

            <Item to={`${base}/escaneo`} icon="📱" collapsed={collapsed}>
              Escaneo QR
            </Item>

            <Item to={`${base}/libros`} icon="📚" collapsed={collapsed}>
              Gestión de Libros
            </Item>

            <Item to={`${base}/historial`} icon="🕒" collapsed={collapsed}>
              Historial
            </Item>

            <Item to={`${base}/reportes`} icon="📈" collapsed={collapsed}>
              Reportes
            </Item>

            <Item to={`${base}/usuarios`} icon="👥" collapsed={collapsed}>
              Usuarios
            </Item>

            <Item to={`${base}/configuracion`} icon="⚙️" collapsed={collapsed}>
              Configuración
            </Item>

            <div className="sidebar-divider" />

            <Item to={`${base}/biblioteca-2d`} icon="📖" collapsed={collapsed}>
              Biblioteca 2D
            </Item>
          </>
        ) : (
          <Item to={`${base}`} icon="🔎" collapsed={collapsed} exact>
            Buscar libros
          </Item>
        )}
      </div>
    </aside>
  );
}
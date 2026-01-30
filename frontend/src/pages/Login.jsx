import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/sessionManager";
import "../style-custom.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const admin = {
      user: "admin",
      pass: "12345",
      role: "Administrador",
      name: "Administrador del sistema",
    };

    const user = {
      user: "usuario",
      pass: "12345",
      role: "Usuario",
      name: "Usuario Normal",
    };

    if (username === admin.user && password === admin.pass) {
      loginUser(admin);
      navigate("/admin");
    } else if (username === user.user && password === user.pass) {
      loginUser(user);
      navigate("/u");
    } else {
      setError("❌ Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <span className="login-icon">📚</span>
          <h2>Sistema de Registro QR</h2>
          <p>Control de libros, préstamos y archivos</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            🔐 Ingresar al sistema
          </button>

          {error && <div className="login-error">{error}</div>}
        </form>

        <div className="login-footer">
          <small>© Sistema de Registro con QR</small>
        </div>
      </div>
    </div>
  );
}

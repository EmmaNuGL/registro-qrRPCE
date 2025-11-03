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
      navigate("/admin"); // ✅ lleva al layout de administrador
    } else if (username === user.user && password === user.pass) {
      loginUser(user);
      navigate("/u"); // ✅ lleva al layout de usuario normal
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>📚 Sistema de Registro QR</h2>
        <p>Control de Entradas y Salidas con Códigos QR</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary">
            Ingresar
          </button>

          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
  );
}

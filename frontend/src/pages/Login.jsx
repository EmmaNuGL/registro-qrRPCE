import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../utils/sessionManager"; // ✅ corregido
import "../style-custom.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Usuarios base (puedes conectar luego con tu backend o DB)
    const admin = {
      user: "admin",
      pass: "12345",
      role: "admin", // 🔹 en minúsculas, coincide con ProtectedRoute
      name: "Administrador del sistema",
    };

    const user = {
      user: "usuario",
      pass: "12345",
      role: "usuario", // 🔹 en minúsculas también
      name: "Usuario estándar",
    };

    // ✅ Validación de inicio de sesión
    if (username === admin.user && password === admin.pass) {
      saveUser(admin);
      navigate("/"); // Panel principal
    } else if (username === user.user && password === user.pass) {
      saveUser(user);
      navigate("/biblioteca"); // Vista del usuario normal
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>📚 Sistema de Registro QR</h2>
        <p>Registro de la Propiedad del Cantón Esmeraldas</p>

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

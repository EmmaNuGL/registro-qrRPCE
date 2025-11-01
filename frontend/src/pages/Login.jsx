import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Usuarios simulados (por ahora, reemplazables por BD real)
  const usersDB = [
    {
      email: "admin@registro.gob.ec",
      password: "admin123",
      role: "Administrador",
      name: "Administrador del Sistema",
    },
    {
      email: "usuario@registro.gob.ec",
      password: "user123",
      role: "Usuario",
      name: "Usuario Normal",
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = usersDB.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      setError("❌ Credenciales incorrectas.");
      return;
    }

    // Guardar datos de sesión en localStorage
    localStorage.setItem("user", JSON.stringify(foundUser));
    alert(`Bienvenido ${foundUser.name} (${foundUser.role})`);

    // Redirigir según el rol
    if (foundUser.role === "Administrador") navigate("/dashboard");
    else navigate("/biblioteca");
  };

  return (
    <div className="login-container">
      <h2>📚 Sistema QR — Registro de la Propiedad</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>Correo institucional</label>
        <input
          type="email"
          placeholder="usuario@registro.gob.ec"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          placeholder="•••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
      <footer>
        <p>© 2025 Registro de la Propiedad del Cantón Esmeraldas</p>
      </footer>
    </div>
  );
}

import React, { useState } from "react";
import "../style-custom.css";

export default function Configuracion({ books, users, history, setBooks, setUsers, setHistory }) {
  const [darkMode, setDarkMode] = useState(false);
  const [autoCapture, setAutoCapture] = useState(false);
  const [sound, setSound] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // 🔊 Sonido de detección
  const playDetectionSound = () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 800;
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  // 📸 Alternar captura automática
  const toggleAutoCapture = () => {
    const newState = !autoCapture;
    setAutoCapture(newState);
    alert(newState ? "📸 Captura automática activada" : "📸 Captura automática desactivada");
  };

  // 🔊 Alternar sonido
  const toggleSound = () => {
    const newState = !sound;
    setSound(newState);
    if (newState) playDetectionSound();
    alert(newState ? "🔊 Sonido activado" : "🔇 Sonido desactivado");
  };

  // 🎯 Alternar modo enfoque
  const toggleFocusMode = () => {
    const newState = !focusMode;
    setFocusMode(newState);
    alert(newState ? "🎯 Modo Enfoque activado - Precisión alta" : "🎯 Modo normal activado");
  };

  // 🎨 Alternar modo oscuro
  const toggleDarkMode = () => {
    const newState = !darkMode;
    setDarkMode(newState);
    document.body.classList.toggle("dark-mode", newState);
    alert(newState ? "🌙 Modo oscuro activado" : "☀️ Modo claro activado");
  };

  // 💾 Respaldo total
  const backupData = () => {
    const data = {
      books,
      users,
      history,
      fecha: new Date().toLocaleString("es-ES"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `respaldo_registro_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  // 📥 Importar respaldo
  const importBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setBooks(data.books || []);
        setUsers(data.users || []);
        setHistory(data.history || []);
        alert("✅ Respaldo restaurado correctamente.");
      } catch (err) {
        alert("❌ Error al importar respaldo.");
      }
    };
    reader.readAsText(file);
  };

  // 🧹 Limpiar todo el sistema
  const clearSystem = () => {
    if (window.confirm("⚠️ ¿Seguro que deseas limpiar toda la base de datos? Esta acción no se puede deshacer.")) {
      localStorage.clear();
      setBooks([]);
      setUsers([]);
      setHistory([]);
      alert("🧹 Sistema limpiado correctamente.");
    }
  };

  return (
    <div className="page configuracion">
      <h2>⚙️ Configuración del Sistema</h2>

      <div className="config-grid">
        {/* === PREFERENCIAS DE ESCANEO === */}
        <div className="config-card">
          <h3>📸 Escáner QR</h3>
          <label>
            <input type="checkbox" checked={autoCapture} onChange={toggleAutoCapture} /> Captura automática
          </label>
          <label>
            <input type="checkbox" checked={sound} onChange={toggleSound} /> Sonido de confirmación
          </label>
          <label>
            <input type="checkbox" checked={focusMode} onChange={toggleFocusMode} /> Modo enfoque
          </label>
        </div>

        {/* === INTERFAZ === */}
        <div className="config-card">
          <h3>🎨 Interfaz</h3>
          <label>
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} /> Activar modo oscuro
          </label>
        </div>

        {/* === RESPALDO === */}
        <div className="config-card">
          <h3>💾 Respaldo y Restauración</h3>
          <button className="btn btn-primary" onClick={backupData}>💾 Exportar respaldo</button>
          <input type="file" accept=".json" onChange={importBackup} style={{ marginTop: "10px" }} />
        </div>

        {/* === LIMPIEZA === */}
        <div className="config-card">
          <h3>🧹 Mantenimiento</h3>
          <button className="btn btn-danger" onClick={clearSystem}>🧹 Limpiar todo el sistema</button>
        </div>
      </div>
    </div>
  );
}

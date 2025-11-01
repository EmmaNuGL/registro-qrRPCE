import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function Configuracion() {
  const [theme, setTheme] = useState("light");
  const [storageInfo, setStorageInfo] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalHistory: 0,
    usedSpace: 0,
  });

  // === MODO OSCURO ===
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // === RESPALDO (EXPORTAR DATOS) ===
  const backupData = () => {
    const fakeBackup = {
      libros: [],
      usuarios: [],
      historial: [],
      fecha: new Date().toLocaleString("es-ES"),
    };

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([fakeBackup]);
    XLSX.utils.book_append_sheet(wb, ws, "Respaldo");
    XLSX.writeFile(wb, "respaldo_registro.xlsx");

    alert("📦 Respaldo generado correctamente (Excel).");
  };

  // === RESTAURAR DATOS (IMPORTAR) ===
  const restoreData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      console.log("📂 Datos restaurados:", json);
      alert("✅ Respaldo importado correctamente (simulación).");
    };
    reader.readAsArrayBuffer(file);
  };

  // === LIMPIAR DATOS ===
  const clearData = () => {
    if (
      window.confirm(
        "⚠️ Esto eliminará todos los datos almacenados localmente. ¿Deseas continuar?"
      )
    ) {
      localStorage.clear();
      alert("🧹 Datos del sistema limpiados correctamente.");
    }
  };

  // === INFORMACIÓN DE ALMACENAMIENTO ===
  useEffect(() => {
    const info = {
      totalBooks: 120,
      totalUsers: 10,
      totalHistory: 450,
      usedSpace: 34,
    };
    setStorageInfo(info);
  }, []);

  return (
    <div className="config-container">
      <h2>⚙️ Configuración del Sistema</h2>

      {/* === MODO OSCURO === */}
      <div className="config-section">
        <h3>🌙 Apariencia</h3>
        <p>
          Tema actual: <strong>{theme === "light" ? "Claro" : "Oscuro"}</strong>
        </p>
        <button onClick={toggleTheme}>
          Cambiar a {theme === "light" ? "modo oscuro" : "modo claro"}
        </button>
      </div>

      {/* === RESPALDO Y RESTAURACIÓN === */}
      <div className="config-section">
        <h3>📦 Respaldo y Restauración</h3>
        <p>
          Puedes generar un respaldo completo del sistema o restaurar desde un
          archivo previo.
        </p>
        <div className="action-buttons">
          <button onClick={backupData}>💾 Generar Respaldo</button>
          <label className="file-label">
            📂 Restaurar desde archivo
            <input type="file" onChange={restoreData} />
          </label>
        </div>
      </div>

      {/* === LIMPIAR DATOS === */}
      <div className="config-section">
        <h3>🧹 Limpieza de Datos</h3>
        <p>
          Elimina toda la información almacenada localmente (útil para pruebas o
          reinicios del sistema).
        </p>
        <button onClick={clearData}>🗑️ Limpiar Datos</button>
      </div>

      {/* === INFORMACIÓN DEL SISTEMA === */}
      <div className="config-section">
        <h3>📊 Información del Sistema</h3>
        <table className="info-table">
          <tbody>
            <tr>
              <td>Total de Libros:</td>
              <td>{storageInfo.totalBooks}</td>
            </tr>
            <tr>
              <td>Total de Usuarios:</td>
              <td>{storageInfo.totalUsers}</td>
            </tr>
            <tr>
              <td>Total de Registros en Historial:</td>
              <td>{storageInfo.totalHistory}</td>
            </tr>
            <tr>
              <td>Espacio utilizado (estimado):</td>
              <td>{storageInfo.usedSpace}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* === CREDITOS === */}
      <div className="config-section footer">
        <p>
          Sistema desarrollado para el Registro de la Propiedad del Cantón
          Esmeraldas — Proyecto de Tesis (2025)
        </p>
      </div>
    </div>
  );
}

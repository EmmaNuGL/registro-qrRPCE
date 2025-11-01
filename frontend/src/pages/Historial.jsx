import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export default function Historial() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  // === FILTRAR HISTORIAL ===
  const filteredHistory = history.filter((entry) => {
    const matchSearch =
      entry.book?.toLowerCase().includes(search.toLowerCase()) ||
      entry.user?.toLowerCase().includes(search.toLowerCase()) ||
      entry.personName?.toLowerCase().includes(search.toLowerCase()) ||
      entry.actionNotes?.toLowerCase().includes(search.toLowerCase());

    const matchAction =
      !actionFilter || entry.action?.toLowerCase() === actionFilter.toLowerCase();

    const entryDate = new Date(entry.date);
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    const matchDate =
      (!from || entryDate >= from) && (!to || entryDate <= to);

    return matchSearch && matchAction && matchDate;
  });

  // === FUNCIONES ===
  const refreshHistory = () => {
    alert("🔄 Refrescando historial (pendiente conexión backend).");
  };

  const toggleSearch = () => setShowSearch(!showSearch);

  const exportToExcel = () => {
    if (!history.length) return alert("No hay datos para exportar.");
    const exportData = history.map((entry) => ({
      Fecha: new Date(entry.date).toLocaleDateString(),
      Hora: new Date(entry.date).toLocaleTimeString(),
      Libro: entry.book,
      Acción: entry.action,
      Usuario: entry.user,
      "Estado Anterior": entry.oldStatus || "",
      "Estado Nuevo": entry.newStatus || "",
      Persona: entry.personName || "",
      Observaciones: entry.actionNotes || "",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    XLSX.writeFile(wb, `historial_registro_${new Date().toISOString().split("T")[0]}.xlsx`);
    alert("✅ Historial exportado a Excel correctamente.");
  };

  const exportToPDF = () => {
    if (!history.length) return alert("No hay datos para exportar.");
    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(18);
    doc.text("Historial de Movimientos", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 20, 30);
    doc.text(`Total de registros: ${history.length}`, 20, 40);

    doc.setFontSize(10);
    let y = 55;
    filteredHistory.slice(0, 25).forEach((entry, index) => {
      doc.text(
        `${index + 1}. ${entry.book} | ${entry.action} | ${entry.user || "—"} | ${entry.personName || ""}`,
        20,
        y
      );
      y += 7;
    });

    doc.save(`historial_registro_${new Date().toISOString().split("T")[0]}.pdf`);
    alert("📄 PDF generado correctamente.");
  };

  // === INTERFAZ ===
  return (
    <div className="history-container">
      <h2>📜 Historial de Movimientos</h2>

      {/* === BOTONES PRINCIPALES === */}
      <div className="action-buttons">
        <button onClick={refreshHistory}>🔄 Refrescar</button>
        <button onClick={exportToExcel}>📊 Exportar Excel</button>
        <button onClick={exportToPDF}>📄 Exportar PDF</button>
        <button onClick={toggleSearch}>🔍 Buscar</button>
      </div>

      {/* === FILTROS === */}
      {showSearch && (
        <div className="filters-panel">
          <input
            type="text"
            placeholder="Buscar por libro, observación o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-row">
            <div>
              <label>Desde:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label>Hasta:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <label>Acción:</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="Prestado">Prestado</option>
                <option value="Devuelto a archivo">Devuelto a archivo</option>
                <option value="Registro">Registro</option>
                <option value="Actualización">Actualización</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* === TABLA DE HISTORIAL === */}
      <div className="table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Libro</th>
              <th>Usuario</th>
              <th>Estado Anterior</th>
              <th>Estado Nuevo</th>
              <th>Acción</th>
              <th>Persona</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((entry, idx) => (
                <tr key={idx}>
                  <td>
                    {new Date(entry.date).toLocaleDateString("es-ES")}{" "}
                    {new Date(entry.date).toLocaleTimeString("es-ES")}
                  </td>
                  <td>{entry.book}</td>
                  <td>{entry.user}</td>
                  <td>{entry.oldStatus}</td>
                  <td>{entry.newStatus}</td>
                  <td>{entry.action}</td>
                  <td>{entry.personName}</td>
                  <td>{entry.actionNotes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Sin registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

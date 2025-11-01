import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Historial() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("todos");

  // 🧠 Cargar historial desde la base de datos
  const loadHistory = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/history");
      setHistory(data.reverse());
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 🔍 Filtrar resultados
  const filteredHistory = history.filter((h) => {
    const textMatch =
      h.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.action && h.action.toLowerCase().includes(searchTerm.toLowerCase()));
    const typeMatch = filter === "todos" || h.action.includes(filter);
    return textMatch && typeMatch;
  });

  // 📤 Exportar a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredHistory);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    XLSX.writeFile(wb, "Historial_Movimientos.xlsx");
  };

  // 📄 Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Movimientos - Registro de la Propiedad", 14, 15);
    const tableData = filteredHistory.map((h) => [
      h.code,
      h.action,
      h.user || "Administrador",
      h.date,
    ]);
    doc.autoTable({
      head: [["Código", "Acción", "Usuario", "Fecha y Hora"]],
      body: tableData,
      startY: 25,
    });
    doc.save("Historial_Movimientos.pdf");
  };

  return (
    <div className="historial-container">
      <h2>📜 Historial de Movimientos</h2>

      {/* Barra de búsqueda */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Buscar por código o acción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="Préstamo">Préstamos</option>
          <option value="Devolución">Devoluciones</option>
        </select>
        <button onClick={exportToExcel} className="btn btn-success">
          📗 Exportar Excel
        </button>
        <button onClick={exportToPDF} className="btn btn-danger">
          📄 Exportar PDF
        </button>
      </div>

      {/* Tabla de historial */}
      <div className="historial-table">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Acción</th>
              <th>Usuario</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-results">
                  No hay movimientos registrados.
                </td>
              </tr>
            ) : (
              filteredHistory.map((h, i) => (
                <tr
                  key={i}
                  className={
                    h.action.includes("Préstamo")
                      ? "row-prestamo"
                      : h.action.includes("Devolución")
                      ? "row-devolucion"
                      : "row-otros"
                  }
                >
                  <td>{h.code}</td>
                  <td>{h.action}</td>
                  <td>{h.user || "Administrador"}</td>
                  <td>{h.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

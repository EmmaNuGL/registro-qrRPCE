import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getMovements } from "../services/movementsService";

export default function Historial() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("todos");

  // 🧠 Cargar historial desde la base de datos
  const loadHistory = async () => {
    try {
      const { data } = await getMovements();
      setHistory(data); // Backend already sorts
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
      h.codigo_qr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.tipo_movimiento && h.tipo_movimiento.toLowerCase().includes(searchTerm.toLowerCase()));
    const typeMatch = filter === "todos" || h.tipo_movimiento === filter;
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
      h.codigo_qr,
      h.tipo_movimiento,
      h.nombre_usuario || "Desconocido",
      new Date(h.fecha).toLocaleString(),
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
          <option value="PRESTAMO">Préstamos</option>
          <option value="DEVOLUCION">Devoluciones</option>
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
                    h.tipo_movimiento === "PRESTAMO"
                      ? "row-prestamo"
                      : h.tipo_movimiento === "DEVOLUCION"
                      ? "row-devolucion"
                      : "row-otros"
                  }
                >
                  <td>{h.codigo_qr}</td>
                  <td>{h.tipo_movimiento}</td>
                  <td>{h.nombre_usuario}</td>
                  <td>{new Date(h.fecha).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

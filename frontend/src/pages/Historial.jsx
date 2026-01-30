import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getMovements } from "../services/movementsService";

export default function Historial() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  /* =====================
     📥 LOAD HISTORY
  ===================== */
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getMovements();
      setHistory(res.data || []);
    } catch (error) {
      console.error("❌ Error loading history:", error);
    }
  };

  /* =====================
     🔍 FILTER
  ===================== */
  const filteredHistory = history.filter((h) => {
    const text = `
      ${h.qr_code || ""}
      ${h.volume_name || ""}
      ${h.borrowed_by || ""}
      ${h.returned_by || ""}
    `.toLowerCase();

    const textMatch = text.includes(searchTerm.toLowerCase());
    const typeMatch = filter === "ALL" || h.type === filter;

    return textMatch && typeMatch;
  });

  /* =====================
     📤 EXPORT EXCEL
  ===================== */
  const exportToExcel = () => {
    const data = filteredHistory.map((h) => ({
      "Código QR": h.qr_code,
      "Tomo": h.volume_name,
      "Movimiento": h.type === "OUT" ? "Préstamo" : "Devolución",
      "Prestado a": h.borrowed_by || "—",
      "Devuelto por": h.returned_by || "—",
      "Observaciones": h.observations || "",
      "Fecha": new Date(h.created_at).toLocaleString("es-ES"),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    XLSX.writeFile(wb, "Historial_Movimientos.xlsx");
  };

  /* =====================
     📄 EXPORT PDF
  ===================== */
  const exportToPDF = () => {
    const doc = new jsPDF("landscape");

    doc.text("Historial de Movimientos - Registro QR", 14, 15);

    const tableData = filteredHistory.map((h) => [
      h.qr_code,
      h.volume_name,
      h.type === "OUT" ? "Préstamo" : "Devolución",
      h.borrowed_by || "—",
      h.returned_by || "—",
      new Date(h.created_at).toLocaleString("es-ES"),
    ]);

    doc.autoTable({
      head: [
        [
          "Código QR",
          "Tomo",
          "Movimiento",
          "Prestado a",
          "Devuelto por",
          "Fecha",
        ],
      ],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
    });

    doc.save("Historial_Movimientos.pdf");
  };

  return (
    <div className="historial-container">
      <h2>📜 Historial de Movimientos</h2>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Buscar por QR, tomo o persona..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">Todos</option>
          <option value="OUT">📤 Préstamos</option>
          <option value="IN">📥 Devoluciones</option>
        </select>

        <button onClick={exportToExcel} className="btn btn-success">
          📗 Excel
        </button>

        <button onClick={exportToPDF} className="btn btn-danger">
          📄 PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="historial-table">
        <table>
          <thead>
            <tr>
              <th>Código QR</th>
              <th>Tomo</th>
              <th>Movimiento</th>
              <th>Prestado a</th>
              <th>Devuelto por</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  No hay movimientos registrados.
                </td>
              </tr>
            ) : (
              filteredHistory.map((h, i) => (
                <tr
                  key={h.id_movement || i}
                  className={
                    h.type === "OUT"
                      ? "row-loan"
                      : h.type === "IN"
                      ? "row-return"
                      : ""
                  }
                >
                  <td>{h.qr_code}</td>
                  <td>{h.volume_name}</td>
                  <td>{h.type === "OUT" ? "📤 Préstamo" : "📥 Devolución"}</td>
                  <td>{h.borrowed_by || "—"}</td>
                  <td>{h.returned_by || "—"}</td>
                  <td>
                    {new Date(h.created_at).toLocaleString("es-ES")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

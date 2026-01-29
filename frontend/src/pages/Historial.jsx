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
    const loadHistory = async () => {
      try {
        const res = await getMovements();
        setHistory(res.data || []);
      } catch (error) {
        console.error("❌ Error loading history:", error);
      }
    };

    loadHistory();
  }, []);

  /* =====================
     🔍 FILTER
  ===================== */
  const filteredHistory = history.filter((h) => {
    const text =
      h.qr_code?.toLowerCase() ||
      h.volume_name?.toLowerCase() ||
      "";

    const textMatch = text.includes(searchTerm.toLowerCase());
    const typeMatch = filter === "ALL" || h.movement_type === filter;

    return textMatch && typeMatch;
  });

  /* =====================
     📤 EXPORT EXCEL
  ===================== */
  const exportToExcel = () => {
    const data = filteredHistory.map((h) => ({
      "QR Code": h.qr_code,
      "Volume": h.volume_name,
      "Movement": h.movement_type,
      "User": h.user_name || "—",
      "Date": new Date(h.created_at).toLocaleString("es-ES"),
      "Observations": h.observations || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "History");
    XLSX.writeFile(wb, "Movements_History.xlsx");
  };

  /* =====================
     📄 EXPORT PDF
  ===================== */
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Movements History - QR Registry", 14, 15);

    const tableData = filteredHistory.map((h) => [
      h.qr_code,
      h.volume_name,
      h.movement_type,
      h.user_name || "—",
      new Date(h.created_at).toLocaleString("es-ES"),
    ]);

    doc.autoTable({
      head: [["QR", "Volume", "Movement", "User", "Date"]],
      body: tableData,
      startY: 25,
    });

    doc.save("Movements_History.pdf");
  };

  return (
    <div className="historial-container">
      <h2>📜 Historial de Movimientos</h2>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Buscar por QR o tomo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">Todos</option>
          <option value="LOAN">Préstamos</option>
          <option value="RETURN">Devoluciones</option>
        </select>

        <button onClick={exportToExcel} className="btn btn-success">
          📗 Exportar Excel
        </button>

        <button onClick={exportToPDF} className="btn btn-danger">
          📄 Exportar PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="historial-table">
        <table>
          <thead>
            <tr>
              <th>QR</th>
              <th>Tomo</th>
              <th>Movimiento</th>
              <th>Usuario</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-results">
                  No hay movimientos registrados.
                </td>
              </tr>
            ) : (
              filteredHistory.map((h, i) => (
                <tr
                  key={h.id_movement || i}
                  className={
                    h.movement_type === "LOAN"
                      ? "row-loan"
                      : h.movement_type === "RETURN"
                      ? "row-return"
                      : ""
                  }
                >
                  <td>{h.qr_code}</td>
                  <td>{h.volume_name}</td>
                  <td>{h.movement_type}</td>
                  <td>{h.user_name || "—"}</td>
                  <td>{new Date(h.created_at).toLocaleString("es-ES")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

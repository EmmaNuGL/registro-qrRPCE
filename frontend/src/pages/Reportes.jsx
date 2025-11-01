import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export default function Reportes() {
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [reportType, setReportType] = useState(null);

  // === REPORTES ===
  const generateInventoryReport = () => {
    setReportType("inventario");
  };

  const generateMovementReport = () => {
    setReportType("movimientos");
  };

  const generateStatisticsReport = () => {
    setReportType("estadisticas");
  };

  const generateDetailedReport = () => {
    setReportType("detallado");
  };

  // === DESCARGAS ===
  const downloadExcel = () => {
    let data = [];
    let filename = "";

    if (reportType === "inventario") {
      data = books.map((b) => ({
        Año: b.year,
        Tomo: b.tome,
        Desde: b.registryFrom,
        Hasta: b.registryTo,
        Estado: b.status,
      }));
      filename = "reporte_inventario.xlsx";
    } else if (reportType === "movimientos") {
      data = history.map((h) => ({
        Fecha: new Date(h.date).toLocaleDateString("es-ES"),
        Acción: h.action,
        Libro: h.book,
        Usuario: h.user,
        Observaciones: h.actionNotes,
      }));
      filename = "reporte_movimientos.xlsx";
    } else if (reportType === "estadisticas") {
      data = generateStatisticsData();
      filename = "reporte_estadisticas.xlsx";
    } else if (reportType === "detallado") {
      data = generateDetailedData();
      filename = "reporte_detallado.xlsx";
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, filename);
    alert("📊 Reporte exportado a Excel correctamente.");
  };

  const downloadPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(18);
    doc.text("Reporte del Sistema de Libros", 20, 20);
    doc.setFontSize(12);
    doc.text(`Tipo de reporte: ${reportType}`, 20, 35);
    doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 20, 45);
    doc.save(`${reportType}_registro.pdf`);
    alert("📄 PDF generado correctamente.");
  };

  // === FUNCIONES AUXILIARES ===
  const generateStatisticsData = () => {
    const yearlyStats = {};
    books.forEach((b) => {
      const y = b.year;
      if (!yearlyStats[y]) {
        yearlyStats[y] = { libros: 0, registros: 0, archivos: 0, uso: 0, movimientos: 0 };
      }
      yearlyStats[y].libros++;
      yearlyStats[y].registros += b.registryTo - b.registryFrom + 1;
      if (b.status === "En archivos") yearlyStats[y].archivos++;
      else yearlyStats[y].uso++;
    });

    history.forEach((h) => {
      const y = new Date(h.date).getFullYear().toString();
      if (yearlyStats[y]) yearlyStats[y].movimientos++;
    });

    return Object.entries(yearlyStats).map(([año, d]) => ({
      Año: año,
      Libros: d.libros,
      Registros: d.registros,
      "En Archivo": d.archivos,
      "En Uso": d.uso,
      Movimientos: d.movimientos,
      "Prom. Reg/Libro": (d.registros / d.libros).toFixed(1),
    }));
  };

  const generateDetailedData = () =>
    books.map((b) => ({
      Fecha: new Date().toLocaleDateString("es-ES"),
      Libro: b.type,
      Año: b.year,
      Tomo: b.tome,
      Desde: b.registryFrom,
      Hasta: b.registryTo,
      CódigoQR: b.qr,
      Estado: b.status,
    }));

  // === INTERFAZ ===
  return (
    <div className="reports-container">
      <h2>📊 Reportes e Impresión</h2>

      <div className="action-buttons">
        <button onClick={generateInventoryReport}>📘 Reporte de Inventario</button>
        <button onClick={generateMovementReport}>📋 Reporte de Movimientos</button>
        <button onClick={generateStatisticsReport}>📈 Estadísticas</button>
        <button onClick={generateDetailedReport}>📄 Reporte Detallado</button>
      </div>

      {reportType && (
        <div className="report-content">
          <h3>
            {reportType === "inventario" && "📘 Reporte de Inventario"}
            {reportType === "movimientos" && "📋 Reporte de Movimientos"}
            {reportType === "estadisticas" && "📈 Estadísticas del Sistema"}
            {reportType === "detallado" && "📄 Reporte Detallado"}
          </h3>

          <div className="action-buttons" style={{ marginTop: "10px" }}>
            <button onClick={downloadPDF}>📄 Descargar PDF</button>
            <button onClick={downloadExcel}>📊 Descargar Excel</button>
          </div>

          {reportType === "estadisticas" && (
            <table className="history-table" style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Libros</th>
                  <th>Registros</th>
                  <th>En Archivo</th>
                  <th>En Uso</th>
                  <th>Movimientos</th>
                  <th>Promedio Reg/Libro</th>
                </tr>
              </thead>
              <tbody>
                {generateStatisticsData().map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.Año}</td>
                    <td>{row.Libros}</td>
                    <td>{row.Registros}</td>
                    <td style={{ color: "#28a745" }}>{row["En Archivo"]}</td>
                    <td style={{ color: "#dc3545" }}>{row["En Uso"]}</td>
                    <td>{row.Movimientos}</td>
                    <td>{row["Prom. Reg/Libro"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "detallado" && (
            <div style={{ marginTop: "20px" }}>
              <p>
                <strong>📅 Período:</strong> Desde el primer registro hasta{" "}
                {new Date().toLocaleDateString("es-ES")}
              </p>
              <p>
                <strong>📘 Incluye:</strong> Todos los movimientos, datos completos de libros,
                funcionarios y observaciones.
              </p>
              <p>
                <strong>📄 Formato:</strong> Tabla completa con todos los campos disponibles.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "../style-custom.css";

export default function Reportes({ books = [], history = [] }) {
  const [reportContent, setReportContent] = useState("");
  const [reportType, setReportType] = useState("");

  // 📊 Generar reporte de inventario
  const generateInventoryReport = () => {
    setReportType("Inventario");

    const totalArchivos = books.filter(b => b.status === "En archivos").length;
    const totalUso = books.filter(b => b.status === "En uso").length;

    const html = `
      <div class="report-header" style="background: linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px;">
        <h2 style="margin: 0;">📘 Reporte de Inventario</h2>
        <p style="margin: 5px 0;">Sistema de Control de Libros</p>
        <p style="margin: 5px 0;">Generado el ${new Date().toLocaleString("es-ES")}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-number">${books.length}</div><div>Total Libros</div></div>
        <div class="stat-card"><div class="stat-number">${totalArchivos}</div><div>En Archivos</div></div>
        <div class="stat-card"><div class="stat-number">${totalUso}</div><div>En Uso</div></div>
      </div>
    `;
    setReportContent(html);
  };

  // 📋 Generar reporte de movimientos
  const generateMovementReport = () => {
    setReportType("Movimientos");
    const movimientos = history.length;

    const html = `
      <div class="report-header" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px;">
        <h2 style="margin: 0;">📋 Reporte de Movimientos</h2>
        <p style="margin: 5px 0;">Sistema de Control de Libros</p>
        <p style="margin: 5px 0;">Generado el ${new Date().toLocaleString("es-ES")}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-number">${movimientos}</div><div>Total de Movimientos</div></div>
        <div class="stat-card"><div class="stat-number">${books.length}</div><div>Libros Registrados</div></div>
      </div>
    `;
    setReportContent(html);
  };

  // 📈 Generar estadísticas generales
  const generateStatisticsReport = () => {
    setReportType("Estadísticas");

    const librosPorEstado = books.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    const html = `
      <div class="report-header" style="background: linear-gradient(135deg, #f6ad55 0%, #dd6b20 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px;">
        <h2 style="margin: 0;">📈 Estadísticas Generales</h2>
        <p style="margin: 5px 0;">Sistema de Control de Libros</p>
        <p style="margin: 5px 0;">Generado el ${new Date().toLocaleString("es-ES")}</p>
      </div>

      <div class="stats-grid">
        ${Object.entries(librosPorEstado)
          .map(([estado, cantidad]) => `
            <div class="stat-card">
              <div class="stat-number">${cantidad}</div>
              <div>${estado}</div>
            </div>
          `).join("")}
      </div>
    `;
    setReportContent(html);
  };

  // 📄 Generar reporte detallado (PDF y Excel)
  const generateDetailedReport = () => {
    setReportType("Detallado");
    const totalMovimientos = history.length;

    const html = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; text-align: center;">
        <h2 style="margin: 0 0 15px 0;">📄 REPORTE DETALLADO COMPLETO</h2>
        <p>Sistema de Control de Libros de Registro</p>
        <p>Generado el ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-number">${totalMovimientos}</div><div>Total Movimientos</div></div>
        <div class="stat-card"><div class="stat-number">${books.length}</div><div>Total Libros</div></div>
      </div>

      <div class="action-buttons" style="margin-top: 20px;">
        <button class="btn btn-primary" id="pdfBtn">📄 Descargar PDF Completo</button>
        <button class="btn btn-success" id="excelBtn">📊 Descargar Excel Completo</button>
      </div>
    `;
    setReportContent(html);
  };

  // 📥 Funciones de descarga
  useEffect(() => {
    const pdfBtn = document.getElementById("pdfBtn");
    const excelBtn = document.getElementById("excelBtn");
    if (pdfBtn) pdfBtn.onclick = downloadDetailedReportPDF;
    if (excelBtn) excelBtn.onclick = downloadDetailedReportExcel;
  }, [reportContent]);

  const downloadDetailedReportPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(18);
    doc.text("REPORTE DETALLADO COMPLETO", 20, 20);
    doc.text("Sistema de Control de Libros de Registro", 20, 30);
    doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 20, 40);
    doc.text(`Total de movimientos: ${history.length}`, 20, 50);
    doc.text(`Total de libros: ${books.length}`, 20, 60);
    doc.save(`reporte_detallado_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const downloadDetailedReportExcel = () => {
    const exportData = history.map((entry) => {
      const book = books.find((b) => b.title === entry.book);
      return {
        Fecha: new Date(entry.date).toLocaleDateString("es-ES"),
        Hora: new Date(entry.date).toLocaleTimeString("es-ES"),
        Libro: entry.book,
        Usuario: entry.user,
        Estado_Anterior: entry.oldStatus,
        Estado_Nuevo: entry.newStatus,
        Acción: entry.action,
        Persona: entry.personName,
        Observaciones: entry.actionNotes,
        Tomo: book ? book.tome : "",
        Año: book ? book.year : "",
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Reporte Detallado");
    XLSX.writeFile(wb, `reporte_detallado_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="page">
      <h2>📊 Reportes e Impresión</h2>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={generateInventoryReport}>
          📘 Reporte de Inventario
        </button>
        <button className="btn btn-secondary" onClick={generateMovementReport}>
          📋 Reporte de Movimientos
        </button>
        <button className="btn btn-success" onClick={generateStatisticsReport}>
          📈 Estadísticas
        </button>
        <button
          className="btn"
          style={{ background: "linear-gradient(45deg, #9c27b0, #673ab7)", color: "white" }}
          onClick={generateDetailedReport}
        >
          📄 Reporte Detallado
        </button>
      </div>

      <div
        id="reportContent"
        className="report-container"
        dangerouslySetInnerHTML={{ __html: reportContent }}
      />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "../style-custom.css";
import { getBooks } from "../services/booksService";
import {
  getMovements } from "../services/movementsService";

export default function Dashboard() {
  const [booksData, setBooksData] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);

  const [stats, setStats] = useState({
    totalBooks: 0,
    archivedBooks: 0,
    inUseBooks: 0,
    todayMovements: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  /* =====================
     📥 CARGAR LIBROS
  ===================== */
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await getBooks();
        setBooksData(res.data || []);
      } catch (error) {
        console.error("❌ Error cargando libros:", error);
      }
    };

    loadBooks();
  }, []);

  /* =====================
     📊 ESTADÍSTICAS
  ===================== */
  useEffect(() => {
    if (!Array.isArray(booksData)) return;

    const total = booksData.length;
    const archived = booksData.filter(b => b.estado === "DISPONIBLE").length;
    const inUse = booksData.filter(b => b.estado === "EN_USO").length;

    setStats({
      totalBooks: total,
      archivedBooks: archived,
      inUseBooks: inUse,
      todayMovements: 0,
    });
    const todayMoves = recentHistory.filter(h => new Date(h.fecha).toDateString() === new Date().toDateString()).length;

setStats({
  totalBooks: total,
  archivedBooks: archived,
  inUseBooks: inUse,
  todayMovements: todayMoves,
});

  }, [booksData, recentHistory]);

  /* =====================
     🕒 MINI HISTORIAL (SEGURO)
  ===================== */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getMovements();
        const ordered = (res.data || [])
          // .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Already sorted by backend
          .slice(0, 5);
        setRecentHistory(ordered);
      } catch (error) {
        console.warn("⚠️ Historial no disponible aún");
      }
    };

    loadHistory();
  }, []);

  /* =====================
     🔍 BÚSQUEDA RÁPIDA
  ===================== */
  const handleQuickSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setResults([]);
      return;
    }

    const filtered = booksData.filter((b) => {
      const year = b.anio?.toString().toLowerCase() || "";
      const tome = b.titulo?.toLowerCase() || "";
      const loc = b.ubicacion?.toLowerCase() || "";

      return (
        year.includes(term) ||
        tome.includes(term) ||
        loc.includes(term)
      );
    });

    setResults(filtered);
  };

  return (
    <div className="page dashboard">
      <h2>📊 Panel Principal</h2>

      {/* === ESTADÍSTICAS === */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalBooks}</div>
          <div>Total de Libros</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.archivedBooks}</div>
          <div>En Archivos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inUseBooks}</div>
          <div>En Uso</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.todayMovements}</div>
          <div>Movimientos Hoy</div>
        </div>
      </div>

      {/* === BOTONES === */}
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => window.location.href = "/admin/escaneo"}>
          📱 Escaneo Rápido
        </button>
        <button className="btn btn-secondary" onClick={() => window.location.href = "/admin/libros"}>
          📖 Ver Libros
        </button>
        <button className="btn btn-success" onClick={() => window.location.href = "/admin/libros"}>
          ➕ Agregar Libro
        </button>
      </div>

      {/* === CONSULTA RÁPIDA === */}
      <h3>🔍 Consulta Rápida de Libros</h3>
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar libro por año, tomo, registro..."
        value={searchTerm}
        onChange={handleQuickSearch}
      />

      <div className="quick-results">
        {results.length === 0 && searchTerm !== "" ? (
          <p className="no-results">No se encontraron resultados</p>
        ) : (
          results.map((b, i) => (
            <div key={i} className="book-preview">
              <strong>📘 {b.anio} — {b.titulo}</strong>
              <p>
                Ubicación: {b.ubicacion}
              </p>
              <span className={`status-tag ${b.estado === "EN_USO" ? "inuse" : "archived"}`}>
                {b.estado}
              </span>
            </div>
          ))
        )}
      </div>

      {/* === MINI HISTORIAL === */}
      <h3>🕒 Actividades Recientes</h3>

<div className="recent-history">
  {recentHistory.map((h, i) => (
    <div key={h.id_movimiento || i} className="history-item">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>📘 {h.titulo}</strong>
        <small style={{ color: "#666" }}>{new Date(h.fecha).toLocaleString("es-ES")}</small>
      </div>
      
      <div style={{ fontSize: "0.9rem", color: "#444", margin: "5px 0" }}>
        👤 {h.nombre_usuario} | 🔄 {h.tipo_movimiento}
      </div>

      <p style={{ margin: "5px 0", fontStyle: "italic" }}>{h.observacion}</p>

      
    </div>
  ))}
</div>

    </div>
  );
}

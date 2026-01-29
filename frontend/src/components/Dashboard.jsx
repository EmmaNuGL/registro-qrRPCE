import React, { useEffect, useState } from "react";
import "../style-custom.css";
import { getBooks } from "../services/booksService";
import { getMovements } from "../services/movementsService";

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
     📥 LOAD BOOKS
  ===================== */
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await getBooks();
        setBooksData(res.data || []);
      } catch (error) {
        console.error("❌ Error loading books:", error);
      }
    };

    loadBooks();
  }, []);

  /* =====================
     📊 STATISTICS
  ===================== */
  useEffect(() => {
    if (!Array.isArray(booksData)) return;

    const total = booksData.length;
    const archived = booksData.filter(b => b.status === "ARCHIVED").length;
    const inUse = booksData.filter(b => b.status === "IN_USE").length;

    const todayMoves = recentHistory.filter(h =>
      new Date(h.created_at).toDateString() === new Date().toDateString()
    ).length;

    setStats({
      totalBooks: total,
      archivedBooks: archived,
      inUseBooks: inUse,
      todayMovements: todayMoves,
    });
  }, [booksData, recentHistory]);

  /* =====================
     🕒 RECENT MOVEMENTS
  ===================== */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getMovements();
        const ordered = (res.data || []).slice(0, 5);
        setRecentHistory(ordered);
      } catch {
        console.warn("⚠️ History not available yet");
      }
    };

    loadHistory();
  }, []);

  /* =====================
     🔍 QUICK SEARCH
  ===================== */
  const handleQuickSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setResults([]);
      return;
    }

    const filtered = booksData.filter((b) => {
      const year = b.year?.toString() || "";
      const name = b.volume_name?.toLowerCase() || "";
      const qr = b.qr_code?.toLowerCase() || "";

      return (
        year.includes(term) ||
        name.includes(term) ||
        qr.includes(term)
      );
    });

    setResults(filtered);
  };

  return (
    <div className="page dashboard">
      <h2>📊 Panel Principal</h2>

      {/* === STATISTICS === */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalBooks}</div>
          <div>Total de Libros</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.archivedBooks}</div>
          <div>En Archivo</div>
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

      {/* === ACTIONS === */}
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

      {/* === QUICK SEARCH === */}
      <h3>🔍 Consulta Rápida de Libros</h3>
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar por año, tomo o QR..."
        value={searchTerm}
        onChange={handleQuickSearch}
      />

      <div className="quick-results">
        {results.length === 0 && searchTerm !== "" ? (
          <p className="no-results">No se encontraron resultados</p>
        ) : (
          results.map((b, i) => (
            <div key={i} className="book-preview">
              <strong>📘 {b.year} — {b.volume_name}</strong>
              <p>QR: {b.qr_code}</p>
              <span className={`status-tag ${b.status === "IN_USE" ? "inuse" : "archived"}`}>
                {b.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* === RECENT ACTIVITY === */}
      <h3>🕒 Actividades Recientes</h3>

      <div className="recent-history">
        {recentHistory.map((h, i) => (
          <div key={h.id_movement || i} className="history-item">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>📘 {h.volume_name}</strong>
              <small>{new Date(h.created_at).toLocaleString("es-ES")}</small>
            </div>

            <div style={{ fontSize: "0.9rem", color: "#444" }}>
              👤 {h.user_name || "—"} | 🔄 {h.movement_type}
            </div>

            {h.observations && (
              <p style={{ fontStyle: "italic" }}>{h.observations}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "../style-custom.css";
import { getBooks } from "../services/booksService";
import { getMovements } from "../services/movementsService";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [movements, setMovements] = useState([]);

  const [stats, setStats] = useState({
    totalBooks: 0,
    archivedBooks: 0,
    inUseBooks: 0,
    todayMovements: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  /* =====================
     📥 LOAD DATA
  ===================== */
  useEffect(() => {
    loadBooks();
    loadMovements();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data || []);
    } catch (error) {
      console.error("❌ Error loading books:", error);
    }
  };

  const loadMovements = async () => {
    try {
      const res = await getMovements();
      setMovements(res.data || []);
    } catch (error) {
      console.warn("⚠️ Movements not available yet");
    }
  };

  /* =====================
     📊 STATISTICS
  ===================== */
  useEffect(() => {
    const total = books.length;
    const archived = books.filter(b => b.status === "ARCHIVED").length;
    const inUse = books.filter(b => b.status === "IN_USE").length;

    const today = new Date().toDateString();
    const todayMoves = movements.filter(
      m => new Date(m.created_at).toDateString() === today
    ).length;

    setStats({
      totalBooks: total,
      archivedBooks: archived,
      inUseBooks: inUse,
      todayMovements: todayMoves,
    });
  }, [books, movements]);

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

    const filtered = books.filter((b) => {
      const text = `
        ${b.qr_code || ""}
        ${b.volume_name || ""}
        ${b.year || ""}
        ${b.register_from || ""}
        ${b.register_to || ""}
      `.toLowerCase();

      return text.includes(term);
    });

    setResults(filtered);
  };

  /* =====================
     🕒 RECENT MOVEMENTS
  ===================== */
  const recentMovements = movements.slice(0, 5);

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
        <button
          className="btn btn-primary"
          onClick={() => window.location.href = "/admin/escaneo"}
        >
          📱 Escaneo Rápido
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => window.location.href = "/admin/libros"}
        >
          📖 Gestión de Libros
        </button>
      </div>

      {/* === QUICK SEARCH === */}
      <h3>🔍 Consulta Rápida</h3>
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar por QR, tomo, año o registro..."
        value={searchTerm}
        onChange={handleQuickSearch}
      />

      <div className="quick-results">
        {results.length === 0 && searchTerm !== "" ? (
          <p className="no-results">No se encontraron resultados</p>
        ) : (
          results.map((b, i) => (
            <div key={i} className="book-preview">
              <strong>
                📘 {b.year} — {b.volume_name}
              </strong>
              <p>QR: {b.qr_code}</p>
              <p>
                Registro: {b.register_from} – {b.register_to}
              </p>
              <span
                className={`status-tag ${
                  b.status === "IN_USE" ? "inuse" : "archived"
                }`}
              >
                {b.status === "IN_USE" ? "EN USO" : "ARCHIVO"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* === RECENT ACTIVITY === */}
      <h3>🕒 Actividades Recientes</h3>

      <div className="recent-history">
        {recentMovements.length === 0 ? (
          <p className="no-results">No hay movimientos recientes</p>
        ) : (
          recentMovements.map((m, i) => (
            <div key={m.id_movement || i} className="history-item">
              <div className="history-header">
                <strong>📘 {m.volume_name}</strong>
                <small>
                  {new Date(m.created_at).toLocaleString("es-ES")}
                </small>
              </div>

              <div className="history-body">
                {m.type === "OUT" ? (
                  <span>📤 Prestado a: <strong>{m.borrowed_by}</strong></span>
                ) : (
                  <span>📥 Devuelto por: <strong>{m.returned_by}</strong></span>
                )}
              </div>

              {m.observations && (
                <p className="history-observation">
                  {m.observations}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

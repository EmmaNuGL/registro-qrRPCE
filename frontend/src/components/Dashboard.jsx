import React, { useEffect, useState } from "react";
import "../style-custom.css";

export default function Dashboard({ books = [], history = [] }) {
  const [stats, setStats] = useState({
    totalBooks: 0,
    archivedBooks: 0,
    inUseBooks: 0,
    todayMovements: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // 📊 Calcular estadísticas de forma segura y controlada
  useEffect(() => {
    if (!Array.isArray(books) || !Array.isArray(history)) return;

    const total = books?.length || 0;
    const archived = books.filter((b) => b?.status === "En archivos").length;
    const inUse = books.filter((b) => b?.status === "En uso").length;

    const today = new Date().toLocaleDateString("es-ES");
    const todayMoves = history.filter(
      (h) => h?.date && new Date(h.date).toLocaleDateString("es-ES") === today
    ).length;

    // Solo actualiza si los valores realmente cambian
    setStats((prev) => {
      const newStats = {
        totalBooks: total,
        archivedBooks: archived,
        inUseBooks: inUse,
        todayMovements: todayMoves,
      };
      return JSON.stringify(prev) !== JSON.stringify(newStats)
        ? newStats
        : prev;
    });
  }, [books?.length, history?.length]);

  // 🔍 Búsqueda rápida
  const handleQuickSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setResults([]);
      return;
    }

    const filtered = books.filter((b) => {
      const year = b.year?.toString().toLowerCase() || "";
      const tome = b.tome?.toString().toLowerCase() || "";
      const type = b.type?.toLowerCase() || "";
      const regFrom = b.registryFrom?.toString() || "";
      const regTo = b.registryTo?.toString() || "";
      return (
        year.includes(term) ||
        tome.includes(term) ||
        type.includes(term) ||
        regFrom.includes(term) ||
        regTo.includes(term)
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

      {/* === BOTONES DE ACCIÓN === */}
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/admin/escaneo")}
        >
          📱 Escaneo Rápido
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/admin/libros")}
        >
          📖 Ver Libros
        </button>
        <button
          className="btn btn-success"
          onClick={() => (window.location.href = "/admin/libros")}
        >
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

      <div id="quickSearchResults" className="quick-results">
        {results.length === 0 && searchTerm !== "" ? (
          <p className="no-results">No se encontraron resultados</p>
        ) : (
          results.map((b, i) => (
            <div key={i} className="book-preview">
              <strong>
                📘 {b.year} — Libro {b.tome}
              </strong>
              <p>
                Tipo: {b.type || "—"} <br />
                Rango: {b.registryFrom} - {b.registryTo}
              </p>
              <span
                className={`status-tag ${
                  b.status === "En uso" ? "inuse" : "archived"
                }`}
              >
                {b.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

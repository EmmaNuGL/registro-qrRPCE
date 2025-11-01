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

  // 📊 Calcular estadísticas generales
  useEffect(() => {
    const total = books.length;
    const archived = books.filter((b) => b.status === "En archivos").length;
    const inUse = books.filter((b) => b.status === "En uso").length;

    const today = new Date().toLocaleDateString("es-ES");
    const todayMoves = history.filter(
      (h) => new Date(h.date).toLocaleDateString("es-ES") === today
    ).length;

    setStats({
      totalBooks: total,
      archivedBooks: archived,
      inUseBooks: inUse,
      todayMovements: todayMoves,
    });
  }, [books, history]);

  // 🔍 Búsqueda rápida de libros
  const handleQuickSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = books.filter(
      (b) =>
        b.year.toString().includes(term) ||
        b.tome.toString().includes(term) ||
        (b.type && b.type.toLowerCase().includes(term)) ||
        (b.registryFrom && b.registryFrom.toString().includes(term)) ||
        (b.registryTo && b.registryTo.toString().includes(term))
    );
    setResults(filtered);
  };

  return (
    <div className="page dashboard">
      <h2>📊 Panel Principal</h2>

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
        <button className="btn btn-primary" onClick={() => (window.location.href = "/scanner")}>
          📱 Escaneo Rápido
        </button>
        <button className="btn btn-secondary" onClick={() => (window.location.href = "/libros")}>
          📖 Ver Libros
        </button>
        <button className="btn btn-success" onClick={() => alert("Abrir formulario de libro")}>
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
              <span className={`status-tag ${b.status === "En uso" ? "inuse" : "archived"}`}>
                {b.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "../style-custom.css";
import { getBooks } from "../services/booksService";

export default function Dashboard() {
  const [booksData, setBooksData] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    archivedBooks: 0,
    inUseBooks: 0,
    todayMovements: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // 📥 Cargar libros desde el backend
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

  // 📊 Calcular estadísticas
  useEffect(() => {
    if (!Array.isArray(booksData)) return;

    const total = booksData.length;
    const archived = booksData.filter(
      (b) => b.status === "En archivos"
    ).length;
    const inUse = booksData.filter((b) => b.status === "En uso").length;

    setStats({
      totalBooks: total,
      archivedBooks: archived,
      inUseBooks: inUse,
      todayMovements: 0, // se conectará luego con historial
    });
  }, [booksData]);

  // 🔍 Búsqueda rápida
  const handleQuickSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setResults([]);
      return;
    }

    const filtered = booksData.filter((b) => {
      const year = b.year?.toString().toLowerCase() || "";
      const tome = b.tome?.toLowerCase() || "";
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

      <div className="quick-results">
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

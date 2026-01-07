import React, { useEffect, useState } from "react";
import "../style-custom.css";
import { getBooks } from "../services/booksService";
import { getHistory } from "../services/historyService";

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
    const archived = booksData.filter(b => b.status === "En archivos").length;
    const inUse = booksData.filter(b => b.status === "En uso").length;

    setStats({
      totalBooks: total,
      archivedBooks: archived,
      inUseBooks: inUse,
      todayMovements: 0, // luego se conecta real
    });
  }, [booksData]);

  /* =====================
     🕒 MINI HISTORIAL (SEGURO)
  ===================== */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getHistory();
        const ordered = (res.data || [])
          .sort((a, b) => new Date(b.date) - new Date(a.date))
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
              <strong>📘 {b.year} — Libro {b.tome}</strong>
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

      {/* === MINI HISTORIAL === */}
      <h3 style={{ marginTop: "30px" }}>🕒 Actividad Reciente</h3>

      {recentHistory.length === 0 ? (
        <p className="no-results">Aún no hay movimientos registrados</p>
      ) : (
        <div className="history-preview">
          {recentHistory.map((h, i) => (
            <div key={i} className="history-item">
              <strong>{h.action}</strong>
              <p>
                📘 {h.year} — Tomo {h.tome} <br />
                👤 {h.user || "Sistema"} <br />
                🕒 {new Date(h.date).toLocaleString("es-ES")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

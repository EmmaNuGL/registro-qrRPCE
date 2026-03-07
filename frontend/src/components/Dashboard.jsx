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

      const ordered = (res.data || []).sort(
        (a, b) => new Date(b.date_time) - new Date(a.date_time)
      );

      setMovements(ordered);

    } catch (error) {
      console.warn("⚠️ Movements not available yet");
    }
  };

  useEffect(() => {

    const total = books.length;

    const archived = books.filter(
      b => b.status === "ARCHIVED"
    ).length;

    const inUse = books.filter(
      b => b.status === "IN_USE"
    ).length;

    const today = new Date().toDateString();

    const todayMoves = movements.filter(
      m => new Date(m.date_time).toDateString() === today
    ).length;

    setStats({
      totalBooks: total,
      archivedBooks: archived,
      inUseBooks: inUse,
      todayMovements: todayMoves,
    });

  }, [books, movements]);

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

  const recentMovements = movements.slice(0, 5);

  return (

    <div className="dashboard-container">

      <h2 className="dashboard-title">📊 Panel Principal</h2>

      {/* === STATISTICS === */}

      <div className="stats-grid-modern">

        <div className="stat-card-modern">
          <div className="stat-number-modern">{stats.totalBooks}</div>
          <div className="stat-label-modern">Total de Libros</div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-number-modern">{stats.archivedBooks}</div>
          <div className="stat-label-modern">En Archivo</div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-number-modern">{stats.inUseBooks}</div>
          <div className="stat-label-modern">En Uso</div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-number-modern">{stats.todayMovements}</div>
          <div className="stat-label-modern">Movimientos Hoy</div>
        </div>

      </div>

      {/* === ACTIONS === */}

      <div className="action-buttons-modern">

        <button
          className="action-btn primary"
          onClick={() => window.location.href = "/admin/escaneo"}
        >
          📱 Escaneo Rápido
        </button>

        <button
          className="action-btn secondary"
          onClick={() => window.location.href = "/admin/libros"}
        >
          📖 Gestión de Libros
        </button>

      </div>

      {/* === QUICK SEARCH === */}

      <div className="dashboard-section">

        <h3>🔍 Consulta Rápida</h3>

        <input
          type="text"
          className="search-bar-modern"
          placeholder="Buscar por QR, tomo, año o registro..."
          value={searchTerm}
          onChange={handleQuickSearch}
        />

        <div className="quick-results-modern">

          {results.length === 0 && searchTerm !== "" ? (

            <p className="no-results">No se encontraron resultados</p>

          ) : (

            results.map((b, i) => (

              <div key={i} className="book-preview-modern">

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
                  {b.status === "IN_USE"
                    ? "EN USO"
                    : "ARCHIVO"}
                </span>

              </div>

            ))

          )}

        </div>

      </div>

      {/* === RECENT ACTIVITY === */}

      <div className="dashboard-section">

        <h3>🕒 Actividades Recientes</h3>

        <div className="recent-history-modern">

          {recentMovements.length === 0 ? (

            <p className="no-results">
              No hay movimientos recientes
            </p>

          ) : (

            recentMovements.map((m, i) => (

              <div
                key={m.id_movement || i}
                className="history-item-modern"
              >

                <div className="history-header-modern">

                  <strong>📘 {m.volume_name}</strong>

                  <small>
                    {new Date(m.date_time)
                      .toLocaleString("es-ES")}
                  </small>

                </div>

                <div className="history-body-modern">

                  {m.action === "Retiro" ? (

                    <span>
                      📤 Prestado a:
                      <strong> {m.person}</strong>
                    </span>

                  ) : m.action === "Devolución" ? (

                    <span>
                      📥 Devuelto por:
                      <strong> {m.person}</strong>
                    </span>

                  ) : (

                    <span>
                      {m.action}
                    </span>

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

    </div>

  );

}
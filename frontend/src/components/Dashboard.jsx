import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    archived: 0,
    inUse: 0,
    todayMovements: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // 📊 Cargar estadísticas iniciales
  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/books");
      const today = new Date().toLocaleDateString();
      const total = data.length;
      const archived = data.filter((b) => b.status === "En archivos").length;
      const inUse = data.filter((b) => b.status === "En uso").length;

      setStats({
        total,
        archived,
        inUse,
        todayMovements: Math.floor(Math.random() * 4),
      });
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/history");
      setRecentActivity(data.slice(0, 5));
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  // 🔍 Búsqueda rápida
  const handleQuickSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    try {
      const { data } = await axios.get("http://localhost:4000/api/books");
      const filtered = data.filter(
        (b) =>
          b.year.toString().includes(term) ||
          b.tome.toString().includes(term) ||
          (b.registryFrom && b.registryFrom.toString().includes(term)) ||
          (b.registryTo && b.registryTo.toString().includes(term))
      );
      setFilteredBooks(filtered);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Panel Principal</h2>

      {/* Tarjetas estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div>Total de Libros</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.archived}</div>
          <div>En Archivos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inUse}</div>
          <div>En Uso</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.todayMovements}</div>
          <div>Movimientos Hoy</div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="action-buttons">
        <Link to="/scanner" className="btn btn-primary">
          📱 Escaneo Rápido
        </Link>
        <Link to="/libros" className="btn btn-secondary">
          📖 Ver Libros
        </Link>
        <Link to="/libros" className="btn btn-success">
          ➕ Agregar Libro
        </Link>
      </div>

      {/* Búsqueda rápida */}
      <h3>🔍 Consulta Rápida de Libros</h3>
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar libro por año, tomo, registro..."
        value={searchTerm}
        onChange={handleQuickSearch}
      />

      {/* Resultados */}
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          marginBottom: "20px",
          background: "#fff",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        {filteredBooks.length === 0 ? (
          <p style={{ color: "#888" }}>No se encontraron resultados</p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book._id} className="search-result">
              <strong>
                {book.year} - Tomo {book.tome} ({book.status})
              </strong>
              <div>
                Rango: {book.registryFrom} - {book.registryTo}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Libros vencidos */}
      {overdueBooks.length > 0 && (
        <div className="overdue-alert">
          <h4>🚨 Libros Vencidos (más de 24 horas)</h4>
          <ul>
            {overdueBooks.map((book) => (
              <li key={book._id}>{book.title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actividad reciente */}
      <h3>Actividad Reciente</h3>
      <div className="recent-activity">
        {recentActivity.length === 0 ? (
          <p>No hay movimientos recientes</p>
        ) : (
          recentActivity.map((act, idx) => (
            <div key={idx} className="activity-item">
              <strong>{act.action}</strong> — {act.book}
              <div style={{ fontSize: "12px", color: "#777" }}>
                {new Date(act.date).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

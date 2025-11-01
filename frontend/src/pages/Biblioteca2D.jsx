import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Biblioteca2D() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/books");
      setBooks(data);
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  };

  const filteredBooks = books.filter((b) => {
    const textMatch =
      b.year.toString().includes(searchTerm) ||
      b.tome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.registryFrom &&
        b.registryFrom.toString().includes(searchTerm)) ||
      (b.registryTo && b.registryTo.toString().includes(searchTerm)) ||
      (b.type && b.type.toLowerCase().includes(searchTerm.toLowerCase()));

    const statusMatch =
      filterStatus === "todos" ||
      b.status.toLowerCase() === filterStatus.toLowerCase();

    return textMatch && statusMatch;
  });

  return (
    <div className="biblioteca2d-container">
      <h2>📚 Biblioteca Virtual 2D</h2>
      <p className="desc">
        Vista en modo solo lectura de los libros registrados en el sistema.
      </p>

      {/* Filtros */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Buscar libro por año, tomo o tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="en uso">En uso</option>
          <option value="en archivos">En archivos</option>
        </select>
      </div>

      {/* Cuadrícula de libros */}
      <div className="biblioteca-grid">
        {filteredBooks.length === 0 ? (
          <p className="no-results">No se encontraron libros.</p>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book._id}
              className={`book-card status-${book.status
                .toLowerCase()
                .replace(" ", "_")}`}
            >
              <h3>{book.tome}</h3>
              <p>
                <strong>Año:</strong> {book.year}
              </p>
              <p>
                <strong>Desde:</strong> {book.registryFrom} —{" "}
                <strong>Hasta:</strong> {book.registryTo}
              </p>
              <p>
                <strong>Tipo:</strong> {book.type}
              </p>
              <p>
                <strong>Estado:</strong> {book.status}
              </p>
              {book.status === "en uso" && (
                <p>
                  <strong>En posesión de:</strong>{" "}
                  {book.currentHolder || "Desconocido"}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

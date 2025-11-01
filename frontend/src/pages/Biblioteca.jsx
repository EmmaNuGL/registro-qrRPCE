import React, { useState, useEffect } from "react";
import { logoutUser } from "../utils/sessionManager";

export default function Biblioteca() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulación de libros, luego se reemplaza por datos reales desde backend
    const sampleBooks = [
      {
        id: 1,
        year: "1998",
        tome: "Tomo A",
        registryFrom: "001",
        registryTo: "050",
        status: "En uso",
        currentHolder: "Juan Pérez",
      },
      {
        id: 2,
        year: "2000",
        tome: "Tomo B",
        registryFrom: "051",
        registryTo: "100",
        status: "En archivos",
        currentHolder: null,
      },
    ];
    setBooks(sampleBooks);
  }, []);

  const filteredBooks = books.filter(
    (b) =>
      b.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.currentHolder &&
        b.currentHolder.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="library-container">
      <header className="library-header">
        <h2>📚 Biblioteca Virtual — Registro de la Propiedad</h2>
        <button className="logout-btn" onClick={logoutUser}>
          🚪 Cerrar Sesión
        </button>
      </header>

      <div className="library-search">
        <input
          type="text"
          placeholder="Buscar por año, tomo o responsable..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="library-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
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
                <strong>Estado:</strong> {book.status}
              </p>
              {book.status === "En uso" && (
                <p>
                  <strong>En posesión de:</strong> {book.currentHolder}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">No se encontraron libros.</p>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";

export default function Biblioteca() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  useEffect(() => {
    // Simulación de datos
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

  const filteredBooks = books.filter((b) => {
    const matchesText =
      b.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.currentHolder &&
        b.currentHolder.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "Todos" ||
      b.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesText && matchesStatus;
  });

  return (
    <div className="biblioteca-view">
      <h2 style={{ color: "#2b4eff" }}>📚 Biblioteca 2D — Vista de Solo Lectura</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          margin: "1rem 0",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por año, tomo, registro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          <option value="Todos">Todos</option>
          <option value="En uso">En uso</option>
          <option value="En archivos">En archivos</option>
        </select>
      </div>

      <div
        style={{
          background: "#eaf2ff",
          borderRadius: "10px",
          padding: "10px 15px",
          color: "#444",
          marginBottom: "15px",
        }}
      >
        <strong>Vista de Solo Lectura:</strong>{" "}
        <span style={{ color: "green" }}>🟢 En Archivos</span> |{" "}
        <span style={{ color: "red" }}>🔴 En Uso</span> | Haz clic para ver detalles
      </div>

      <div
        className="book-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                padding: "1rem",
                borderLeft: `6px solid ${
                  book.status === "En uso" ? "#e63946" : "#2b9348"
                }`,
              }}
            >
              <h3 style={{ margin: "0 0 5px 0" }}>{book.tome}</h3>
              <p style={{ margin: 0 }}>
                <strong>Año:</strong> {book.year}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Desde:</strong> {book.registryFrom} —{" "}
                <strong>Hasta:</strong> {book.registryTo}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Estado:</strong> {book.status}
              </p>
              {book.status === "En uso" && (
                <p style={{ margin: 0 }}>
                  <strong>En posesión de:</strong> {book.currentHolder}
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>
            No se encontraron libros.
          </p>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import AddBookModal from "./modals/AddBookModal";
import EditBookModal from "./modals/EditBookModal";
import ViewQRModal from "./modals/ViewQRModal";

import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/booksService";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);

  // ===============================
  // 🔹 CARGA INICIAL
  // ===============================
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Error cargando libros", err);
    }
  };

  // ===============================
  // 🔍 FILTRO AVANZADO
  // ===============================
  const filteredBooks = books.filter((b) => {
    const term = searchTerm.toLowerCase();

    // 🔎 Coincidencias de texto
    const matchVolume = b.volume_name?.toLowerCase().includes(term);
    const matchYear = b.year?.toString().includes(term);

    // 🔎 Búsqueda por rango de registros
    const registerFrom = Number(b.register_from);
    const registerTo = Number(b.register_to);
    const searchNumber = Number(term);

    const matchRegister =
      !isNaN(searchNumber) &&
      searchNumber >= registerFrom &&
      searchNumber <= registerTo;

    const matchText = matchVolume || matchYear || matchRegister;

    // 🔎 Filtro por estado
    const matchStatus =
      filterStatus === "todos" || b.status === filterStatus;

    return matchText && matchStatus;
  });

  // ===============================
  // ➕ AGREGAR
  // ===============================
  const handleAddBook = async (newBook) => {
    try {
      const res = await createBook(newBook);
      setBooks([res.data, ...books]);
      alert("✅ Libro guardado correctamente");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Error al guardar libro");
    }
  };

  // ===============================
  // ✏️ EDITAR
  // ===============================
  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedBook) => {
    try {
      const res = await updateBook(updatedBook.id_book, updatedBook);
      setBooks(
        books.map((b) =>
          b.id_book === res.data.id_book ? res.data : b
        )
      );
    } catch {
      alert("❌ Error al actualizar libro");
    }
  };

  // ===============================
  // 🔄 CAMBIAR ESTADO
  // ===============================
  const toggleStatus = async (book) => {
    const newStatus = book.status === "ARCHIVED" ? "IN_USE" : "ARCHIVED";

    try {
      const res = await updateBook(book.id_book, {
        ...book,
        status: newStatus,
      });

      setBooks(
        books.map((b) =>
          b.id_book === book.id_book ? res.data : b
        )
      );
    } catch {
      alert("❌ Error al cambiar estado");
    }
  };

  // ===============================
  // 🗑️ ELIMINAR
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este libro?")) return;
    try {
      await deleteBook(id);
      setBooks(books.filter((b) => b.id_book !== id));
    } catch {
      alert("❌ Error al eliminar");
    }
  };

  // ===============================
  // 📦 UI
  // ===============================
  return (
    <div className="books-container">
      <div className="books-toolbar">
        <input
          type="text"
          placeholder="Buscar por tomo, año o número de registro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="ARCHIVED">Archivo</option>
          <option value="IN_USE">En uso</option>
        </select>

        <span>📚 {filteredBooks.length} libros</span>
      </div>

      <div className="action-buttons">
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          ➕ Agregar libro
        </button>
        <button
          className="btn-vista"
          onClick={() => (window.location.href = "/admin/biblioteca-2d")}
        >
          📚 Vista Biblioteca 2D
        </button>
        <button className="btn-export" onClick={() => console.log("Exportar Lista")}>
          📤 Exportar Lista
        </button>
        <button className="btn-qr" onClick={() => console.log("Exportar Etiquetas QR")}>
          🏷️ Exportar Etiquetas QR
        </button>
      </div>

      <div className="books-grid">
        {filteredBooks.length ? (
          filteredBooks.map((b) => (
            <div
              key={b.id_book}
              className={`book-card ${
                b.status === "IN_USE" ? "status-uso" : "status-archivo"
              }`}
            >
              <h3>
                {b.volume_name} <small>Tomo {b.volume_number}</small>
              </h3>

              <p><strong>Registro:</strong> {b.register_from} – {b.register_to}</p>
              <p><strong>Año:</strong> {b.year}</p>

              {b.observations && (
                <p><strong>Obs:</strong> {b.observations}</p>
              )}

              <p>
                <strong>Estado:</strong>{" "}
                {b.status === "ARCHIVED" ? "📦 En archivo" : "📖 En uso"}
              </p>

              {/* 👤 PERSONA QUE TIENE EL LIBRO */}
              {b.status === "IN_USE" && b.borrower_name && (
                <p className="borrower">
                  <strong>Prestado a:</strong> {b.borrower_name}
                </p>
              )}

              <p className="date">
                <strong>Creado:</strong>{" "}
                {new Date(b.created_at).toLocaleDateString()}
              </p>

              <div className="book-actions">
                <button onClick={() => toggleStatus(b)}>🔄</button>
                <button onClick={() => setViewingBook(b)}>🔍 QR</button>
                <button onClick={() => handleEdit(b)}>✏️</button>
                <button onClick={() => handleDelete(b.id_book)}>🗑️</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay libros registrados</p>
        )}
      </div>

      <AddBookModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddBook}
      />

      <EditBookModal
        show={showEditModal}
        book={selectedBook}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
      />

      {viewingBook && (
        <ViewQRModal
          book={viewingBook}
          onClose={() => setViewingBook(null)}
        />
      )}
    </div>
  );
}

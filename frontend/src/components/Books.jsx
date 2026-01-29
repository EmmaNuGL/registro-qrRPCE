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
    const loadBooks = async () => {
      try {
        const res = await getBooks();
        setBooks(res.data);
      } catch (err) {
        console.error("Error cargando libros", err);
      }
    };
    loadBooks();
  }, []);

  // ===============================
  // 🔹 FILTRO
  // ===============================
  const filteredBooks = books.filter((b) => {
    const matchText =
      b.year?.toString().includes(searchTerm) ||
      b.volume_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id_book?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "todos" || b.status === filterStatus;

    return matchText && matchStatus;
  });

  // ===============================
  // ✅ AGREGAR LIBRO
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
  // 🗑️ ELIMINAR
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este libro?")) return;
    try {
      await deleteBook(id);
      setBooks(books.filter((b) => b.id_book !== id));
      alert("🗑️ Libro eliminado");
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
          placeholder="Buscar libro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="ARCHIVED">Archivado</option>
          <option value="IN_USE">En uso</option>
        </select>

        <p>Mostrando {filteredBooks.length}</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => setShowAddModal(true)}>
          ➕ Agregar Libro
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
              <h3>{b.volume_name}</h3>
              <p><strong>ID:</strong> {b.id_book}</p>
              <p><strong>Año:</strong> {b.year}</p>
              <p><strong>Estado:</strong> {b.status}</p>

              <div className="book-actions">
                <button onClick={() => setViewingBook(b)}>🔍 QR</button>
                <button onClick={() => handleEdit(b)}>✏️</button>
                <button onClick={() => handleDelete(b.id_book)}>🗑️</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay libros</p>
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

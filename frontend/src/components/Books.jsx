import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import AddBookModal from "./modals/AddBookModal";
import EditBookModal from "./modals/EditBookModal";
import ViewQRModal from "./modals/ViewQRModal";

// import { addHistory } from "../utils/historyStorage"; // Removed local history

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
  // 🔹 CARGA INICIAL (MongoDB → LocalStorage)
  // ===============================
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await getBooks();
        setBooks(res.data);
        localStorage.setItem("books", JSON.stringify(res.data));
      } catch {
        const local = JSON.parse(localStorage.getItem("books")) || [];
        setBooks(local);
      }
    };
    loadBooks();
  }, []);

  // ===============================
  // 🔹 FILTRO
  // ===============================
  const filteredBooks = books.filter((b) => {
    const matchText =
      b.anio?.toString().includes(searchTerm) ||
      b.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ubicacion?.toLowerCase().includes(searchTerm);

    const matchStatus =
      filterStatus === "todos" ||
      b.estado?.toLowerCase() === filterStatus.toLowerCase();

    return matchText && matchStatus;
  });

  // ===============================
  // ✅ AGREGAR LIBRO
  // ===============================
  const handleAddBook = async (newBook) => {
    try {
      const res = await createBook(newBook);
      const updated = [res.data, ...books];
      setBooks(updated);
      localStorage.setItem("books", JSON.stringify(updated));
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
      const res = await updateBook(updatedBook.id_libro, updatedBook);
      const updated = books.map((b) =>
        b.id_libro === res.data.id_libro ? res.data : b
      );
      setBooks(updated);
      localStorage.setItem("books", JSON.stringify(updated));
    } catch {
      console.error("Error al actualizar libro");
    }
  };

  // ===============================
  // 🗑️ ELIMINAR
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este libro?")) return;
    try {
      await deleteBook(id);
      const updated = books.filter((b) => b.id_libro !== id);
      setBooks(updated);
      localStorage.setItem("books", JSON.stringify(updated));
      alert("🗑️ Libro eliminado");
    } catch {
      alert("❌ Error al eliminar");
    }
  };

  // ===============================
  // 🔄 CAMBIAR ESTADO + HISTORIAL
  // ===============================
 const handleChangeStatus = async (book) => {
  const newStatus = book.estado === "EN_USO" ? "DISPONIBLE" : "EN_USO";

  const updatedBook = {
    ...book,
    estado: newStatus,
  };

  await handleSaveEdit(updatedBook);
  // Note: History is now handled by backend movements, but this is a manual status change.
  // Ideally, use the movement endpoint, but for quick edit we keep updateBook.
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
          <option value="EN_USO">En uso</option>
          <option value="DISPONIBLE">Disponible</option>
        </select>
        <p>Mostrando {filteredBooks.length}</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => setShowAddModal(true)}>➕ Agregar Libro</button>
      </div>

      <div className="books-grid">
        {filteredBooks.length ? (
          filteredBooks.map((b) => (
            <div
              key={b.id_libro}
              className={`book-card ${
                b.estado === "EN_USO" ? "status-uso" : "status-archivo"
              }`}
            >
              <h3>{b.titulo}</h3>
              <p><strong>Año:</strong> {b.anio}</p>
              <p>
                <strong>Ubicación:</strong> {b.ubicacion}
              </p>
              <p><strong>Estado:</strong> {b.estado}</p>

              <div className="book-actions">
                <button onClick={() => setViewingBook(b)}>🔍 QR</button>
                <button onClick={() => handleEdit(b)}>✏️</button>
                <button onClick={() => handleDelete(b.id_libro)}>🗑️</button>
                {/* <button onClick={() => handleChangeStatus(b)}>🔄</button> Use Scanner for movements */}
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

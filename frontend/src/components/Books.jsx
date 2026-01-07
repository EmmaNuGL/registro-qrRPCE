import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import AddBookModal from "./modals/AddBookModal";
import EditBookModal from "./modals/EditBookModal";
import ViewQRModal from "./modals/ViewQRModal";

import { addHistory } from "../utils/historyStorage";

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
      b.year?.toString().includes(searchTerm) ||
      b.tome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.registryFrom?.toString().includes(searchTerm) ||
      b.registryTo?.toString().includes(searchTerm);

    const matchStatus =
      filterStatus === "todos" ||
      b.status?.toLowerCase() === filterStatus.toLowerCase();

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
      addHistory({
        type: "CREAR_LIBRO",
        bookId: res.data._id,
        tome: res.data.tome,
        year: res.data.year,
        registryFrom: res.data.registryFrom,
        registryTo: res.data.registryTo,
        description: "Libro agregado al sistema",
        date: new Date().toISOString(),
      });
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
      const res = await updateBook(updatedBook._id, updatedBook);
      const updated = books.map((b) =>
        b._id === res.data._id ? res.data : b
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
      const updated = books.filter((b) => b._id !== id);
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
  const newStatus = book.status === "En uso" ? "En archivos" : "En uso";

  const updatedBook = {
    ...book,
    status: newStatus,
  };

  await handleSaveEdit(updatedBook);

  addHistory({
    type: "CAMBIO_ESTADO",
    bookId: book._id,
    tome: book.tome,
    year: book.year,
    registryFrom: book.registryFrom,
    registryTo: book.registryTo,
    description: `Estado cambiado de "${book.status}" a "${newStatus}"`,
    previousStatus: book.status,
    newStatus: newStatus,
    date: new Date().toISOString(),
  });
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
          <option value="En uso">En uso</option>
          <option value="En archivos">En archivos</option>
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
              key={b._id}
              className={`book-card ${
                b.status === "En uso" ? "status-uso" : "status-archivo"
              }`}
            >
              <h3>{b.tome}</h3>
              <p><strong>Año:</strong> {b.year}</p>
              <p>
                <strong>Registros:</strong> {b.registryFrom} – {b.registryTo}
              </p>
              <p><strong>Estado:</strong> {b.status}</p>

              <div className="book-actions">
                <button onClick={() => setViewingBook(b)}>🔍 QR</button>
                <button onClick={() => handleEdit(b)}>✏️</button>
                <button onClick={() => handleDelete(b._id)}>🗑️</button>
                <button onClick={() => handleChangeStatus(b)}>🔄</button>
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

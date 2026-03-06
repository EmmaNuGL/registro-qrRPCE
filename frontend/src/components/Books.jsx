import React, { useState, useEffect } from "react";
import AddBookModal from "./Modals/AddBookModal";
import EditBookModal from "./Modals/EditBookModal";
import ViewQRModal from "./Modals/ViewQRModal";
import LoanModal from "./Modals/LoanModal";

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
  const [loanBook, setLoanBook] = useState(null);

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

    const matchVolume = b.volume_name?.toLowerCase().includes(term);
    const matchYear = b.year?.toString().includes(term);

    const registerFrom = Number(b.register_from);
    const registerTo = Number(b.register_to);
    const searchNumber = Number(term);

    const matchRegister =
      !isNaN(searchNumber) &&
      searchNumber >= registerFrom &&
      searchNumber <= registerTo;

    const matchText = matchVolume || matchYear || matchRegister;

    const matchStatus =
      filterStatus === "todos" || b.status === filterStatus;

    return matchText && matchStatus;
  });

  // ===============================
  // ➕ AGREGAR LIBRO
  // ===============================
  const handleAddBook = async (newBook) => {
    try {

      const res = await createBook(newBook);

      setBooks((prev) => [res.data, ...prev]);

      setShowAddModal(false); // 🔥 cerrar modal automáticamente

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

      setBooks((prev) =>
        prev.map((b) =>
          b.id_book === res.data.id_book ? res.data : b
        )
      );

      setShowEditModal(false);

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

      setBooks((prev) =>
        prev.filter((b) => b.id_book !== id)
      );

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

        <button
          className="btn-add"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Agregar libro
        </button>

        <button
          className="btn-vista"
          onClick={() => (window.location.href = "/admin/biblioteca-2d")}
        >
          📚 Vista Biblioteca 2D
        </button>

        <button className="btn-export">
          📤 Exportar Lista
        </button>

        <button className="btn-qr">
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

              <p>
                <strong>Registro:</strong> {b.register_from} – {b.register_to}
              </p>

              <p>
                <strong>Año:</strong> {b.year}
              </p>

              {b.observations && (
                <p>
                  <strong>Obs:</strong> {b.observations}
                </p>
              )}

              <p>
                <strong>Estado:</strong>{" "}
                {b.status === "ARCHIVED"
                  ? "📦 En archivo"
                  : "📖 En uso"}
              </p>

              <p className="date">
                <strong>Creado:</strong>{" "}
                {new Date(b.created_at).toLocaleDateString()}
              </p>

              <div className="book-actions">

                <button onClick={() => setLoanBook(b)}>
                  🔄
                </button>

                <button onClick={() => setViewingBook(b)}>
                  🔍 QR
                </button>

                <button onClick={() => handleEdit(b)}>
                  ✏️
                </button>

                <button onClick={() => handleDelete(b.id_book)}>
                  🗑️
                </button>

              </div>

            </div>

          ))

        ) : (
          <p>No hay libros registrados</p>
        )}

      </div>

      {/* 🔹 MODAL AGREGAR */}
      {showAddModal && (
        <AddBookModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddBook}
        />
      )}

      {/* 🔹 MODAL EDITAR */}
      {showEditModal && (
        <EditBookModal
          show={showEditModal}
          book={selectedBook}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* 🔹 VER QR */}
      {viewingBook && (
        <ViewQRModal
          book={viewingBook}
          onClose={() => setViewingBook(null)}
        />
      )}

      {/* 🔥 MODAL PRÉSTAMO / DEVOLUCIÓN */}
      {loanBook && (
        <LoanModal
          book={loanBook}
          onClose={() => setLoanBook(null)}
          onSuccess={loadBooks}
        />
      )}

    </div>
  );
}
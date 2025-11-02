import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Corrección: uso correcto del componente
import AddBookModal from "./modals/AddBookModal";
import EditBookModal from "./modals/EditBookModal";
import ViewQRModal from "./modals/ViewQRModal";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);

  // === FILTRAR LIBROS ===
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

  // === FUNCIÓN: AGREGAR LIBRO ===
  const handleAddBook = (newBook) => {
    const exists = books.find((b) => b.qr === newBook.qr);
    if (exists) {
      alert("⚠️ El código QR ya está registrado.");
      return;
    }
    setBooks((prev) => [...prev, { ...newBook, _id: Date.now().toString() }]);
    alert("✅ Libro agregado correctamente.");
  };

  // === FUNCIÓN: EDITAR LIBRO ===
  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedBook) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
    );
    alert("✅ Libro actualizado con éxito.");
  };

  // === FUNCIÓN: ELIMINAR LIBRO ===
  const handleDelete = (bookId) => {
    if (!window.confirm("¿Deseas eliminar este libro?")) return;
    const book = books.find((b) => b._id === bookId);
    if (!book) return alert("Libro no encontrado.");
    const updated = books.filter((b) => b._id !== bookId);
    setBooks(updated);
    alert(`📕 Libro '${book.tome}' eliminado correctamente.`);
  };

  // === FUNCIÓN: VER QR ===
  const handleViewQR = (book) => {
    setViewingBook(book);
  };

  // === FUNCIÓN: DESCARGAR QR ===
  const handleDownloadQR = (book) => {
    // Creamos un canvas temporal para renderizar el QR
    const qrCanvas = document.createElement("canvas");
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const qrCode = (
      <QRCodeCanvas value={book.qr} size={200} includeMargin={true} />
    );

    // Renderizamos temporalmente el QR en el DOM oculto
    const qrEl = document.createElement("div");
    tempDiv.appendChild(qrEl);
    const ctx = qrCanvas.getContext("2d");
    const img = new Image();
    img.src = qrCanvas.toDataURL();

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `${book.tome}-${book.year}.png`;
      link.href = qrCanvas.toDataURL();
      link.click();
      document.body.removeChild(tempDiv);
    };
  };

  // === FUNCIÓN: CAMBIAR ESTADO ===
  const handleChangeStatus = (bookId) => {
    const updated = books.map((b) => {
      if (b._id === bookId) {
        const newStatus = b.status === "En uso" ? "En archivos" : "En uso";
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBooks(updated);
  };

  // === FUNCIONES AUXILIARES ===
  const handleExportBooks = () => {
    alert("📤 Exportar lista (pendiente conectar con backend o Excel).");
  };

  const handleImportBooks = () => {
    alert("📥 Importar lote (pendiente conectar con backend).");
  };

  const showLibrary2D = () => {
    alert("📚 Vista 2D (pendiente integrar con componente 3D Canvas).");
  };

  // === INTERFAZ VISUAL ===
  return (
    <div className="books-container">
      {/* === BARRA DE BÚSQUEDA Y FILTROS === */}
      <div className="books-toolbar">
        <input
          type="text"
          placeholder="Buscar libro por año, tomo o rango..."
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
        <p className="book-counter">
          Mostrando {filteredBooks.length} libro(s)
        </p>
      </div>

      {/* === BOTONES DE ACCIÓN === */}
      <div className="action-buttons">
        <button onClick={() => setShowAddModal(true)}>➕ Agregar Libro</button>
        <button onClick={showLibrary2D}>📚 Vista Biblioteca 2D</button>
        <button onClick={handleExportBooks}>📤 Exportar Lista</button>
        <button onClick={handleImportBooks}>📥 Importar Lote</button>
      </div>

      {/* === TARJETAS DE LIBROS === */}
      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((b) => (
            <div
              className={`book-card status-${b.status
                .toLowerCase()
                .replace(" ", "_")}`}
              key={b._id}
            >
              <h3>{b.type || `Libro ${b.tome}`}</h3>
              <p><strong>Año:</strong> {b.year}</p>
              <p>
                <strong>Desde:</strong> {b.registryFrom} — <strong>Hasta:</strong> {b.registryTo}
              </p>
              <p><strong>Estado:</strong> {b.status}</p>

              <div className="book-actions">
                <button onClick={() => handleViewQR(b)}>🔍 Ver QR</button>
                <button onClick={() => handleDownloadQR(b)}>⬇️ Descargar</button>
                <button onClick={() => handleEdit(b)}>✏️ Editar</button>
                <button onClick={() => handleDelete(b._id)}>🗑️ Eliminar</button>
                <button onClick={() => handleChangeStatus(b._id)}>
                  🔄 {b.status === "En uso" ? "Archivar" : "Activar"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No se encontraron libros.</p>
        )}
      </div>

      {/* === MODALES === */}
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
        <ViewQRModal book={viewingBook} onClose={() => setViewingBook(null)} />
      )}
    </div>
  );
}

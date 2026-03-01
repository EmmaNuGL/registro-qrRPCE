import React, { useState, useEffect } from "react";
import {
  createLoan,
  closeLoan,
  getActiveLoanByBook,
  forceArchive
} from "../../services/loansService";

export default function LoanModal({ book, onClose, onSuccess }) {

  const isInUse = book.status === "IN_USE";

  const [person, setPerson] = useState("");
  const [observations, setObservations] = useState("");

  const [activeLoan, setActiveLoan] = useState(null);
  const [returnedBy, setReturnedBy] = useState("");
  const [useOriginalName, setUseOriginalName] = useState(true);

  const [loadingLoan, setLoadingLoan] = useState(false);

  // 🔥 Resetear estados cuando cambia el libro
  useEffect(() => {
    setActiveLoan(null);
    setReturnedBy("");
    setUseOriginalName(true);

    if (book.status === "IN_USE") {
      loadActiveLoan();
    }
  }, [book.id_book, book.status]);

  const loadActiveLoan = async () => {
    try {
      setLoadingLoan(true);
      const res = await getActiveLoanByBook(book.id_book);
      setActiveLoan(res.data);
    } catch (err) {
      console.error("Error cargando préstamo activo:", err);
    } finally {
      setLoadingLoan(false);
    }
  };

  // ===================== PRESTAR =====================
  const handleLoan = async () => {
    if (!person.trim()) {
      alert("Debe indicar la persona");
      return;
    }

    try {
      await createLoan({
        book_id: book.id_book,
        person: person.trim(),
        observations: observations,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al prestar");
    }
  };

  // ===================== DEVOLVER NORMAL =====================
  const handleReturn = async () => {

    if (!activeLoan) {
      alert("No se encontró préstamo activo");
      return;
    }

    const finalReturnedBy = useOriginalName
      ? activeLoan.person
      : returnedBy;

    if (!finalReturnedBy || !finalReturnedBy.trim()) {
      alert("Debe indicar quién devuelve");
      return;
    }

    try {
      await closeLoan(activeLoan.id, {
        returned_by: finalReturnedBy.trim()
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al devolver");
    }
  };

  // ===================== FORZAR REGULARIZACIÓN =====================
  const handleForceArchive = async () => {
    try {
      await forceArchive({
        book_id: book.id_book
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al forzar regularización");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2>
          {isInUse ? "Devolver libro" : "Prestar libro"}
        </h2>

        <p>
          <strong>{book.volume_name}</strong> — Tomo {book.volume_number}
        </p>

        {/* ===================== PRESTAR ===================== */}
        {!isInUse && (
          <>
            <input
              type="text"
              placeholder="Persona *"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
            />

            <textarea
              placeholder="Observaciones"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />

            <button onClick={handleLoan}>
              Prestar
            </button>
          </>
        )}

        {/* ===================== DEVOLVER ===================== */}
        {isInUse && (
          <>
            {loadingLoan && (
              <p>Cargando información del préstamo...</p>
            )}

            {!loadingLoan && activeLoan && (
              <>
                <p>
                  Prestado a: <strong>{activeLoan.person}</strong>
                </p>
                {/* 🔹 Opción de devolución */}
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="useOriginalName"
                    checked={useOriginalName}
                    onChange={() => setUseOriginalName(!useOriginalName)}
                  />
                  <label htmlFor="useOriginalName">
                    Usar nombre original del préstamo
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Devuelto por *"
                  value={
                    useOriginalName
                      ? activeLoan.person
                      : returnedBy
                  }
                  disabled={useOriginalName}
                  onChange={(e) => setReturnedBy(e.target.value)}
                />

                <button onClick={handleReturn}>
                  Registrar devolución
                </button>
              </>
            )}

            {/* 🔥 Caso inconsistente */}
            {!loadingLoan && !activeLoan && (
              <>
                <p style={{ color: "red" }}>
                  No se encontró préstamo activo para este libro.
                </p>

                <button
                  style={{ backgroundColor: "#d9534f", color: "white" }}
                  onClick={handleForceArchive}
                >
                  🔧 Forzar regularización (Administrador)
                </button>
              </>
            )}
          </>
        )}

        <button onClick={onClose}>
          Cancelar
        </button>

      </div>
    </div>
  );
}
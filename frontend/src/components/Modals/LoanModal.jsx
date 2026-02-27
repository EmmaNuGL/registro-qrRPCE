import React, { useState, useEffect } from "react";
import {
  createLoan,
  closeLoan,
  getActiveLoanByBook,
} from "../../services/loansService";

export default function LoanModal({ book, onClose, onSuccess }) {

  const isInUse = book.status === "IN_USE";

  const [person, setPerson] = useState("");
  const [observations, setObservations] = useState("");

  const [activeLoan, setActiveLoan] = useState(null);
  const [returnedBy, setReturnedBy] = useState("");
  const [loadingLoan, setLoadingLoan] = useState(false);

  // 🔥 Resetear estados cuando cambia el libro
  useEffect(() => {
    setActiveLoan(null);
    setReturnedBy("");

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

  const handleLoan = async () => {
    if (!person.trim()) {
      alert("Debe indicar la persona");
      return;
    }

    try {
      await createLoan({
        book_id: book.id_book,
        person: person,
        observations: observations,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al prestar");
    }
  };

  const handleReturn = async () => {
    if (!returnedBy.trim()) {
      alert("Debe indicar quién devuelve");
      return;
    }

    if (!activeLoan) {
      alert("No se encontró préstamo activo");
      return;
    }

    try {
      await closeLoan(activeLoan.id, {
        returned_by: returnedBy,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al devolver");
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

                <input
                  type="text"
                  placeholder="Devuelto por *"
                  value={returnedBy}
                  onChange={(e) => setReturnedBy(e.target.value)}
                />

                <button onClick={handleReturn}>
                  Registrar devolución
                </button>
              </>
            )}

            {!loadingLoan && !activeLoan && (
              <p style={{ color: "red" }}>
                No se encontró préstamo activo para este libro.
              </p>
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
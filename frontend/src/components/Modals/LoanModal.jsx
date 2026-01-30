import React, { useEffect, useState } from "react";
import {
  createLoan,
  closeLoan,
  getActiveLoanByBook,
} from "../services/loansService";
import { createMovement } from "../services/movementsService";
import { updateBook } from "../services/booksService";

export default function LoanModal({ book, onClose, onSuccess }) {
  const isInUse = book.status === "IN_USE";

  // 🔹 préstamo
  const [borrowedBy, setBorrowedBy] = useState("");
  const [borrowerRole, setBorrowerRole] = useState("");
  const [loanObs, setLoanObs] = useState("");

  // 🔹 devolución
  const [activeLoan, setActiveLoan] = useState(null);
  const [samePerson, setSamePerson] = useState(true);
  const [returnedBy, setReturnedBy] = useState("");
  const [returnObs, setReturnObs] = useState("");

  // ===============================
  // 🔍 CARGAR PRÉSTAMO ACTIVO
  // ===============================
  useEffect(() => {
    if (isInUse) {
      loadActiveLoan();
    }
  }, [book]);

  const loadActiveLoan = async () => {
    try {
      const res = await getActiveLoanByBook(book.id_book);
      setActiveLoan(res.data);
    } catch {
      alert("❌ Error cargando préstamo activo");
    }
  };

  // ===============================
  // 📤 PRESTAR
  // ===============================
  const handleLoan = async () => {
    if (!borrowedBy.trim()) {
      alert("⚠️ Debes indicar quién retira el libro");
      return;
    }

    try {
      // 1️⃣ crear préstamo
      const loan = await createLoan({
        id_book: book.id_book,
        borrowed_by: borrowedBy,
        borrower_role: borrowerRole,
        observations: loanObs,
      });

      // 2️⃣ movimiento OUT
      await createMovement({
        id_book: book.id_book,
        type: "OUT",
        borrowed_by: borrowedBy,
        observations: loanObs,
      });

      // 3️⃣ actualizar libro
      await updateBook(book.id_book, {
        ...book,
        status: "IN_USE",
      });

      onSuccess();
      onClose();
    } catch {
      alert("❌ Error al prestar libro");
    }
  };

  // ===============================
  // 📥 DEVOLVER
  // ===============================
  const handleReturn = async () => {
    const finalReturnedBy = samePerson
      ? activeLoan.borrowed_by
      : returnedBy;

    if (!finalReturnedBy.trim()) {
      alert("⚠️ Debes indicar quién devuelve el libro");
      return;
    }

    try {
      // 1️⃣ cerrar préstamo
      await closeLoan(activeLoan.id_loan);

      // 2️⃣ movimiento IN
      await createMovement({
        id_book: book.id_book,
        type: "IN",
        borrowed_by: activeLoan.borrowed_by,
        returned_by: finalReturnedBy,
        observations: returnObs,
      });

      // 3️⃣ actualizar libro
      await updateBook(book.id_book, {
        ...book,
        status: "ARCHIVED",
      });

      onSuccess();
      onClose();
    } catch {
      alert("❌ Error al devolver libro");
    }
  };

  // ===============================
  // 🧩 UI
  // ===============================
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>
          {isInUse ? "📥 Devolver libro" : "📤 Prestar libro"}
        </h2>

        <p>
          <strong>{book.volume_name}</strong> — Tomo {book.volume_number}
        </p>

        {/* ================= PRÉSTAMO ================= */}
        {!isInUse && (
          <>
            <input
              type="text"
              placeholder="Nombre de quien retira *"
              value={borrowedBy}
              onChange={(e) => setBorrowedBy(e.target.value)}
            />

            <input
              type="text"
              placeholder="Cargo / dependencia"
              value={borrowerRole}
              onChange={(e) => setBorrowerRole(e.target.value)}
            />

            <textarea
              placeholder="Observaciones"
              value={loanObs}
              onChange={(e) => setLoanObs(e.target.value)}
            />

            <button onClick={handleLoan} className="btn-primary">
              📤 Prestar libro
            </button>
          </>
        )}

        {/* ================= DEVOLUCIÓN ================= */}
        {isInUse && activeLoan && (
          <>
            <p>
              <strong>Prestado a:</strong>{" "}
              {activeLoan.borrowed_by}
            </p>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={samePerson}
                onChange={() => setSamePerson(!samePerson)}
              />
              Devuelto por el mismo funcionario
            </label>

            {!samePerson && (
              <input
                type="text"
                placeholder="Nombre de quien devuelve *"
                value={returnedBy}
                onChange={(e) => setReturnedBy(e.target.value)}
              />
            )}

            <textarea
              placeholder="Observaciones de devolución"
              value={returnObs}
              onChange={(e) => setReturnObs(e.target.value)}
            />

            <button onClick={handleReturn} className="btn-success">
              📥 Registrar devolución
            </button>
          </>
        )}

        <button onClick={onClose} className="btn-cancel">
          Cancelar
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import generateQRData from "../../utils/generateQRData";

export default function EditBookModal({ show, book, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    year: "",
    tome: "",
    tomeNumber: "",
    registryFrom: "",
    registryTo: "",
    status: "En archivos",
    notes: "",
  });

  const [qrPreview, setQrPreview] = useState("");

  // 🧩 Cargar datos del libro seleccionado
  useEffect(() => {
    if (book) {
      setFormData(book);
      generateQRPreview(book);
    }
  }, [book]);

  // 🔁 Generar vista previa del QR dinámicamente
  async function generateQRPreview(data) {
    try {
      const qrText = generateQRData(
        data.year,
        data.tome,
        data.registryFrom,
        data.registryTo
      );

      if (typeof qrText === "string" && qrText.trim() !== "") {
        const dataUrl = await QRCode.toDataURL(String(qrText));
        setQrPreview(dataUrl);
      } else {
        setQrPreview("");
      }
    } catch (err) {
      console.error("Error generando QR:", err);
      setQrPreview("");
    }
  }

  // 🔄 Manejar cambios de campos
  const handleChange = (e) => {
    const { id, value } = e.target;
    const updated = { ...formData, [id]: value };
    setFormData(updated);
    generateQRPreview(updated);
  };

  // 💾 Guardar cambios
  const handleSubmit = (e) => {
    e.preventDefault();

    const { year, tome, registryFrom, registryTo } = formData;

    // Validaciones básicas
    if (!year || !tome || !registryFrom || !registryTo) {
      alert("⚠️ Todos los campos principales son obligatorios.");
      return;
    }

    // Validar rango numérico
    const isNumFrom = registryFrom !== "s/n" && !isNaN(registryFrom);
    const isNumTo = registryTo !== "s/n" && !isNaN(registryTo);

    if (isNumFrom && isNumTo && parseInt(registryFrom) > parseInt(registryTo)) {
      alert("❌ El registro 'Desde' debe ser menor o igual al 'Hasta'.");
      return;
    }

    // Generar nuevo código QR
    const qr = `${year}-${tome}-${registryFrom}-${registryTo}`;

    onSave({ ...formData, qr });
    onClose();
  };

  if (!show) return null;

  // 🪟 Modal principal
  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <h3>✏️ Editar Libro de Registro</h3>
        <form onSubmit={handleSubmit}>
          {/* Año */}
          <div className="form-group">
            <label>Año (puede ser rango: ej. "1920 - 1925")</label>
            <input
              id="year"
              type="text"
              className="form-input"
              placeholder="Ej: 1920 o 1920 - 1925"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tomo y número */}
          <div className="form-row">
            <div className="form-group">
              <label>Nombre del Tomo</label>
              <input
                id="tome"
                type="text"
                className="form-input"
                placeholder="Ej: Tomo I, Tomo A"
                value={formData.tome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Número de Tomo (opcional)</label>
              <input
                id="tomeNumber"
                type="number"
                className="form-input"
                placeholder="Ej: 1, 2, 3"
                value={formData.tomeNumber || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Registros */}
          <div className="form-row">
            <div className="form-group">
              <label>Registro Desde</label>
              <input
                id="registryFrom"
                type="text"
                className="form-input"
                value={formData.registryFrom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Registro Hasta</label>
              <input
                id="registryTo"
                type="text"
                className="form-input"
                value={formData.registryTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Estado */}
          <div className="form-group">
            <label>Estado</label>
            <select
              id="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="En archivos">En archivos</option>
              <option value="En uso">En uso</option>
            </select>
          </div>

          {/* Notas */}
          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              id="notes"
              className="form-input"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Vista previa QR */}
          {qrPreview && (
            <div className="qr-preview" style={{ textAlign: "center", margin: "1rem 0" }}>
              <img
                src={qrPreview}
                alt="Código QR"
                style={{ width: "160px", height: "160px", borderRadius: "10px" }}
              />
              <p style={{ fontSize: "0.85rem", color: "#555" }}>
                Vista previa del nuevo QR
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="action-buttons">
            <button type="submit" className="btn btn-primary">
              💾 Guardar Cambios
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

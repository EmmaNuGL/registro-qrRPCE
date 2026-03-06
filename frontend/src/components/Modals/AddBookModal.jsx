import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Corrección clave: uso del export correcto

export default function AddBookModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    year: "",
    tome: "",
    tomeNumber: "",
    registryFrom: "",
    registryTo: "",
    status: "ARCHIVED",
    notes: "",
  });

  const [qrData, setQrData] = useState("");
  const [showQR, setShowQR] = useState(false);

  // Manejar cambios de campos
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Generar QR
  const handleGenerateQR = () => {
    if (!formData.year || !formData.tome || !formData.registryFrom || !formData.registryTo) {
      alert("⚠️ Todos los campos principales son obligatorios");
      return;
    }
    const qr = `${formData.year}-${formData.tome}-${formData.registryFrom}-${formData.registryTo}`;
    setQrData(qr);
    setShowQR(true);
  };

  // Descargar QR
  const handleDownloadQR = () => {
    const canvas = document.querySelector("#qrCanvasModal canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${formData.tome}-${formData.year}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Guardar libro
  const handleSubmit = (e) => {
  e.preventDefault();

  if (!qrData) {
    alert("⚠️ Genera el código QR antes de guardar");
    return;
  }

  const payload = {
    qr_code: qrData,
    volume_name: formData.tome,
    volume_number: formData.tomeNumber || null,
    year: formData.year,
    register_from: formData.registryFrom,
    register_to: formData.registryTo,
    status: formData.status,
    observations: formData.notes || null,
  };

  onSave(payload);
  onClose();
};

  if (!show) return null;

  return (
    <div className="modal-overlay active"> {/* 🔧 CORRECCIÓN AQUÍ */}
      <div className="modal-content">
        <h3>Agregar Nuevo Libro de Registro</h3>

        <form onSubmit={handleSubmit}>
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
                value={formData.tomeNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Registro Desde</label>
              <input
                id="registryFrom"
                type="text"
                className="form-input"
                placeholder="Ej: 1 o s/n"
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
                placeholder="Ej: 100 o s/n"
                value={formData.registryTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select
              id="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ARCHIVED">En archivos</option>
              <option value="IN_USE">En uso</option>
            </select>
          </div>

          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              id="notes"
              rows="3"
              className="form-input"
              placeholder="Observaciones adicionales..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* ✅ QR GENERADO */}
          {showQR && (
            <div id="qrCanvasModal" className="qr-display">
              <h4>Vista previa del QR:</h4>
              <QRCodeCanvas value={qrData} size={160} />
              <p>
                <strong>Código:</strong>{" "}
                <span className="qr-data">{qrData}</span>
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDownloadQR}
              >
                📥 Descargar QR
              </button>
            </div>
          )}

          <div className="action-buttons">
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleGenerateQR}
            >
              🔍 Vista Previa QR
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Guardar
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
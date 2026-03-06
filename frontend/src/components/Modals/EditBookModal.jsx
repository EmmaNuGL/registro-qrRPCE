import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import generateQRData from "../../utils/generateQRData";

export default function EditBookModal({ show, book, onClose, onSave }) {

  const [formData, setFormData] = useState({
    id_book: "",
    year: "",
    tome: "",
    tomeNumber: "",
    registryFrom: "",
    registryTo: "",
    status: "ARCHIVED",
    notes: ""
  });

  const [qrPreview, setQrPreview] = useState("");

  // ===============================
  // CARGAR DATOS DEL LIBRO
  // ===============================
  useEffect(() => {

    if (!book) return;

    const mappedData = {
      id_book: book.id_book,
      year: book.year || "",
      tome: book.volume_name || "",
      tomeNumber: book.volume_number || "",
      registryFrom: book.register_from || "",
      registryTo: book.register_to || "",
      status: book.status || "ARCHIVED",
      notes: book.observations || ""
    };

    setFormData(mappedData);

    generateQRPreview(mappedData);

  }, [book]);


  // ===============================
  // GENERAR QR
  // ===============================
  async function generateQRPreview(data) {

    try {

      const qrText = generateQRData(
        data.year,
        data.tome,
        data.registryFrom,
        data.registryTo
      );

      if (qrText) {
        const url = await QRCode.toDataURL(String(qrText));
        setQrPreview(url);
      } else {
        setQrPreview("");
      }

    } catch (err) {

      console.error("Error generando QR:", err);
      setQrPreview("");

    }
  }


  // ===============================
  // CAMBIOS DE FORMULARIO
  // ===============================
  const handleChange = (e) => {

    const { id, value } = e.target;

    const updated = {
      ...formData,
      [id]: value
    };

    setFormData(updated);

    generateQRPreview(updated);

  };


  // ===============================
  // GUARDAR
  // ===============================
  const handleSubmit = (e) => {

    e.preventDefault();

    const { year, tome, registryFrom, registryTo } = formData;

    if (!year || !tome || !registryFrom || !registryTo) {

      alert("⚠️ Todos los campos principales son obligatorios");
      return;

    }

    const qr = `${year}-${tome}-${registryFrom}-${registryTo}`;

    const payload = {

      id_book: formData.id_book,
      year: formData.year,
      volume_name: formData.tome,
      volume_number: formData.tomeNumber || null,
      register_from: formData.registryFrom,
      register_to: formData.registryTo,
      status: formData.status,
      observations: formData.notes || null,
      qr_code: qr

    };

    onSave(payload);

    onClose();

  };


  if (!show) return null;


  return (

    <div className="modal-overlay active">

      <div className="modal-content">

        <h3>✏️ Editar Libro de Registro</h3>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Año</label>
            <input
              id="year"
              type="text"
              className="form-input"
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
                value={formData.tome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Número de Tomo</label>
              <input
                id="tomeNumber"
                type="text"
                className="form-input"
                value={formData.tomeNumber || ""}
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


          <div className="form-group">
            <label>Estado</label>

            <select
              id="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ARCHIVED">En archivo</option>
              <option value="IN_USE">En uso</option>
            </select>

          </div>


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


          {qrPreview && (

            <div className="qr-preview" style={{textAlign:"center", margin:"1rem 0"}}>

              <img
                src={qrPreview}
                alt="QR"
                style={{width:"160px"}}
              />

            </div>

          )}


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
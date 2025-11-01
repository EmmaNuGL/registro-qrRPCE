import React, { useState } from "react";

export default function AddUserModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Usuario",
    password: "",
  });

  const generateTempPassword = () => {
    const temp = Math.random().toString(36).slice(-8);
    setFormData((prev) => ({ ...prev, password: temp }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("⚠️ Todos los campos son obligatorios.");
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal active">
      <div className="modal-content">
        <h3>Agregar Usuario</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="Administrador">Administrador</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="text"
              value={formData.password}
              readOnly
              placeholder="Genera una temporal"
            />
            <button type="button" onClick={generateTempPassword}>
              🔑 Generar Temporal
            </button>
          </div>
          <div className="action-buttons">
            <button type="submit">💾 Guardar</button>
            <button type="button" onClick={onClose}>
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

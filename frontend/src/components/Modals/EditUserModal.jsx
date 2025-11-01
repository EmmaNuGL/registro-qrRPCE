import React, { useState, useEffect } from "react";

export default function EditUserModal({ show, user, onClose, onSave }) {
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal active">
      <div className="modal-content">
        <h3>Editar Usuario</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
          <div className="action-buttons">
            <button type="submit">💾 Guardar Cambios</button>
            <button type="button" onClick={onClose}>
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import AddUserModal from "../components/Modals/AddUserModal";
import EditUserModal from "../components/Modals/EditUserModal";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // === AGREGAR USUARIO ===
  const handleAddUser = (newUser) => {
    const exists = users.find((u) => u.email === newUser.email);
    if (exists) {
      alert("⚠️ El correo ya está registrado.");
      return;
    }
    setUsers((prev) => [...prev, { ...newUser, id: Date.now(), active: true }]);
    alert("✅ Usuario agregado correctamente.");
  };

  // === EDITAR USUARIO ===
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    alert("✅ Usuario actualizado con éxito.");
  };

  // === ELIMINAR USUARIO ===
  const handleDeleteUser = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    setUsers(users.filter((u) => u.id !== id));
    alert("🗑️ Usuario eliminado.");
  };

  // === ACTIVAR / DESACTIVAR ===
  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      )
    );
  };

  // === EXPORTAR EXCEL ===
  const exportToExcel = () => {
    if (!users.length) return alert("No hay usuarios para exportar.");
    const ws = XLSX.utils.json_to_sheet(
      users.map((u) => ({
        Nombre: u.name,
        Correo: u.email,
        Rol: u.role,
        Estado: u.active ? "Activo" : "Inactivo",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios_registro.xlsx");
    alert("✅ Usuarios exportados a Excel.");
  };

  // === EXPORTAR PDF ===
  const exportToPDF = () => {
    if (!users.length) return alert("No hay usuarios para exportar.");
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(16);
    doc.text("Listado de Usuarios del Sistema", 20, 20);
    doc.setFontSize(12);
    let y = 35;
    users.forEach((u, i) => {
      doc.text(
        `${i + 1}. ${u.name} | ${u.email} | ${u.role} | ${
          u.active ? "Activo" : "Inactivo"
        }`,
        20,
        y
      );
      y += 7;
    });
    doc.save("usuarios_registro.pdf");
    alert("📄 PDF generado correctamente.");
  };

  return (
    <div className="users-container">
      <h2>👥 Gestión de Usuarios</h2>

      {/* === BOTONES === */}
      <div className="action-buttons">
        <button onClick={() => setShowAddModal(true)}>➕ Agregar Usuario</button>
        <button onClick={exportToExcel}>📊 Exportar Excel</button>
        <button onClick={exportToPDF}>📄 Exportar PDF</button>
      </div>

      {/* === TABLA === */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span
                    className={`role-badge ${
                      u.role === "Administrador" ? "admin" : "user"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={u.active ? "btn-active" : "btn-inactive"}
                  >
                    {u.active ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEditUser(u)}>✏️</button>
                  <button onClick={() => handleDeleteUser(u.id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* === MODALES === */}
      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddUser}
      />
      <EditUserModal
        show={showEditModal}
        user={selectedUser}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

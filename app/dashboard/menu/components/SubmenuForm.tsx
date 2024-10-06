// SubmenuForm.tsx
import React, { useState } from 'react';

const SubmenuForm = ({
  menuId,
  initialName = '',
  oldSubmenuName,
  handleCreateSubmenu,
  handleUpdateSubmenu,
  closeModal,
}: {
  menuId: string;
  initialName?: string;
  oldSubmenuName?: string;
  handleCreateSubmenu: (menuId: string, submenuName: string) => void;
  handleUpdateSubmenu: (menuId: string, oldSubmenuName: string, newSubmenuName: string) => void;
  closeModal: () => void;
}) => {
  const [submenuName, setSubmenuName] = useState<string>(initialName);

  const isEditing = !!oldSubmenuName;

  const handleSubmit = () => {
    if (isEditing && oldSubmenuName) {
      handleUpdateSubmenu(menuId, oldSubmenuName, submenuName);
    } else {
      handleCreateSubmenu(menuId, submenuName);
    }
    closeModal();
  };

  return (
    <div>
      <h2 className="text-xl mb-4">
        {isEditing ? 'Editar Submenú' : 'Agregar Nuevo Submenú'}
      </h2>
      <input
        type="text"
        value={submenuName}
        onChange={(e) => setSubmenuName(e.target.value)}
        placeholder="Nombre del Submenú"
        className="p-2 border border-white/20 rounded mb-4 w-full bg-white/10 text-white placeholder-gray-300"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        {isEditing ? 'Guardar Cambios' : 'Agregar Submenú'}
      </button>
    </div>
  );
};

export default SubmenuForm;

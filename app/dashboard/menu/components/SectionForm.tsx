// SectionForm.tsx
import React, { useState } from 'react';

const SectionForm = ({
  menuId,
  submenuName,
  initialName = '',
  oldSectionName,
  handleAddSectionToSubmenu,
  handleUpdateSection,
  closeModal,
}: {
  menuId: string;
  submenuName: string;
  initialName?: string;
  oldSectionName?: string;
  handleAddSectionToSubmenu: (menuId: string, submenuName: string, sectionName: string) => void;
  handleUpdateSection: (menuId: string, submenuName: string, oldSectionName: string, newSectionName: string) => void;
  closeModal: () => void;
}) => {
  const [sectionName, setSectionName] = useState<string>(initialName);

  const isEditing = !!oldSectionName;

  const handleSubmit = () => {
    if (isEditing && oldSectionName) {
      handleUpdateSection(menuId, submenuName, oldSectionName, sectionName);
    } else {
      handleAddSectionToSubmenu(menuId, submenuName, sectionName);
    }
    closeModal();
  };

  return (
    <div>
      <h2 className="text-xl mb-4">
        {isEditing ? 'Editar Sección' : 'Agregar Nueva Sección'}
      </h2>
      <input
        type="text"
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
        placeholder="Nombre de la Sección"
        className="p-2 border border-white/20 rounded mb-4 w-full bg-white/10 text-white placeholder-gray-300"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
      >
        {isEditing ? 'Guardar Cambios' : 'Agregar Sección'}
      </button>
    </div>
  );
};

export default SectionForm;

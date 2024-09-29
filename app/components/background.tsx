'use client';

import React from "react";
import { FaSun, FaMoon } from "react-icons/fa"; // Importar íconos

interface ClientBackgroundProps {
  isDarkBackground: boolean;
  toggleBackground: () => void;
}

const ClientBackground: React.FC<ClientBackgroundProps> = ({ isDarkBackground, toggleBackground }) => {
  return (
    <>
      {/* Botón para alternar el fondo */}
      <button
        onClick={toggleBackground}
        className="fixed top-[7px] right-14 z-40 text-white p-2 transition-all"
      >
        {/* Mostrar icono dependiendo del estado */}
        {isDarkBackground ? (
          <FaSun className="text-xl" /> // Mostrar ícono de sol
        ) : (
          <FaMoon className="text-xl" /> // Mostrar ícono de luna
        )}
      </button>

      {/* Fondo dinámico */}
      <div
        className={`w-full h-[100dvh] fixed -z-10 backdrop-blur-md transition-colors duration-700 ${
          isDarkBackground ? "bg-[#0a0a0a]" : "bg-[#0a0a0a]/10"
        }`}
      ></div>
    </>
  );
};

export default ClientBackground;

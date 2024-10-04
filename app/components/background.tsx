'use client';

import Image from "next/image";
import React from "react";

interface ClientBackgroundProps {
  backgroundMode: 'light' | 'dark' | 'neon'; // Cambiamos la prop por el nuevo estado con los tres valores
  toggleBackground: () => void;
}

const ClientBackground: React.FC<ClientBackgroundProps> = ({ backgroundMode, toggleBackground }) => {
  return (
    <>
      {/* Botón para alternar el fondo */}
      <button
        onClick={toggleBackground}
        className="fixed top-[3px] right-14 z-40 text-white p-2 transition-all"
      >
        {/* Mostrar icono dependiendo del estado */}
        {backgroundMode === 'dark' ? (
            <Image 
                src={'/icons/blue-circle.svg'}
                width={30}
                height={30}
                alt="light mode"
            />
        ) : backgroundMode === 'light' ? (
            <Image 
                src={'/icons/white-circle.svg'}
                width={30}
                height={30}
                alt="dark mode"
            />
        ) : (
            <Image 
                src={'/icons/black-circle.svg'} // Nuevo icono para el estado neon
                width={30}
                height={30}
                alt="neon mode"
            />
        )}
      </button>

      {/* Fondo dinámico */}
      <div
        className={`w-full h-[100dvh] fixed -z-10 backdrop-blur-md transition-colors duration-700 ${
          backgroundMode === 'dark'
            ? "bg-[#0a0a0a]" 
            : backgroundMode === 'light'
            ? "bg-[#0a0a0a]/10"
            : "bg-slate-100"
        }`}
      ></div>
    </>
  );
};

export default ClientBackground;

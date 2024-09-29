'use client';

import Image from "next/image";
import React from "react";

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
        className="fixed top-[3px] right-14 z-40 text-white p-2 transition-all"
      >
        {/* Mostrar icono dependiendo del estado */}
        {isDarkBackground ? (
            <Image 
                src={'/icons/blue-circle.svg'}
                width={30}
                height={30}
                alt="light mode"
            />
        ) : (
            <Image 
                src={'/icons/black-circle.svg'}
                width={30}
                height={30}
                alt="dark mode"
            />
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

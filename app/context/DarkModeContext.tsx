'use client';

import React, { createContext, useContext, useState } from 'react';

interface DarkModeContextType {
  isDarkBackground: boolean;
  toggleBackground: () => void;
}

// Crear el contexto
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Proveedor del contexto
export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  const toggleBackground = () => {
    setIsDarkBackground((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkBackground, toggleBackground }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Hook para usar el contexto
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode debe ser usado dentro de un DarkModeProvider');
  }
  return context;
};

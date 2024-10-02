'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DarkModeContextType {
  isDarkBackground: boolean;
  toggleBackground: () => void;
}

// Crear el contexto
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Proveedor del contexto
export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  // Cargar la preferencia del tema desde localStorage al iniciar
  useEffect(() => {
    const savedThemePreference = localStorage.getItem('isDarkBackground');
    if (savedThemePreference !== null) {
      setIsDarkBackground(JSON.parse(savedThemePreference));
    }
  }, []);

  const toggleBackground = () => {
    setIsDarkBackground((prev) => {
      const newValue = !prev;
      // Guardar la nueva preferencia en localStorage
      localStorage.setItem('isDarkBackground', JSON.stringify(newValue));
      return newValue;
    });
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

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type BackgroundMode = 'light' | 'dark' | 'neon';

interface DarkModeContextType {
  backgroundMode: BackgroundMode;
  toggleBackground: () => void;
}

// Crear el contexto
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Proveedor del contexto
export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('dark');

  // Cargar la preferencia del tema desde localStorage al iniciar
  useEffect(() => {
    const savedThemePreference = localStorage.getItem('backgroundMode');
    if (savedThemePreference) {
      setBackgroundMode(savedThemePreference as BackgroundMode);
    }
  }, []);

  const toggleBackground = () => {
    setBackgroundMode((prevMode) => {
      const newMode: BackgroundMode = prevMode === 'dark' ? 'light' : prevMode === 'light' ? 'neon' : 'dark';

      // Guardar la nueva preferencia en localStorage
      localStorage.setItem('backgroundMode', newMode);

      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ backgroundMode, toggleBackground }}>
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

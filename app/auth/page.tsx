'use client';
import React from 'react';
import Image from 'next/image';  // Importamos Image para usar el logo de Google

const AuthPage = () => {

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API;
    window.location.href = `${apiUrl}/auth/google`; // Cambia localhost por la URL del backend en producción
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh]">
      {/* Botón para iniciar sesión con Google */}
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center  bg-white text-black/70 py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition font-semibold"
      >
        {/* Logo de Google */}
        <Image
          src="/icons/google.svg" // Asegúrate de tener este archivo o usa un enlace público
          alt="Google Logo"
          width={30}
          height={30}
          className="mr-3"
        />
        Continuar con Google
      </button>
    </div>
  );
};

export default AuthPage;

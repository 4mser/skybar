// auth/page.tsx
'use client';
import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Si el usuario ya está autenticado, redirigir al perfil
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API;
    window.location.href = `${apiUrl}/auth/google`;
  };

  // Mientras se verifica la autenticación, podemos mostrar un indicador de carga o nada
  if (isAuthenticated) {
    return <p>Redirigiendo al perfil...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-[100dvh]">
      {/* Botón para iniciar sesión con Google */}
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center bg-white text-black/70 py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition font-semibold"
      >
        {/* Logo de Google */}
        <Image
          src="/icons/google.svg"
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

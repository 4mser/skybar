// profile/page.tsx
'use client';
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const router = useRouter();

  // Si el usuario no está autenticado, redirigir a la página de autenticación
  if (!isAuthenticated) {
    router.push('/auth');
    return <p className="text-center">Redirigiendo a la página de autenticación...</p>;
  }

  if (!user) {
    return <p className="text-center">Cargando perfil...</p>;
  }

  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
  
    // Redirigir al backend para cerrar sesión en Google
    const apiUrl = process.env.NEXT_PUBLIC_API;
    window.location.href = `${apiUrl}/auth/logout`; // Ruta del backend que maneja el cierre de sesión de Google
  };
  

  // Determinar el color del rol
  const getRoleColor = () => {
    switch (user.role) {
      case 'superadmin':
        return 'bg-green-600';
      case 'admin':
        return 'bg-cyan-600';
      case 'worker':
        return 'bg-yellow-500';
      default:
        return '';  // No mostrar si el rol es 'user'
    }
  };

  return (
    <div className="pt-12 flex flex-col items-center justify-center text-white">
      <div className="p-8 w-full max-w-md text-center">
        {user.photo && (
          <img
            src={user.photo}
            alt="Foto de perfil"
            className="mx-auto rounded-full w-32 h-32 mb-6 object-cover"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
        <p className="text-sm text-neutral-400 mb-4">{user.email}</p>
        
        {/* Mostrar el rol solo si no es 'user' */}
        {user.role !== 'user' && (
          <span className={`inline-block  text-xs uppercase font-semibold py-1 px-3 rounded-full ${getRoleColor()}`}>
            {user.role}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

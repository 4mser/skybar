'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Interfaz para tipar el usuario
interface User {
  username: string;
  email: string;
  role: string;
  photo?: string;  // Añadimos la foto como opcional
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');  // Si no hay token, redirigir a la página de autenticación
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API;  // Usamos la variable de entorno para la URL
        const response = await axios.get(`${apiUrl}/users/me`, {  // Usamos la URL base de la variable de entorno
          headers: {
            Authorization: `Bearer ${token}`, // Enviamos el token en el header
          },
        });
        setUser(response.data);  // Establecemos los datos del usuario
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth');  // Si falla la obtención de datos, redirigir a autenticación
      }
    };

    fetchUserData();
  }, [router]);

  if (!user) {
    return <p className="text-center">Cargando perfil...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');  // Eliminamos el token de localStorage
    router.push('/auth');  // Redirigimos a la página de autenticación
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
